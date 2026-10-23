(() => {
  'use strict';
  window.KH = window.KH || {};
  const MAX_FILE = 2 * 1024 * 1024;
  const MAX_DATA = 100000;
  const valid = value => typeof value === 'string' && value.length <= MAX_DATA
    && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
  const initial = account => [...(account?.displayName || account?.username || '?').trim()][0]?.toLocaleUpperCase('vi') || '?';
  function node(account, className = 'account-avatar') {
    const wrapper = document.createElement('span'); wrapper.className = className;
    wrapper.setAttribute('role', 'img');
    wrapper.setAttribute('aria-label', `Avatar của ${account?.displayName || account?.username || 'bạn'}`);
    if (valid(account?.avatarImage)) {
      const image = document.createElement('img'); image.src = account.avatarImage; image.alt = '';
      image.addEventListener('error', () => { wrapper.textContent = initial(account); }, { once: true });
      wrapper.append(image);
    } else wrapper.textContent = initial(account);
    return wrapper;
  }
  async function prepare(file) {
    if (!(file instanceof Blob) || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      throw new Error('Chọn ảnh PNG, JPEG hoặc WebP.');
    }
    if (!file.size || file.size > MAX_FILE) throw new Error('Ảnh phải có dung lượng từ 1 byte đến 2 MB.');
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url;
      try { await image.decode(); } catch (_) { throw new Error('Không thể đọc ảnh. Hãy chọn tệp ảnh hợp lệ khác.'); }
      if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth > 4096 || image.naturalHeight > 4096) {
        throw new Error('Kích thước ảnh tối đa là 4096 × 4096 pixel.');
      }
      const scale = Math.min(1, 256 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Trình duyệt không thể xử lý ảnh này.');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const result = canvas.toDataURL('image/webp', 0.82);
      if (!valid(result)) throw new Error('Ảnh sau xử lý vẫn quá lớn. Hãy chọn ảnh đơn giản hơn.');
      return result;
    } finally { URL.revokeObjectURL(url); }
  }
  window.KH.avatar = { valid, node, prepare, initial };
})();
