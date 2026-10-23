(() => {
  'use strict';
  const { movies, list, scores, storage, reviews, auth, dom: { el, link, imageFallback } } = window.KH;
  const root = document.getElementById('detail-root');
  const params = new URLSearchParams(location.search);
  const movie = movies.find(item => item.id === params.get('id'));
  const backParams = new URLSearchParams(params.get('catalog') || '');
  const backHref = `index.html${backParams.size ? '?' + backParams : ''}#catalog`;
  if (!movie) {
    document.title = 'Không tìm thấy phim — Khung Hình';
    const empty = el('section', 'invalid-movie container');
    empty.append(el('p', 'eyebrow', 'KHUNG HÌNH / KHÔNG TÌM THẤY'), el('h1', '', 'Khung hình này chưa có trong thư viện.'),
      el('p', '', 'Liên kết có thể chưa đúng. Hãy trở lại để tìm một bộ phim khác.'), link('Về thư viện phim ↗', backHref, 'button button-accent'));
    root.append(empty); return;
  }
  document.title = `${movie.title} (${movie.year}) — Khung Hình`;
  const backdrop = el('div', `detail-backdrop${movie.backdrop ? '' : ' no-backdrop'}`);
  if (movie.backdrop) {
    const image = el('img'); image.alt = `Ảnh quảng bá chính thức ${movie.title}`; image.fetchPriority = 'high';
    imageFallback(image, '', false); image.src = movie.backdrop; backdrop.append(image);
  }
  const body = el('article', 'detail-body container');
  body.append(link('← Trở lại thư viện phim', backHref, 'detail-breadcrumb'));
  const main = el('div', 'detail-main'); const posterColumn = el('div'); const posterWrap = el('div', 'detail-poster');
  const poster = el('img'); poster.alt = `Poster chính thức ${movie.title}`; poster.width = 600; poster.height = 900;
  imageFallback(poster, movie.title); poster.src = movie.poster; posterWrap.append(poster);
  const credit = el('p', 'poster-credit'); credit.append(link(`Poster: ${movie.studio} ↗`, movie.images.page, '', true));
  posterColumn.append(posterWrap, credit);
  const info = el('div', 'detail-info');
  info.append(el('p', 'eyebrow', 'MỘT CÂU CHUYỆN ĐÁNG KHÁM PHÁ'), el('h1', 'detail-title', movie.title),
    el('p', 'detail-original', `Tên gốc: ${movie.originalTitle || movie.title}`));
  const meta = el('div', 'detail-meta');
  for (const value of [movie.year, movie.runtime ? `${movie.runtime} phút` : 'Chưa xác minh thời lượng', movie.countries?.join(' / ') || 'Chưa xác minh quốc gia']) meta.append(el('span', '', value));
  const genres = el('div', 'genre-tags'); (movie.genres || []).forEach(genre => genres.append(el('span', 'genre-tag', genre)));
  const detailActions = el('div', 'detail-actions');
  detailActions.append(link('Viết cảm nhận của bạn ↗', '#reviews-section', 'button button-accent'));
  const watchlistButton = el('button', 'button button-outline watchlist-toggle'); watchlistButton.type = 'button';
  watchlistButton.addEventListener('click', async () => {
    if (watchlistButton.disabled) return;
    const account = auth.get();
    if (!account) { auth.requestLogin(movie.id); return; }
    watchlistButton.disabled = true; watchlistButton.setAttribute('aria-busy', 'true'); watchlistButton.textContent = 'Đang cập nhật…';
    try {
      const exists = auth.getWatchlist().some(entry => entry.movieId === movie.id);
      if (exists) { await auth.removeFromWatchlist(movie.id); auth.showToast('Đã xóa phim khỏi Watchlist.'); }
      else { await auth.addToWatchlist(movie.id); auth.showToast('Đã thêm phim vào Watchlist.'); }
    } catch (error) { auth.showToast(error.message); }
    finally { watchlistButton.disabled = false; watchlistButton.removeAttribute('aria-busy'); renderWatchlistButton(); }
  });
  function renderWatchlistButton() {
    const saved = auth.getWatchlist().some(entry => entry.movieId === movie.id);
    watchlistButton.textContent = saved ? '✓ Đã thêm vào Watchlist' : '+ Watchlist';
    watchlistButton.setAttribute('aria-pressed', String(saved));
  }
  auth.subscribe(renderWatchlistButton); renderWatchlistButton(); detailActions.append(watchlistButton);
  info.append(meta, genres, el('p', 'detail-summary', movie.summary || 'Chưa có nội dung giới thiệu đã xác minh.'), detailActions);
  const mobileDescription = el('div', 'detail-description-wrap'); mobileDescription.append(el('p', 'detail-summary', movie.summary || 'Chưa có nội dung giới thiệu đã xác minh.'));
  main.append(posterColumn, info, mobileDescription); body.append(main);
  const facts = el('dl', 'detail-facts');
  for (const [label, value] of [['Đạo diễn', movie.director || 'Chưa xác minh'], ['Diễn viên nổi bật', movie.cast?.join(' · ') || 'Chưa xác minh'], ['Phát hành / nguồn thông tin', movie.studio]]) {
    const group = el('div'); group.append(el('dt', '', label), el('dd', '', value)); facts.append(group);
  }
  body.append(facts);
  const section = el('section', 'detail-section'); section.setAttribute('aria-labelledby', 'scores-title');
  section.append(el('p', 'eyebrow', '02 — NHỮNG GÓC NHÌN'));
  const heading = el('h2', '', 'Mỗi đánh giá, một góc nhìn.'); heading.id = 'scores-title'; section.append(heading);
  const dashboard = el('div', 'score-dashboard'); const explanation = el('p', 'score-explanation'); explanation.setAttribute('role', 'status');
  function renderScores() {
    const result = scores.calculate(movie, storage.get(movie.id)); dashboard.replaceChildren();
    for (const [label, value, note, className] of [
      ['Điểm chuyên gia', result.critics, 'Metascore · quy đổi thang 10', ''],
      ['Khán giả bên ngoài', result.audience, 'Metacritic User Score', ''],
      ['Điểm trong trình duyệt', result.internal, `${result.count} review cục bộ`, ''],
      ['Điểm tổng hợp', result.total, 'Kết hợp các nhóm đang có dữ liệu', 'combined']
    ]) {
      const tile = el('div', `score-tile glass ${className}`); const score = el('strong', '', scores.format(value)); score.append(el('span', 'unit', ' /10'));
      tile.append(el('span', 'score-label', label), score, el('small', '', value == null ? 'Chưa có đánh giá' : note)); dashboard.append(tile);
    }
    explanation.textContent = scores.note(result);
  }
  section.append(dashboard, explanation);
  const method = el('details', 'score-method'); method.append(el('summary', '', 'Điểm tổng hợp được tính như thế nào?'),
    el('p', '', 'Chuẩn hóa các điểm chất lượng hợp lệ về thang 10. Điểm bên ngoài là trung bình của nhóm chuyên gia và nhóm khán giả bên ngoài đang có dữ liệu. Khi có review nội bộ: điểm tổng hợp = (điểm bên ngoài + điểm nội bộ) / 2. Chỉ có một nhóm thì dùng nhóm đó; không có nhóm nào thì chưa có đánh giá. Chỉ làm tròn khi hiển thị.'),
    el('p', '', 'Các tỷ lệ tích cực như Tomatometer và Popcornmeter không được đưa vào phép tính này. Điểm nội bộ chỉ phản ánh review trong trình duyệt hiện tại.'));
  section.append(method);
  const tableWrapper = el('div', 'source-table-wrapper'); const table = el('table', 'source-table');
  const caption = el('caption', 'sr-only', 'Nguồn điểm của phim, thang điểm gốc và ngày xác minh'); table.append(caption);
  const thead = el('thead'); const headRow = el('tr');
  ['Nguồn', 'Loại điểm', 'Điểm gốc', 'Kiểm tra'].forEach(label => { const th = el('th', '', label); th.scope = 'col'; headRow.append(th); }); thead.append(headRow);
  const tbody = el('tbody');
  // Sources are also a data list: use the same title/filter/sort/pagination rules.
  const sourceRecords = (movie.ratings || []).map(source => ({ ...source, id: `${movie.id}:${source.source}:${source.group}:${source.label}`, title: `${source.source} — ${source.label}` }));
  let sourceState = { ...list.defaults(), filters: { group: '' } };
  const sourceTools = el('details', 'score-method'); sourceTools.append(el('summary', '', 'Tra cứu nguồn đánh giá'));
  const sourceFields = el('div', 'source-fields');
  const searchLabel = el('label', 'form-field'); searchLabel.append(el('span', '', 'Tìm theo tên nguồn / loại điểm'));
  const sourceSearch = el('input'); sourceSearch.type = 'search'; sourceSearch.id = 'source-search'; searchLabel.append(sourceSearch);
  sourceFields.append(searchLabel);
  for (const [key, label, choices] of [
    ['group', 'Nhóm điểm', [['', 'Tất cả'], ['critics', 'Chuyên gia'], ['audience', 'Khán giả']]],
    ['sort', 'Sắp xếp', [['asc', 'Tiêu đề A–Z'], ['desc', 'Tiêu đề Z–A']]],
    ['size', 'Hiển thị', [['10', '10 nguồn'], ['20', '20 nguồn'], ['50', '50 nguồn'], ['all', 'Tất cả']]]
  ]) {
    const labelNode = el('label', 'field'); labelNode.append(el('span', '', label));
    const select = el('select'); select.id = `source-${key}`;
    for (const [value, text] of choices) select.add(new Option(text, value));
    select.addEventListener('change', () => {
      sourceState = list.changed(sourceState, key === 'group' ? { filters: { group: select.value } } : { [key]: select.value });
      renderSources();
    }); labelNode.append(select); sourceFields.append(labelNode);
  }
  const clearSources = el('button', 'clear-button', 'Xóa bộ lọc ↺'); clearSources.type = 'button'; clearSources.id = 'source-clear';
  clearSources.addEventListener('click', () => { sourceState = list.clearFilters(sourceState); document.getElementById('source-group').value = ''; renderSources(); });
  sourceFields.append(clearSources); sourceTools.append(sourceFields);
  sourceSearch.addEventListener('input', () => { sourceState = list.changed(sourceState, { query: sourceSearch.value }); renderSources(); });
  const sourcePagination = el('nav', 'pagination source-pagination'); sourcePagination.setAttribute('aria-label', 'Phân trang nguồn đánh giá');
  function renderSources() {
    const result = list.run(sourceRecords, sourceState); sourceState.page = result.page; tbody.replaceChildren();
    for (const source of result.items) {
      const row = el('tr'); const sourceCell = el('td'); sourceCell.append(link(`${source.source} ↗`, source.url, '', true));
      row.append(sourceCell, el('td', '', source.group === 'critics' ? `Chuyên gia · ${source.label}` : `Khán giả · ${source.label}`),
        el('td', source.status === 'verified' ? '' : 'unverified', source.status === 'verified' ? `${source.value}/${source.scale}` : 'Chưa xác minh'),
        el('td', '', source.checkedAt ? source.checkedAt.split('-').reverse().join('/') : 'Chưa xác minh')); tbody.append(row);
    }
    if (!result.total) { const row = el('tr'); const cell = el('td', '', 'Không có kết quả phù hợp'); cell.colSpan = 4; row.append(cell); tbody.append(row); }
    list.renderPagination(sourcePagination, result, page => { sourceState.page = page; renderSources(); });
  }
  table.append(thead, tbody); tableWrapper.append(table); section.append(sourceTools, tableWrapper, sourcePagination); renderSources();
  const check = el('p', 'source-check', 'Dữ liệu snapshot · kiểm tra 22/10/2026.');
  check.append(link('Thông tin phim ↗', movie.sources.info, '', true), link('Quốc gia / chi tiết ↗', movie.sources.countries, '', true), link('Thời lượng theo nguồn ↗', movie.sources.runtime, '', true));
  section.append(check); body.append(section); root.append(backdrop, body);
  document.getElementById('reviews-section').hidden = false;
  renderScores(); storage.subscribe(renderScores);
  const reviewUI = reviews.mount(movie);
  const requestedReview = params.get('review');
  if (requestedReview && !reviewUI.edit(requestedReview)) auth.showToast('Không thể mở bài đánh giá này để chỉnh sửa.');
})();
