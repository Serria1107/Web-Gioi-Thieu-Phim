(() => {
  'use strict';
  const { auth, avatar } = window.KH;
  const $ = id => document.getElementById(id);
  const form = $('profile-edit-form');
  const names = ['displayName', 'username', 'email', 'bio'];
  let original = null;
  let ownerId = null;
  let image = '';
  let generation = 0;
  let preparing = false;
  let saving = false;
  let dirty = false;
  let imageError = '';
  function status(message, error = false) { $('edit-status').textContent = message; $('edit-status').classList.toggle('is-error', error); }
  function values() { return { ...Object.fromEntries(names.map(name => [name, $(`edit-${name}`).value])), avatarImage: image, expectedVersion: original?.profileVersion ?? 0 }; }
  function showErrors(errors) {
    for (const [name, message] of Object.entries(errors)) {
      const field = name === 'avatarImage' ? $('edit-avatar') : $(`edit-${name}`);
      if (!field) continue;
      field.setAttribute('aria-invalid', String(Boolean(message))); $(`edit-${name}-error`).textContent = message;
    }
  }
  function preview() {
    $('edit-avatar-preview').replaceChildren(avatar.node({ ...original, displayName: $('edit-displayName').value || original?.displayName, avatarImage: image }, 'profile-avatar'));
  }
  function hydrate(account) {
    original = { ...account }; image = account.avatarImage; imageError = ''; dirty = false; generation++; preparing = false;
    form.reset(); names.forEach(name => { $(`edit-${name}`).value = account[name]; });
    showErrors({ ...Object.fromEntries(names.map(name => [name, ''])), avatarImage: '' }); status(''); preview();
    $('edit-fields').disabled = false; $('edit-save').disabled = false; $('edit-cancel').disabled = false;
  }
  function render() {
    const account = auth.get();
    $('edit-signin').hidden = Boolean(account); $('edit-private').hidden = !account;
    if (!account) {
      ownerId = null; original = null; image = ''; imageError = ''; dirty = false; generation++; preparing = false;
      form.reset(); $('edit-avatar-preview').replaceChildren(); status('');
      showErrors({ ...Object.fromEntries(names.map(name => [name, ''])), avatarImage: '' }); return;
    }
    if (ownerId !== account.id) { ownerId = account.id; hydrate(account); }
    else if (!saving && original?.profileVersion !== account.profileVersion) {
      if (dirty) status('Hồ sơ đã thay đổi ở trang khác. Hãy tải lại để lấy bản mới trước khi lưu.', true);
      else hydrate(account);
    }
  }
  form.addEventListener('input', event => {
    if (!original || saving) return;
    dirty = true;
    const name = event.target.name;
    if (names.includes(name)) { event.target.removeAttribute('aria-invalid'); $(`edit-${name}-error`).textContent = ''; }
    if (name === 'displayName') preview();
  });
  $('edit-avatar').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file || !original || saving) return;
    const token = ++generation; const accountId = ownerId;
    preparing = true; dirty = true; imageError = ''; $('edit-save').disabled = true; status('Đang xử lý ảnh…');
    try {
      const result = await avatar.prepare(file);
      if (token !== generation || ownerId !== accountId) return;
      image = result; showErrors({ avatarImage: '' }); preview(); status('Ảnh xem trước đã sẵn sàng. Chọn Lưu thay đổi để áp dụng.');
    } catch (error) {
      if (token !== generation || ownerId !== accountId) return;
      imageError = error.message; showErrors({ avatarImage: imageError }); status('Chưa thể sử dụng ảnh này.', true);
    } finally {
      if (token === generation) { preparing = false; $('edit-save').disabled = saving; }
    }
  });
  $('edit-remove-avatar').addEventListener('click', () => {
    if (!original || saving) return;
    generation++; preparing = false; image = ''; imageError = ''; dirty = true; $('edit-avatar').value = '';
    $('edit-save').disabled = false; showErrors({ avatarImage: '' }); preview(); status('Avatar mặc định sẽ được áp dụng khi bạn lưu thay đổi.');
  });
  $('edit-cancel').addEventListener('click', () => {
    if (saving) return;
    generation++; if (original) hydrate(original); location.href = 'profile.html';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (saving || preparing || !original) return;
    const account = auth.get(); if (account?.id !== ownerId) { render(); return; }
    const draft = values();
    const errors = { ...auth.profileErrors(draft), avatarImage: imageError || auth.profileErrors(draft).avatarImage };
    showErrors(errors);
    const invalid = Object.keys(errors).find(name => errors[name]);
    if (invalid) { (invalid === 'avatarImage' ? $('edit-avatar') : $(`edit-${invalid}`)).focus(); status('Vui lòng sửa các trường được đánh dấu.', true); return; }
    saving = true; $('edit-fields').disabled = true; $('edit-save').disabled = true; $('edit-cancel').disabled = true;
    $('edit-save').setAttribute('aria-busy', 'true'); $('edit-save').textContent = 'Đang lưu…'; status('Đang lưu hồ sơ…');
    let failedField;
    try {
      await auth.updateProfile(draft);
      const latest = auth.get();
      if (latest?.id === account.id) { hydrate(latest); status('Đã lưu thay đổi. Hồ sơ và thông tin tác giả đã được cập nhật.'); }
    } catch (error) {
      if (auth.get()?.id === account.id) {
        if (error.field) { failedField = error.field; showErrors({ [error.field]: error.message }); }
        status(error.message, true);
      }
    } finally {
      saving = false; $('edit-fields').disabled = false; $('edit-save').disabled = preparing; $('edit-cancel').disabled = false;
      $('edit-save').removeAttribute('aria-busy'); $('edit-save').textContent = 'Lưu thay đổi ↗'; render();
      if (failedField && auth.get()?.id === account.id) (failedField === 'avatarImage' ? $('edit-avatar') : $(`edit-${failedField}`)).focus();
    }
  });
  $('edit-login').addEventListener('click', auth.openLogin);
  auth.subscribe(render); render();
})();
