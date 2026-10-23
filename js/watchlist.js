(() => {
  'use strict';
  const { movies, list, scores, storage, auth, dom: { el, imageFallback } } = window.KH;
  const $ = id => document.getElementById(id);
  const controls = {
    query: $('watchlist-search'), genre: $('watchlist-genre'), year: $('watchlist-year'),
    score: $('watchlist-score'), sort: $('watchlist-sort'), size: $('watchlist-size')
  };
  let state = { ...list.defaults(), filters: { genres: '', year: '', scoreBand: '' } };
  let ownerId;
  const stateKey = id => `khung-hinh:watchlist-view:${id}`;
  function restoreState(id) {
    state = { ...list.defaults(), filters: { genres: '', year: '', scoreBand: '' } };
    try {
      const saved = JSON.parse(sessionStorage.getItem(stateKey(id)));
      if (saved && typeof saved === 'object') {
        state.query = typeof saved.query === 'string' ? saved.query.slice(0, 200) : '';
        state.sort = ['asc', 'desc', 'added-asc', 'added-desc', 'rating-asc', 'rating-desc'].includes(saved.sort) ? saved.sort : 'asc';
        state.size = ['10', '20', '50', 'all'].includes(String(saved.size)) ? saved.size : 10;
        state.page = Math.max(1, Math.trunc(Number(saved.page)) || 1);
        for (const [key, control] of [['genres', controls.genre], ['year', controls.year], ['scoreBand', controls.score]]) {
          const value = saved.filters?.[key];
          state.filters[key] = [...control.options].some(option => option.value === value) ? value : '';
        }
      }
    } catch (_) { /* Invalid view preferences do not affect saved movies. */ }
    controls.query.value = state.query; controls.sort.value = state.sort; controls.size.value = String(state.size);
    controls.genre.value = state.filters.genres; controls.year.value = state.filters.year; controls.score.value = state.filters.scoreBand;
  }
  function addOptions(select, items) {
    [...new Set(items)].sort(new Intl.Collator('vi', { numeric: true }).compare)
      .forEach(value => select.add(new Option(String(value), String(value))));
  }
  function band(score) { return score == null ? 'none' : score >= 8 ? 'high' : score >= 6 ? 'mid' : 'low'; }
  function formatDate(value) {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
  }
  function card(record, heading = 'h2') {
    const movie = record.movie;
    const article = el('article', 'watchlist-card glass'); article.dataset.movieId = movie.id;
    const posterLink = el('a', 'watchlist-poster-link'); posterLink.href = `movie.html?id=${encodeURIComponent(movie.id)}`;
    posterLink.setAttribute('aria-label', `Xem chi tiết ${movie.title}`);
    const poster = el('img'); poster.src = movie.poster; poster.alt = `Poster phim ${movie.title}`;
    poster.loading = 'lazy'; poster.decoding = 'async'; poster.width = 600; poster.height = 900;
    imageFallback(poster, movie.title); posterLink.append(poster);
    const info = el('div', 'watchlist-card-info');
    info.append(el('p', 'eyebrow', `${movie.year} · ${movie.genres.join(' / ')}`));
    info.append(el(heading, 'watchlist-card-title'));
    const title = el('a', '', movie.title); title.href = posterLink.href; info.querySelector('.watchlist-card-title').append(title);
    const sourceScore = record.listRating == null ? 'Chưa có điểm tổng hợp' : `Điểm tổng hợp ${scores.format(record.listRating)}/10`;
    info.append(el('p', 'watchlist-rating', sourceScore), el('p', 'watchlist-added', `Đã thêm ${formatDate(record.addedAt)}`));
    const remove = el('button', 'button button-small button-outline watchlist-remove', 'Xóa khỏi Watchlist');
    remove.type = 'button'; remove.dataset.movieId = movie.id;
    remove.setAttribute('aria-label', `Xóa ${movie.title} khỏi Watchlist`); info.append(remove);
    article.append(posterLink, info); return article;
  }
  function records() {
    return auth.getWatchlist().map(entry => {
      const movie = movies.find(item => item.id === entry.movieId);
      if (!movie) throw new Error(`Watchlist tham chiếu phim không tồn tại: ${entry.movieId}`);
      const score = scores.calculate(movie, storage.get(movie.id)).total;
      return { ...movie, movie, addedAt: entry.addedAt, listRating: score, scoreBand: band(score) };
    });
  }
  window.KH.watchlist = { card, records };
  if (!$('watchlist-grid')) return;
  addOptions(controls.genre, movies.flatMap(movie => movie.genres));
  addOptions(controls.year, movies.map(movie => movie.year));
  function render() {
    const account = auth.get();
    if (account?.id !== ownerId) { ownerId = account?.id; restoreState(ownerId); }
    $('watchlist-signin').hidden = Boolean(account);
    $('watchlist-controls').hidden = !account;
    $('watchlist-toolbar').hidden = !account;
    $('watchlist-owner').textContent = account ? `Danh sách của ${account.displayName}` : '';
    if (!account) {
      $('watchlist-summary').textContent = '';
      $('watchlist-count').textContent = '';
      $('watchlist-grid').replaceChildren(); $('watchlist-pagination').replaceChildren();
      $('watchlist-empty').hidden = true; return;
    }
    let records;
    try {
      records = window.KH.watchlist.records();
    } catch (error) {
      $('watchlist-summary').textContent = error.message; $('watchlist-grid').replaceChildren();
      $('watchlist-empty').hidden = true; $('watchlist-pagination').replaceChildren(); return;
    }
    $('watchlist-count').textContent = `${records.length} phim đã lưu`;
    const filteredState = { ...state, filters: { ...state.filters } };
    let matched;
    try { matched = list.run(records, filteredState); }
    catch (error) { $('watchlist-summary').textContent = error.message; return; }
    state.page = matched.page;
    try { sessionStorage.setItem(stateKey(account.id), JSON.stringify(state)); } catch (_) { /* Browsing remains usable without view persistence. */ }
    $('watchlist-summary').textContent = matched.total
      ? `Hiển thị ${matched.start}–${matched.end} trên ${matched.total} phim` : 'Không có kết quả phù hợp · 0 phim';
    $('watchlist-grid').replaceChildren(...matched.items.map(record => card(record)));
    const noSavedMovies = records.length === 0;
    $('watchlist-empty').hidden = !noSavedMovies && matched.total !== 0;
    $('watchlist-empty-title').textContent = noSavedMovies ? 'Watchlist của bạn đang trống.' : 'Không tìm thấy phim phù hợp.';
    $('watchlist-empty-copy').textContent = noSavedMovies
      ? 'Hãy khám phá và lưu lại những bộ phim bạn muốn xem.' : 'Thử điều chỉnh từ khóa hoặc bộ lọc.';
    $('watchlist-pagination').hidden = noSavedMovies || !matched.total;
    list.renderPagination($('watchlist-pagination'), matched, page => { state.page = page; render(); });
  }
  $('watchlist-login').addEventListener('click', auth.openLogin);
  controls.query.addEventListener('input', () => { state = list.changed(state, { query: controls.query.value }); render(); });
  controls.genre.addEventListener('change', () => { state = list.changed(state, { filters: { ...state.filters, genres: controls.genre.value } }); render(); });
  controls.year.addEventListener('change', () => { state = list.changed(state, { filters: { ...state.filters, year: controls.year.value } }); render(); });
  controls.score.addEventListener('change', () => { state = list.changed(state, { filters: { ...state.filters, scoreBand: controls.score.value } }); render(); });
  controls.sort.addEventListener('change', () => { state = list.changed(state, { sort: controls.sort.value }); render(); });
  controls.size.addEventListener('change', () => { state = list.changed(state, { size: controls.size.value }); render(); });
  $('watchlist-clear').addEventListener('click', () => {
    state = list.clearFilters(state); controls.genre.value = ''; controls.year.value = ''; controls.score.value = ''; render();
  });
  $('watchlist-grid').addEventListener('click', async event => {
    const button = event.target.closest('.watchlist-remove');
    if (!button || button.disabled) return;
    button.disabled = true; button.textContent = 'Đang xóa…'; button.setAttribute('aria-busy', 'true');
    try {
      await auth.removeFromWatchlist(button.dataset.movieId); auth.showToast('Đã xóa phim khỏi Watchlist.');
      const next = $('watchlist-grid').querySelector('.watchlist-remove') || $('watchlist-search'); next.focus({ preventScroll: true });
    }
    catch (error) { auth.showToast(error.message); }
    finally { button.disabled = false; button.textContent = 'Xóa khỏi Watchlist'; button.removeAttribute('aria-busy'); }
  });
  auth.subscribe(render); storage.subscribe(render); render();
})();
