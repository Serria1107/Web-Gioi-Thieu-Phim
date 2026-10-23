(() => {
  'use strict';
  const { auth, avatar, movies, storage, list, watchlist, dom: { el, link, imageFallback } } = window.KH;
  const $ = id => document.getElementById(id);
  const date = value => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
  const validTabs = ['overview', 'watchlist', 'reviews'];
  let tab = validTabs.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview';
  let ownerId;
  let controls;
  let pendingDelete = null;
  let states = {};
  const defaults = () => ({ ...list.defaults(), filters: {} });
  function currentState() { return states[tab] || (states[tab] = defaults()); }
  function makeControls() {
    const root = $('profile-controls'); root.replaceChildren(); controls = {};
    const wrapper = el('label', 'form-field profile-search-label'); wrapper.append(el('span', '', tab === 'reviews' ? 'Tìm theo tiêu đề cảm nhận' : 'Tìm theo tiêu đề'));
    const query = el('input'); query.type = 'search'; query.maxLength = 200; query.id = 'profile-search'; query.value = currentState().query;
    query.placeholder = 'Tìm trong góc riêng của bạn…'; wrapper.append(query); root.append(wrapper); controls.query = query;
    query.addEventListener('input', () => { states[tab] = list.changed(currentState(), { query: query.value }); render(); });
    const definitions = tab === 'watchlist' ? [['genres', 'Thể loại'], ['year', 'Năm phát hành'], ['scoreBand', 'Khoảng điểm']]
      : tab === 'reviews' ? [['score', 'Mức điểm']] : [['kind', 'Hoạt động']];
    for (const [name, label] of definitions) addSelect(name, label, [], true);
    addSelect('sort', 'Sắp xếp', [['asc', 'Tiêu đề A–Z'], ['desc', 'Tiêu đề Z–A'], ['added-desc', 'Mới nhất'], ['added-asc', 'Cũ nhất']]);
    addSelect('size', 'Hiển thị', [['10', '10 mục'], ['20', '20 mục'], ['50', '50 mục'], ['all', 'Tất cả']]);
    const clear = el('button', 'clear-button', 'Xóa bộ lọc ↺'); clear.type = 'button'; clear.id = 'profile-clear';
    clear.addEventListener('click', () => { states[tab] = list.clearFilters(currentState()); render(); }); root.append(clear);
  }
  function addSelect(name, label, options, filter = false) {
    const wrapper = el('label', 'field'); wrapper.append(el('span', '', label));
    const select = el('select'); select.id = `profile-${name}`; controls[name] = select;
    options.forEach(([value, text]) => select.add(new Option(text, value)));
    if (!filter) select.value = String(currentState()[name]);
    wrapper.append(select); $('profile-controls').append(wrapper);
    select.addEventListener('change', () => {
      states[tab] = list.changed(currentState(), filter ? { filters: { ...currentState().filters, [name]: select.value } } : { [name]: select.value }); render();
    });
  }
  function filterOptions(name, values, format = value => String(value)) {
    const select = controls[name]; if (!select) return;
    select.replaceChildren(new Option('Tất cả', ''));
    [...new Set(values)].sort(new Intl.Collator('vi', { numeric: true }).compare)
      .forEach(value => select.add(new Option(format(value), String(value))));
    const value = currentState().filters[name] || '';
    if (![...select.options].some(option => option.value === value)) currentState().filters[name] = '';
    select.value = currentState().filters[name] || '';
  }
  function reviewCard(review) {
    const movie = movies.find(item => item.id === review.movieId);
    const article = el('article', 'profile-review-card glass'); article.dataset.reviewId = review.id;
    if (movie) {
      const posterLink = link('', `movie.html?id=${encodeURIComponent(movie.id)}`, 'profile-review-poster');
      posterLink.setAttribute('aria-label', `Xem ${movie.title}`);
      const poster = el('img'); poster.src = movie.poster; poster.alt = `Poster ${movie.title}`; poster.loading = 'lazy'; poster.width = 600; poster.height = 900;
      imageFallback(poster, movie.title); posterLink.append(poster); article.append(posterLink);
    }
    const content = el('div', 'profile-review-content');
    const movieHeading = el('h3'); movieHeading.append(movie ? link(movie.title, `movie.html?id=${encodeURIComponent(movie.id)}`) : el('span', '', 'Phim không còn trong thư viện'));
    content.append(movieHeading, el('p', 'profile-review-score', `${review.score / 2} / 5 sao`), el('h4', '', review.title), el('p', 'review-body', review.body));
    const time = el('time', 'review-date', `${date(review.createdAt)}${review.updatedAt !== review.createdAt ? ` · Đã sửa ${date(review.updatedAt)}` : ''}`); time.dateTime = review.createdAt; content.append(time);
    const actions = el('div', 'profile-card-actions');
    if (movie) {
      actions.append(link('Xem chi tiết ↗', `movie.html?id=${encodeURIComponent(movie.id)}#reviews-section`, 'text-link'),
        link('Chỉnh sửa', `movie.html?id=${encodeURIComponent(movie.id)}&review=${encodeURIComponent(review.id)}#reviews-section`, 'text-button profile-review-edit'));
    }
    const remove = el('button', 'text-button profile-review-delete', 'Xóa đánh giá'); remove.type = 'button'; remove.dataset.action = 'delete'; actions.append(remove); content.append(actions);
    if (pendingDelete === review.id) {
      const confirmation = el('div', 'delete-confirm'); confirmation.setAttribute('role', 'group'); confirmation.setAttribute('aria-label', 'Xác nhận xóa đánh giá');
      confirmation.append(el('span', '', 'Xóa cảm nhận này?'));
      for (const [action, label] of [['confirm-delete', 'Xóa đánh giá'], ['cancel-delete', 'Giữ lại']]) {
        const button = el('button', 'button button-small button-outline', label); button.type = 'button'; button.dataset.action = action; confirmation.append(button);
      }
      content.append(confirmation);
    }
    article.append(content); return article;
  }
  function activityCard(record) {
    const article = el('article', 'profile-activity glass');
    article.append(el('span', 'activity-mark', record.kind === 'watchlist' ? '＋' : '✎'));
    const content = el('div'); content.append(el('p', 'eyebrow', record.kind === 'watchlist' ? 'ĐÃ LƯU VÀO WATCHLIST' : 'ĐÃ VIẾT CẢM NHẬN'));
    const heading = el('h3');
    if (movies.some(movie => movie.id === record.movieId)) heading.append(link(record.title, `movie.html?id=${encodeURIComponent(record.movieId)}${record.kind === 'review' ? '#reviews-section' : ''}`));
    else heading.textContent = record.title;
    const time = el('time', 'review-date', date(record.addedAt)); time.dateTime = record.addedAt;
    content.append(heading, time); article.append(content); return article;
  }
  function render() {
    const account = auth.get();
    $('profile-signin').hidden = Boolean(account); $('profile-private').hidden = !account;
    if (!account) {
      ownerId = null; states = {}; controls = null; pendingDelete = null;
      for (const id of ['profile-list', 'profile-avatar', 'profile-controls', 'profile-pagination']) $(id).replaceChildren();
      for (const id of ['profile-name', 'profile-username', 'profile-email', 'profile-bio', 'profile-joined', 'profile-results', 'stat-watchlist', 'stat-reviews', 'stat-average', 'stat-movies']) $(id).textContent = '';
      document.title = 'Hồ sơ của tôi — Khung Hình'; return;
    }
    if (ownerId !== account.id) { ownerId = account.id; states = {}; controls = null; pendingDelete = null; }
    document.title = `${account.displayName} — Hồ sơ Khung Hình`;
    $('profile-avatar').replaceChildren(avatar.node(account, 'profile-avatar'));
    $('profile-name').textContent = account.displayName; $('profile-username').textContent = `@${account.username}`;
    $('profile-email').textContent = account.email;
    $('profile-joined').textContent = `Tham gia ${date(account.createdAt)}`;
    $('profile-bio').textContent = account.bio || 'Mỗi bộ phim là một câu chuyện mới. Hãy thêm vài dòng giới thiệu về bạn.';
    const reviews = storage.all().filter(review => review.ownerId === account.id);
    const saved = watchlist.records();
    $('stat-watchlist').textContent = String(saved.length); $('stat-reviews').textContent = String(reviews.length);
    $('stat-average').textContent = reviews.length ? (reviews.reduce((sum, review) => sum + review.score / 2, 0) / reviews.length).toFixed(1) : '—';
    $('stat-movies').textContent = String(new Set(reviews.map(review => review.movieId)).size);
    if (!controls) makeControls();
    document.querySelectorAll('[data-tab]').forEach(button => { const selected = button.dataset.tab === tab; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
    $('profile-panel').setAttribute('aria-labelledby', `tab-${tab}`);
    $('profile-view-all').hidden = tab !== 'watchlist';
    const titles = { overview: ['01 — DẤU ẤN ĐIỆN ẢNH', 'Những câu chuyện gần đây.', 'Tối đa 10 hoạt động mới nhất từ phim đang lưu và những cảm nhận đã viết.'],
      watchlist: ['02 — HẸN MỘT BUỔI CHIẾU', 'Những bộ phim đang chờ bạn.', 'Một góc nhìn nhanh vào Watchlist cá nhân của bạn.'],
      reviews: ['03 — GÓC NHÌN CỦA BẠN', 'Điều còn lại sau bộ phim.', 'Xem lại, chỉnh sửa và quản lý những cảm nhận của riêng bạn.'] };
    ['profile-section-label', 'profile-section-title', 'profile-section-copy'].forEach((id, index) => { $(id).textContent = titles[tab][index]; });
    let records;
    if (tab === 'watchlist') {
      records = saved; filterOptions('genres', saved.flatMap(record => record.genres)); filterOptions('year', saved.map(record => record.year));
      filterOptions('scoreBand', saved.map(record => record.scoreBand), value => ({ high: '8–10 /10', mid: '6–7,9 /10', low: 'Dưới 6 /10', none: 'Chưa có điểm' }[value]));
    } else if (tab === 'reviews') {
      records = reviews.map(review => ({ ...review, addedAt: review.createdAt })); filterOptions('score', reviews.map(review => review.score), score => `${score / 2}/5 sao`);
    } else {
      records = [...saved.map(record => ({ id: `saved:${record.id}`, movieId: record.id, title: record.title, addedAt: record.addedAt, kind: 'watchlist' })),
        ...reviews.map(review => ({ id: `review:${review.id}`, movieId: review.movieId, title: review.title, addedAt: review.createdAt, kind: 'review' }))]
        .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt)).slice(0, 10);
      filterOptions('kind', records.map(record => record.kind), kind => kind === 'watchlist' ? 'Phim đã lưu' : 'Bài đánh giá');
    }
    const result = list.run(records, currentState()); currentState().page = result.page;
    $('profile-results').textContent = result.total ? `Hiển thị ${result.start}–${result.end} trên ${result.total} kết quả` : 'Không có kết quả phù hợp · 0 kết quả';
    const root = $('profile-list'); root.className = tab === 'watchlist' ? 'movie-grid watchlist-grid profile-watchlist-grid' : 'profile-content-list'; root.replaceChildren();
    if (result.total) result.items.forEach(record => root.append(tab === 'watchlist' ? watchlist.card(record, 'h3') : tab === 'reviews' ? reviewCard(record) : activityCard(record)));
    else {
      const empty = el('div', 'empty-state glass profile-empty'); empty.append(el('span', 'empty-symbol', '⌕'), el('h3', '', records.length ? 'Không có kết quả phù hợp.' : 'Câu chuyện của bạn bắt đầu ở đây.'),
        el('p', '', records.length ? 'Thử thay đổi từ khóa hoặc bộ lọc.' : 'Khám phá phim, lưu vào Watchlist và chia sẻ góc nhìn của bạn.'), link('Khám phá phim ↗', 'index.html#catalog', 'button button-outline')); root.append(empty);
    }
    list.renderPagination($('profile-pagination'), result, page => { currentState().page = page; render(); $('profile-results').tabIndex = -1; $('profile-results').focus({ preventScroll: true }); });
    $('profile-storage-notice').textContent = storage.notice(); $('profile-storage-notice').hidden = !storage.notice();
  }
  function selectTab(value, focus = false) {
    if (!validTabs.includes(value)) return;
    tab = value; controls = null; pendingDelete = null;
    history.replaceState(null, '', `${location.pathname}#${tab}`); render();
    if (focus) $(`tab-${tab}`).focus();
  }
  document.querySelector('.profile-tabs').addEventListener('click', event => { const button = event.target.closest('[data-tab]'); if (button) selectTab(button.dataset.tab); });
  document.querySelector('.profile-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = validTabs.indexOf(tab);
    selectTab(validTabs[event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3], true);
  });
  $('profile-list').addEventListener('click', async event => {
    const button = event.target.closest('button'); if (!button || button.disabled) return;
    const account = auth.get(); if (!account) { render(); return; }
    const card = button.closest('[data-review-id], [data-movie-id]'); if (!card) return;
    if (button.classList.contains('watchlist-remove')) {
      button.disabled = true;
      try { await auth.removeFromWatchlist(card.dataset.movieId); auth.showToast('Đã xóa phim khỏi Watchlist.'); }
      catch (error) { auth.showToast(error.message); } finally { button.disabled = false; }
      $('profile-search')?.focus({ preventScroll: true }); return;
    }
    const review = storage.all().find(record => record.id === card.dataset.reviewId && record.ownerId === account.id); if (!review) return;
    if (button.dataset.action === 'delete') { pendingDelete = review.id; render(); $('profile-list').querySelector('[data-action="confirm-delete"]')?.focus({ preventScroll: true }); }
    else if (button.dataset.action === 'cancel-delete') { pendingDelete = null; render(); $('profile-search').focus({ preventScroll: true }); }
    else if (button.dataset.action === 'confirm-delete') {
      button.disabled = true;
      try {
        const removed = await storage.remove(review.id, review.movieId, account.id); pendingDelete = null;
        auth.showToast(removed ? `Đã xóa đánh giá.${storage.notice() ? ' Thay đổi chỉ lưu trong phiên này.' : ''}` : 'Không thể xóa đánh giá bằng tài khoản hiện tại.');
      } catch (error) { auth.showToast(error.message); }
      finally { button.disabled = false; render(); $('profile-search')?.focus({ preventScroll: true }); }
    }
  });
  $('profile-login').addEventListener('click', auth.openLogin);
  window.addEventListener('hashchange', () => selectTab(location.hash.slice(1)));
  auth.subscribe(render); storage.subscribe(render); render();
})();
