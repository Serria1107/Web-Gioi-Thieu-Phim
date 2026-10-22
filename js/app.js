(() => {
  'use strict';
  const { movies, list, scores, storage, dom: { el, link, imageFallback } } = window.KH;
  const $ = id => document.getElementById(id);
  const controls = { query: $('search'), genres: $('genre'), year: $('year'), countries: $('country'), sort: $('sort'), size: $('page-size') };
  const params = new URLSearchParams(location.search);
  let state = { ...list.defaults(), query: (params.get('q') || '').slice(0, 200),
    filters: { genres: params.get('genre') || '', year: params.get('year') || '', countries: params.get('country') || '' },
    sort: params.get('sort') === 'desc' ? 'desc' : 'asc',
    size: ['10', '20', '50', 'all'].includes(params.get('size')) ? params.get('size') : 10,
    page: Math.max(1, Math.trunc(Number(params.get('page'))) || 1) };
  function options(control, values) {
    [...new Set(values)].sort(new Intl.Collator('vi', { numeric: true }).compare).forEach(value => {
      const option = el('option', '', value); option.value = String(value); control.append(option);
    });
  }
  options(controls.genres, movies.flatMap(movie => movie.genres));
  options(controls.year, movies.map(movie => movie.year));
  options(controls.countries, movies.flatMap(movie => movie.countries));
  options($('nav-genre'), movies.flatMap(movie => movie.genres));
  Object.entries(state.filters).forEach(([key, value]) => {
    if (![...controls[key].options].some(option => option.value === value)) state.filters[key] = '';
  });
  controls.query.value = state.query;
  controls.sort.value = state.sort; controls.size.value = String(state.size);
  Object.entries(state.filters).forEach(([key, value]) => { controls[key].value = value; });
  $('nav-genre').value = state.filters.genres;
  function currentParams() {
    const query = new URLSearchParams();
    if (state.query) query.set('q', state.query);
    if (state.filters.genres) query.set('genre', state.filters.genres);
    if (state.filters.year) query.set('year', state.filters.year);
    if (state.filters.countries) query.set('country', state.filters.countries);
    if (state.sort !== 'asc') query.set('sort', state.sort);
    if (String(state.size) !== '10') query.set('size', state.size);
    if (state.page !== 1) query.set('page', String(state.page));
    return query;
  }
  function detailHref(movie) {
    const query = new URLSearchParams({ id: movie.id });
    const catalog = currentParams().toString();
    if (catalog) query.set('catalog', catalog);
    return `movie.html?${query}`;
  }
  function scoreRow(label, value, className = '') {
    const row = el('p', `card-score ${className}`);
    row.append(el('span', '', label), el('strong', '', `${scores.format(value)}${value == null ? '' : '/10'}`));
    return row;
  }
  function scoreCard(movie) {
    const result = scores.calculate(movie, storage.get(movie.id));
    const card = el('div', 'card-scores');
    card.append(scoreRow('Điểm chuyên gia', result.critics), scoreRow('Khán giả bên ngoài', result.audience), scoreRow('Điểm tổng hợp', result.total, 'total'));
    const note = el('p', 'card-score-note', result.internal == null ? 'Chưa có đánh giá nội bộ' : `${result.count} review trong trình duyệt này`);
    card.append(note); return card;
  }
  function movieCard(movie) {
    const card = el('article', 'movie-card'); card.dataset.movieId = movie.id;
    const scene = el('div', 'flip-scene'); const inner = el('div', 'flip-inner');
    const front = el('button', 'poster-front'); front.type = 'button'; front.dataset.flip = 'open';
    front.setAttribute('aria-label', `Lật thẻ ${movie.title}`); front.setAttribute('aria-expanded', 'false');
    front.setAttribute('aria-controls', `back-${movie.id}`);
    const poster = el('img'); poster.alt = `Poster chính thức phim ${movie.title}`; poster.loading = 'lazy'; poster.decoding = 'async'; poster.width = 600; poster.height = 900;
    imageFallback(poster, movie.title); poster.src = movie.poster;
    front.append(poster, el('span', 'poster-action', '↻ Lật thẻ để khám phá'));
    const back = el('div', 'poster-back'); back.id = `back-${movie.id}`; back.inert = true; back.setAttribute('aria-hidden', 'true');
    back.append(el('span', 'eyebrow', 'GÓC NHÌN ĐIỆN ẢNH'), el('h3', '', movie.title),
      el('p', 'back-meta', `${movie.year} · ${movie.genres.join(' / ')}`), el('p', 'back-summary', movie.summary));
    const backScores = el('div', 'back-scores'); const result = scores.calculate(movie, storage.get(movie.id));
    for (const [label, value] of [['Chuyên gia', result.critics], ['Khán giả bên ngoài', result.audience]]) {
      const row = el('p'); row.append(el('span', '', label), el('strong', '', `${scores.format(value)}/10`)); backScores.append(row);
    }
    const actions = el('div', 'back-actions');
    const view = link('Xem chi tiết ↗', detailHref(movie), 'button button-accent');
    const flipBack = el('button', 'flip-back', '↶ Trở lại poster'); flipBack.type = 'button'; flipBack.dataset.flip = 'close';
    actions.append(view, flipBack); back.append(backScores, actions); inner.append(front, back); scene.append(inner);
    const title = el('h3', 'movie-title'); title.append(link(movie.title, detailHref(movie)));
    const titleRow = el('div', 'movie-title-row'); titleRow.append(title);
    card.append(scene, titleRow, el('p', 'movie-meta', `${movie.year} · ${movie.genres[0]}`), scoreCard(movie));
    return card;
  }
  function renderHeroScores() {
    const movie = movies.find(item => item.id === 'top-gun-maverick');
    const result = scores.calculate(movie, storage.get(movie.id));
    $('hero-scores').replaceChildren();
    for (const [label, value] of [['CHUYÊN GIA', result.critics], ['KHÁN GIẢ BÊN NGOÀI', result.audience], ['ĐIỂM TỔNG HỢP', result.total]]) {
      const block = el('div', 'hero-score'); const valueNode = el('strong', '', scores.format(value));
      valueNode.append(el('span', 'score-unit', ' /10'));
      block.append(valueNode, el('small', '', label)); $('hero-scores').append(block);
    }
  }
  function render() {
    let result;
    try { result = list.run(movies, state); } catch (error) {
      $('results-summary').textContent = error.message; return;
    }
    state.page = result.page;
    const query = currentParams().toString();
    try { history.replaceState(null, '', `${location.pathname}${query ? '?' + query : ''}${location.hash}`); } catch (_) { /* file:// may restrict history. */ }
    const fragment = document.createDocumentFragment(); result.items.forEach(movie => fragment.append(movieCard(movie)));
    $('movie-grid').replaceChildren(fragment);
    $('empty-state').hidden = result.total !== 0;
    $('results-summary').textContent = result.total ? `${result.total} bộ phim đang chờ bạn khám phá` : 'Không có kết quả phù hợp · 0 phim';
    $('collection-count').textContent = `${movies.length} BỘ PHIM · NHIỀU GÓC NHÌN`;
    list.renderPagination($('pagination'), result, page => {
      state.page = page; render();
      $('catalog-title').scrollIntoView({ block: 'start' }); $('catalog-title').tabIndex = -1; $('catalog-title').focus({ preventScroll: true });
    });
  }
  controls.query.addEventListener('input', () => { state = list.changed(state, { query: controls.query.value }); render(); });
  for (const key of ['genres', 'year', 'countries']) controls[key].addEventListener('change', () => {
    state = list.changed(state, { filters: { ...state.filters, [key]: controls[key].value } });
    $('nav-genre').value = state.filters.genres; render();
  });
  for (const key of ['sort', 'size']) controls[key].addEventListener('change', () => {
    state = list.changed(state, { [key]: controls[key].value }); render();
  });
  $('clear-filters').addEventListener('click', () => {
    state = list.clearFilters(state); Object.keys(state.filters).forEach(key => { controls[key].value = ''; });
    $('nav-genre').value = ''; render();
  });
  $('nav-genre').addEventListener('change', event => {
    state = list.changed(state, { filters: { ...state.filters, genres: event.target.value } });
    controls.genres.value = event.target.value; render(); $('catalog').scrollIntoView({ block: 'start' });
  });
  $('movie-grid').addEventListener('click', event => {
    const button = event.target.closest('button[data-flip]'); if (!button) return;
    const card = button.closest('.movie-card'); const front = card.querySelector('.poster-front'); const back = card.querySelector('.poster-back');
    const open = button.dataset.flip === 'open';
    card.classList.toggle('is-flipped', open);
    front.setAttribute('aria-expanded', String(open)); front.setAttribute('aria-hidden', String(open));
    back.inert = !open; back.setAttribute('aria-hidden', String(!open));
    if (open) { front.inert = true; back.querySelector('a').focus({ preventScroll: true }); }
    else { front.inert = false; front.focus({ preventScroll: true }); }
  });
  const heroImage = document.querySelector('.hero-image'); imageFallback(heroImage, '', false);
  render(); renderHeroScores();
  storage.subscribe(() => {
    /* Refresh only scores, preserving filters, page, flipped cards, focus and input. */
    $('movie-grid').querySelectorAll('.movie-card').forEach(card => {
      const movie = movies.find(item => item.id === card.dataset.movieId);
      card.querySelector('.card-scores').replaceWith(scoreCard(movie));
    });
    renderHeroScores();
  });
})();
