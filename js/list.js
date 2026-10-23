/* Shared, side-effect-free list pipeline for films and local reviews. */
(() => {
  'use strict';
  const collator = new Intl.Collator('vi', { sensitivity: 'base', numeric: true });
  const normalize = value => String(value ?? '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd')
    .toLocaleLowerCase('vi').trim().replace(/\s+/g, ' ');
  const defaults = () => ({ query: '', filters: {}, sort: 'asc', size: 10, page: 1 });
  function run(source, state = defaults()) {
    if (!Array.isArray(source) || source.some(item => !item || typeof item.title !== 'string' || !item.title.trim())) {
      throw new TypeError('Danh sách có bản ghi thiếu tiêu đề hợp lệ.');
    }
    const query = normalize(state.query);
    const filters = state.filters || {};
    const matched = source.map((item, index) => ({ item, index }))
      .filter(({ item }) => normalize(item.title).includes(query))
      .filter(({ item }) => Object.entries(filters).every(([key, value]) => {
        if (value === '' || value == null) return true;
        const field = item[key];
        return Array.isArray(field) ? field.some(entry => String(entry) === String(value)) : String(field) === String(value);
      }))
      .sort((a, b) => {
        let comparison;
        if (state.sort === 'added-desc' || state.sort === 'added-asc') {
          comparison = (Date.parse(a.item.addedAt) || 0) - (Date.parse(b.item.addedAt) || 0);
          if (state.sort === 'added-desc') comparison = -comparison;
        } else if (state.sort === 'rating-desc' || state.sort === 'rating-asc') {
          const left = Number.isFinite(a.item.listRating) ? a.item.listRating : null;
          const right = Number.isFinite(b.item.listRating) ? b.item.listRating : null;
          comparison = left == null ? (right == null ? 0 : 1) : right == null ? -1 : left - right;
          if (left != null && right != null && state.sort === 'rating-desc') comparison = -comparison;
        } else {
          comparison = collator.compare(a.item.title, b.item.title);
          if (state.sort === 'desc') comparison = -comparison;
        }
        return comparison || a.index - b.index;
      }).map(({ item }) => item);
    const total = matched.length;
    const size = state.size === 'all' ? 'all' : ([10, 20, 50].includes(Number(state.size)) ? Number(state.size) : 10);
    const pages = total ? (size === 'all' ? 1 : Math.ceil(total / size)) : 0;
    const page = pages ? Math.min(pages, Math.max(1, Math.trunc(Number(state.page)) || 1)) : 1;
    const offset = size === 'all' ? 0 : (page - 1) * size;
    return { items: size === 'all' ? matched : matched.slice(offset, offset + size), total, pages, page,
      start: total ? offset + 1 : 0, end: total ? (size === 'all' ? total : Math.min(total, offset + size)) : 0 };
  }
  function changed(state, patch) { return { ...state, ...patch, page: 1 }; }
  function clearFilters(state) {
    return changed(state, { filters: Object.fromEntries(Object.keys(state.filters || {}).map(key => [key, ''])) });
  }
  function renderPagination(root, result, onPage) {
    root.replaceChildren();
    const info = document.createElement('span');
    info.className = 'page-information';
    info.textContent = result.total ? `Hiển thị ${result.start}–${result.end} trên ${result.total} kết quả` : '0 kết quả';
    const controls = document.createElement('div');
    controls.className = 'page-controls';
    for (const [label, target, disabled] of [
      ['← Trước', result.page - 1, !result.pages || result.page <= 1],
      ['Sau →', result.page + 1, !result.pages || result.page >= result.pages]
    ]) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'button button-small button-outline';
      button.textContent = label; button.disabled = disabled;
      button.addEventListener('click', () => onPage(target));
      if (target < result.page) controls.append(button);
      else {
        const current = document.createElement('span');
        current.textContent = result.pages ? `${result.page} / ${result.pages}` : 'Không có trang';
        current.className = 'page-current'; controls.append(current, button);
      }
    }
    root.append(info, controls);
  }
  window.KH = window.KH || {};
  window.KH.list = { normalize, defaults, run, changed, clearFilters, renderPagination };
  const el = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  const link = (label, href, className = '', external = false) => {
    const node = el('a', className, label); node.href = href;
    if (external) { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
    return node;
  };
  function imageFallback(image, title, poster = true) {
    image.addEventListener('error', () => {
      image.hidden = true;
      if (poster && image.parentElement && !image.parentElement.querySelector('.poster-unavailable')) {
        image.parentElement.append(el('span', 'poster-unavailable', `Chưa tải được poster ${title}`));
      }
    }, { once: true });
  }
  window.KH.dom = { el, link, imageFallback };
})();
