(() => {
  'use strict';
  window.KH = window.KH || {};
  const KEY = 'khung-hinh:reviews:v1';
  const text = (value, limit) => typeof value === 'string' && value.trim().length > 0 && value.length <= limit;
  function valid(review) {
    return Boolean(review && text(review.id, 100) && text(review.movieId, 100)
      && text(review.author, 80) && text(review.title, 120) && text(review.body, 3000)
      && typeof review.score === 'number' && Number.isFinite(review.score) && review.score >= 1 && review.score <= 10
      && (review.ownerId == null || text(review.ownerId, 100))
      && typeof review.createdAt === 'string' && Number.isFinite(Date.parse(review.createdAt))
      && typeof review.updatedAt === 'string' && Number.isFinite(Date.parse(review.updatedAt)));
  }
  function decode(raw) {
    if (raw == null) return [];
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.reviews) || !data.reviews.every(valid)
      || new Set(data.reviews.map(review => review.id)).size !== data.reviews.length) {
      throw new Error('Dữ liệu review không hợp lệ.');
    }
    return data.reviews;
  }
  function create(provider = () => localStorage, actor = null) {
    const listeners = new Set();
    const memory = new Map();
    let notice = '';
    let corrupt = false;
    function read() {
      try {
        const result = decode(provider().getItem(KEY));
        corrupt = false;
        notice = '';
        return result;
      } catch (error) {
        if (error instanceof SyntaxError || error.message === 'Dữ liệu review không hợp lệ.') {
          corrupt = true;
          notice = 'Dữ liệu đánh giá đã lưu bị lỗi. Bản cũ được giữ nguyên; thay đổi mới chỉ lưu trong phiên này.';
        } else notice = 'Trình duyệt không cho truy cập lưu trữ. Đánh giá mới chỉ lưu trong phiên này.';
        return [];
      }
    }
    let records = read();
    function emit() { listeners.forEach(listener => listener()); }
    function save(next) {
      if (!next.every(valid)) throw new TypeError('Đánh giá không hợp lệ.');
      records = next;
      if (!corrupt) {
        try {
          provider().setItem(KEY, JSON.stringify({ version: 1, reviews: records }));
          notice = ''; memory.clear();
        } catch (_) {
          notice = 'Không thể lưu vào trình duyệt (bị chặn hoặc đầy). Thay đổi hiện chỉ được giữ trong phiên này.';
          memory.set(KEY, records);
        }
      } else memory.set(KEY, records);
      emit();
    }
    function upsert(review, expectedUpdatedAt = null) {
      if (actor && (!actor() || actor().id !== review.ownerId)) throw new Error('Hãy đăng nhập đúng tài khoản để lưu đánh giá.');
      if (actor && (!Number.isInteger(review.score) || !window.KH.movies.some(movie => movie.id === review.movieId))) {
        throw new Error('Phim hoặc mức điểm đánh giá không hợp lệ.');
      }
      if (actor && !memory.has(KEY)) records = read();
      if (!valid(review)) throw new TypeError('Vui lòng kiểm tra các trường đánh giá.');
      const found = records.find(item => item.id === review.id);
      if (expectedUpdatedAt != null && (!found || found.updatedAt !== expectedUpdatedAt)) throw new Error('Đánh giá đã thay đổi ở trang khác. Hãy tải lại trước khi sửa.');
      if (found && found.movieId !== review.movieId) throw new Error('ID đánh giá thuộc phim khác.');
      if (!review.ownerId) throw new TypeError('Đánh giá mới cần có tài khoản sở hữu.');
      if (found && found.ownerId !== review.ownerId) throw new Error('Bạn không thể chỉnh sửa đánh giá này.');
      if (found && found.createdAt !== review.createdAt) throw new Error('Không thể thay đổi ngày tạo đánh giá.');
      save(found ? records.map(item => item.id === review.id ? { ...review } : item) : [...records, { ...review }]);
    }
    function remove(id, movieId, ownerId) {
      if (actor && (!actor() || actor().id !== ownerId)) return false;
      if (actor && !memory.has(KEY)) records = read();
      const found = records.find(item => item.id === id && item.movieId === movieId);
      if (!found || !ownerId || found.ownerId !== ownerId) return false;
      save(records.filter(item => item !== found)); return true;
    }
    function refresh() {
      if (memory.has(KEY)) return;
      records = read(); emit();
    }
    return {
      key: KEY, valid, decode, create, upsert, remove, refresh,
      get: movieId => records.filter(item => item.movieId === movieId).map(item => ({ ...item })),
      all: () => records.map(item => ({ ...item })),
      notice: () => notice, subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); }
    };
  }
  const store = create(() => localStorage, () => window.KH.auth?.get());
  // Coordinate read/modify/write across documents. The small factory remains synchronous for isolated stores.
  let pending = Promise.resolve();
  for (const method of ['upsert', 'remove']) {
    const write = store[method];
    store[method] = (...args) => {
      const action = () => write(...args);
      if (navigator.locks?.request) return navigator.locks.request('khung-hinh:reviews-write', action);
      const task = pending.then(action); pending = task.catch(() => {}); return task;
    };
  }
  window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) store.refresh(); });
  window.addEventListener('pageshow', store.refresh);
  window.KH.storage = store;
})();
