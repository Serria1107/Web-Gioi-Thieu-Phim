(() => {
  'use strict';
  const { list, storage, scores, dom: { el } } = window.KH;
  const $ = id => document.getElementById(id);
  function mount(movie) {
    const form = $('review-form');
    const fields = Object.fromEntries(['author', 'title', 'score', 'body'].map(key => [key, $(`review-${key}`)]));
    let state = { ...list.defaults(), filters: { score: '' } };
    let editingId = null;
    let pendingDelete = null;
    const formatDate = value => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
    function resetEdit(clearStatus = true) {
      editingId = null; form.reset(); $('cancel-edit').hidden = true;
      $('form-heading').textContent = 'Lưu lại góc nhìn của bạn.';
      $('review-submit').textContent = 'Gửi đánh giá ↗';
      Object.entries(fields).forEach(([key, field]) => { field.removeAttribute('aria-invalid'); $(`review-${key}-error`).textContent = ''; });
      if (clearStatus) $('form-status').textContent = '';
    }
    function reviewCard(review) {
      const card = el('article', 'review-card'); card.dataset.reviewId = review.id;
      const head = el('div', 'review-card-head');
      const avatar = el('span', 'review-avatar', [...review.author][0].toLocaleUpperCase('vi')); avatar.setAttribute('aria-hidden', 'true');
      const author = el('div'); author.append(el('span', 'review-author', review.author));
      const date = el('time', 'review-date', formatDate(review.createdAt)); date.dateTime = review.createdAt; author.append(date);
      const point = el('span', 'review-score', scores.format(review.score)); point.append(el('small', '', ' /10'));
      head.append(avatar, author, point); card.append(head, el('h4', '', review.title), el('p', 'review-body', review.body));
      const actions = el('div', 'review-actions');
      for (const [action, label, className] of [['edit', 'Sửa cảm nhận', ''], ['delete', 'Xóa', 'delete-review']]) {
        const button = el('button', className, label); button.type = 'button'; button.dataset.action = action;
        button.setAttribute('aria-label', `${label}: ${review.title}`); actions.append(button);
      }
      card.append(actions);
      if (pendingDelete === review.id) {
        const confirmation = el('div', 'delete-confirm'); confirmation.setAttribute('role', 'group'); confirmation.setAttribute('aria-label', 'Xác nhận xóa đánh giá');
        confirmation.append(el('span', '', 'Xóa đánh giá này khỏi trình duyệt?'));
        for (const [action, label] of [['confirm-delete', 'Xóa đánh giá'], ['cancel-delete', 'Giữ lại']]) {
          const button = el('button', 'button button-small button-outline', label); button.type = 'button'; button.dataset.action = action; confirmation.append(button);
        }
        card.append(confirmation);
      }
      return card;
    }
    function render() {
      const reviews = storage.get(movie.id);
      const filter = $('review-filter');
      filter.replaceChildren(new Option('Tất cả', ''));
      [...new Set(reviews.map(review => review.score))].sort((a, b) => a - b).forEach(score => filter.add(new Option(`${score}/10`, String(score))));
      if (state.filters.score && !reviews.some(review => String(review.score) === state.filters.score)) {
        state = list.changed(state, { filters: { score: '' } });
      }
      filter.value = state.filters.score;
      const result = list.run(reviews, state); state.page = result.page;
      $('review-count').textContent = String(reviews.length);
      $('review-results').textContent = result.total ? `${result.total} cảm nhận phù hợp` : 'Không có kết quả phù hợp · 0 review';
      const root = $('review-list'); root.replaceChildren();
      if (!result.total) {
        const empty = el('div', 'empty-state glass'); empty.append(el('span', 'empty-symbol', '✎'),
          el('h3', '', reviews.length ? 'Không có kết quả phù hợp' : 'Câu chuyện của bạn bắt đầu ở đây.'),
          el('p', '', reviews.length ? 'Thử tiêu đề hoặc mức điểm khác.' : 'Chưa có review trong trình duyệt này. Hãy viết cảm nhận đầu tiên.'));
        root.append(empty);
      } else result.items.forEach(review => root.append(reviewCard(review)));
      list.renderPagination($('review-pagination'), result, page => { state.page = page; render(); $('review-results').tabIndex = -1; $('review-results').focus({ preventScroll: false }); });
      $('storage-notice').textContent = storage.notice(); $('storage-notice').hidden = !storage.notice();
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const values = { author: fields.author.value.trim(), title: fields.title.value.trim(), body: fields.body.value.trim(), score: fields.score.valueAsNumber };
      const errors = {
        author: !values.author || values.author.length > 80 ? 'Nhập tên từ 1 đến 80 ký tự.' : '',
        title: !values.title || values.title.length > 120 ? 'Nhập tiêu đề từ 1 đến 120 ký tự.' : '',
        body: !values.body || values.body.length > 3000 ? 'Nhập nội dung từ 1 đến 3000 ký tự.' : '',
        score: !Number.isFinite(values.score) || values.score < 1 || values.score > 10 ? 'Nhập điểm hợp lệ từ 1 đến 10.' : ''
      };
      for (const [key, message] of Object.entries(errors)) {
        $(`review-${key}-error`).textContent = message;
        fields[key].setAttribute('aria-invalid', String(Boolean(message)));
      }
      const invalid = Object.keys(errors).find(key => errors[key]);
      if (invalid) { fields[invalid].focus(); $('form-status').textContent = 'Vui lòng kiểm tra các trường được đánh dấu.'; return; }
      const existing = editingId ? storage.get(movie.id).find(review => review.id === editingId) : null;
      if (editingId && !existing) { $('form-status').textContent = 'Review này không còn tồn tại. Hủy sửa để tạo đánh giá mới; nội dung bạn nhập vẫn được giữ.'; return; }
      const now = new Date().toISOString();
      const id = existing?.id || (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `review-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      try {
        storage.upsert({ id, movieId: movie.id, ...values, createdAt: existing?.createdAt || now, updatedAt: now });
        const edited = Boolean(editingId); resetEdit(false);
        $('form-status').textContent = `${edited ? 'Đã cập nhật' : 'Đã gửi'} đánh giá và tính lại điểm.${storage.notice() ? ' Thay đổi hiện chỉ lưu trong phiên này.' : ' Đánh giá đã lưu trong trình duyệt.'}`;
      } catch (error) { $('form-status').textContent = error.message; }
    });
    $('cancel-edit').addEventListener('click', () => { resetEdit(); fields.author.focus(); });
    $('review-search').addEventListener('input', event => { state = list.changed(state, { query: event.target.value }); pendingDelete = null; render(); });
    $('review-filter').addEventListener('change', event => { state = list.changed(state, { filters: { score: event.target.value } }); render(); });
    for (const [id, key] of [['review-sort', 'sort'], ['review-size', 'size']]) $(id).addEventListener('change', event => { state = list.changed(state, { [key]: event.target.value }); render(); });
    $('review-clear').addEventListener('click', () => { state = list.clearFilters(state); render(); });
    $('review-list').addEventListener('click', event => {
      const button = event.target.closest('button[data-action]'); if (!button) return;
      const card = button.closest('.review-card');
      const review = storage.get(movie.id).find(item => item.id === card?.dataset.reviewId); if (!review) return;
      switch (button.dataset.action) {
        case 'edit':
          editingId = review.id;
          Object.entries(fields).forEach(([key, field]) => { field.value = review[key]; field.removeAttribute('aria-invalid'); $(`review-${key}-error`).textContent = ''; });
          $('form-heading').textContent = 'Chỉnh sửa cảm nhận.'; $('review-submit').textContent = 'Lưu thay đổi ↗';
          $('cancel-edit').hidden = false; $('form-status').textContent = ''; fields.title.focus(); break;
        case 'delete':
          pendingDelete = review.id; render();
          [...$('review-list').children].find(node => node.dataset.reviewId === review.id)?.querySelector('[data-action="confirm-delete"]')?.focus({ preventScroll: true });
          break;
        case 'cancel-delete':
          pendingDelete = null; render();
          [...$('review-list').children].find(node => node.dataset.reviewId === review.id)?.querySelector('[data-action="delete"]')?.focus({ preventScroll: true });
          break;
        case 'confirm-delete':
          pendingDelete = null;
          if (editingId === review.id) resetEdit();
          storage.remove(review.id, movie.id);
          $('form-status').textContent = `Đã xóa đánh giá và tính lại điểm.${storage.notice() ? ' Thay đổi hiện chỉ lưu trong phiên này.' : ''}`;
          $('review-results').tabIndex = -1; $('review-results').focus({ preventScroll: true }); break;
      }
    });
    render(); storage.subscribe(render);
    return { render };
  }
  window.KH.reviews = { mount };
})();
