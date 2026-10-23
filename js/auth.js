(() => {
  'use strict';
  window.KH = window.KH || {};
  const ACCOUNTS_KEY = 'khung-hinh:accounts:v1';
  const SESSION_KEY = 'khung-hinh:session:v1';
  const LOGOUT_KEY = 'khung-hinh:logout:v1';
  const ITERATIONS = 210000;
  const TAB_TTL = 12 * 60 * 60 * 1000;
  const REMEMBER_TTL = 30 * 24 * 60 * 60 * 1000;
  const listeners = new Set();
  let current = null;
  let pendingMovieId = null;
  let initialSessionError = '';
  let expiryTimer;
  let returnFocus;
  let dialogMode = '';
  let queue = Promise.resolve();
  const $ = id => document.getElementById(id);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const normalizeEmail = value => value.trim().toLocaleLowerCase('en-US');
  const normalizeUsername = value => value.trim().toLocaleLowerCase('vi');
  const usernameError = (value, legacy = false) => typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 32
    || (legacy ? /[\u0000-\u001f\u007f]/ : /[@\u0000-\u001f\u007f]/).test(value) ? 'Tên người dùng cần 3–32 ký tự, không chứa @ hoặc ký tự điều khiển.' : '';
  const emailError = value => typeof value !== 'string' || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? 'Email chưa đúng định dạng.' : '';
  const transaction = action => {
    if (navigator.locks?.request) return navigator.locks.request('khung-hinh:accounts-write', action);
    const task = queue.then(action); queue = task.catch(() => {}); return task;
  };
  const validDate = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
  const logoutStamp = () => {
    const value = Number(localStorage.getItem(LOGOUT_KEY)); return Number.isFinite(value) && value >= 0 ? value : 0;
  };
  const validBase64 = (value, length) => {
    try { return typeof value === 'string' && atob(value).length === length; } catch (_) { return false; }
  };
  const randomId = prefix => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  const bytesToBase64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
  function readAccounts() {
    let raw;
    try { raw = localStorage.getItem(ACCOUNTS_KEY); }
    catch (_) { throw new Error('Trình duyệt không cho phép truy cập dữ liệu tài khoản.'); }
    if (raw == null) return [];
    let parsed;
    try { parsed = JSON.parse(raw); } catch (_) { throw new Error('Dữ liệu tài khoản đã lưu bị lỗi; dữ liệu cũ được giữ nguyên.'); }
    if (parsed?.version !== 1 || !Array.isArray(parsed.accounts)
      || parsed.accounts.some(account => !account || typeof account.id !== 'string'
        || !account.id || account.id.length > 100 || usernameError(account.username, true) || emailError(account.email)
        || !validBase64(account.salt, 16) || !validBase64(account.passwordHash, 32)
        || typeof account.avatar !== 'string' || account.avatar.length > 8
        || (account.displayName != null && (typeof account.displayName !== 'string' || !account.displayName.trim() || account.displayName.length > 80))
        || (account.bio != null && (typeof account.bio !== 'string' || account.bio.length > 500))
        || (account.avatarImage != null && account.avatarImage !== '' && !window.KH.avatar.valid(account.avatarImage))
        || (account.credentialVersion != null && (!Number.isSafeInteger(account.credentialVersion) || account.credentialVersion < 0))
        || (account.profileVersion != null && (!Number.isSafeInteger(account.profileVersion) || account.profileVersion < 0))
        || !Array.isArray(account.watchlist) || !validDate(account.createdAt)
        || !account.watchlist.every(entry => entry && typeof entry.movieId === 'string'
          && window.KH.movies.some(movie => movie.id === entry.movieId)
          && typeof entry.addedAt === 'string' && Number.isFinite(Date.parse(entry.addedAt)))
        || new Set(account.watchlist.map(entry => entry.movieId)).size !== account.watchlist.length)
      || new Set(parsed.accounts.map(account => account.id)).size !== parsed.accounts.length
      || new Set(parsed.accounts.map(account => normalizeEmail(account.email))).size !== parsed.accounts.length
      || new Set(parsed.accounts.map(account => normalizeUsername(account.username))).size !== parsed.accounts.length) {
      throw new Error('Dữ liệu tài khoản không hợp lệ; dữ liệu cũ được giữ nguyên.');
    }
    return parsed.accounts;
  }
  function writeAccounts(accounts) {
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify({ version: 1, accounts })); }
    catch (_) { throw new Error('Không thể lưu tài khoản (bộ nhớ bị chặn hoặc đầy). Thay đổi chưa được lưu.'); }
  }
  function readSession() {
    clearTimeout(expiryTimer);
    for (const provider of [() => sessionStorage, () => localStorage]) {
      let value;
      try {
        value = provider().getItem(SESSION_KEY);
      } catch (_) { continue; }
      if (!value) continue;
      let session;
      try { session = JSON.parse(value); } catch (_) { continue; }
      // Old sessions without an expiry must sign in again; accounts are untouched.
      if (!session || typeof session.accountId !== 'string' || !Number.isFinite(session.expiresAt)
        || session.expiresAt <= Date.now()) continue;
      try { if (!Number.isFinite(session.issuedAt) || session.issuedAt <= logoutStamp()) continue; }
      catch (_) { continue; }
      const account = readAccounts().find(item => item.id === session.accountId);
      if (account && (session.credentialVersion ?? 0) === (account.credentialVersion ?? 0)) {
        expiryTimer = setTimeout(refresh, Math.min(session.expiresAt - Date.now(), 2147483647));
        return account;
      }
    }
    return null;
  }
  function publicAccount(account) {
    if (!account) return null;
    return { id: account.id, username: account.username, email: account.email,
      displayName: account.displayName || account.username, bio: account.bio || '', avatarImage: account.avatarImage || '',
      profileVersion: account.profileVersion ?? 0,
      avatar: account.avatar, createdAt: account.createdAt };
  }
  function publish() {
    const previousId = current?.id;
    current = readSession();
    renderHeader();
    listeners.forEach(listener => listener(publicAccount(current)));
    if ((!current || current.id !== previousId) && $('account-dialog')?.open && ['profile', 'edit', 'password'].includes(dialogMode)) closeDialog();
  }
  function refresh() {
    try { publish(); }
    catch (error) {
      current = null; clearTimeout(expiryTimer); renderHeader();
      listeners.forEach(listener => listener(null));
      if ($('account-dialog')?.open) closeDialog();
      if (document.body) showToast(error.message);
    }
  }
  function activeAccount() {
    const account = readSession();
    if (!account) { refresh(); throw new Error('Phiên đã kết thúc. Hãy đăng nhập để tiếp tục.'); }
    return account;
  }
  function setSession(accountId, remember) {
    try {
      const issuedAt = Math.max(Date.now(), logoutStamp() + 1);
      const account = readAccounts().find(item => item.id === accountId);
      const session = { accountId, issuedAt, expiresAt: issuedAt + (remember ? REMEMBER_TTL : TAB_TTL), credentialVersion: account?.credentialVersion ?? 0 };
      sessionStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_KEY);
      (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));
    } catch (_) { refresh(); throw new Error('Không thể tạo phiên đăng nhập trong trình duyệt.'); }
    publish();
  }
  async function completePending() {
    if (pendingMovieId) {
      const movieId = pendingMovieId;
      pendingMovieId = null;
      try {
        const result = await addToWatchlist(movieId);
        showToast(result.added ? 'Đã thêm phim vào Watchlist.' : 'Phim này đã có trong Watchlist.');
      } catch (error) { showToast(`Đã đăng nhập. ${error.message} Hãy thử lưu phim lại.`); }
    }
  }
  function passwordPolicy(password) {
    if (typeof password !== 'string' || password.length < 10 || password.length > 128) return 'Mật khẩu cần từ 10 đến 128 ký tự.';
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return 'Mật khẩu cần có chữ thường, chữ hoa và chữ số.';
    }
    return '';
  }
  async function derive(password, salt) {
    if (!crypto.subtle) throw new Error('Web Crypto không khả dụng. Hãy mở website qua HTTPS hoặc localhost.');
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    return bytesToBase64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, key, 256));
  }
  function base64Bytes(value) { return Uint8Array.from(atob(value), character => character.charCodeAt(0)); }
  async function passwordHash(password, salt) { return derive(password, base64Bytes(salt)); }
  function openDialog() {
    const dialog = $('account-dialog');
    if (!dialog.open) { returnFocus = document.activeElement; dialog.showModal(); }
  }
  function closeDialog() {
    pendingMovieId = null;
    if ($('account-dialog')?.open) $('account-dialog').close();
  }
  function field(form, name, label, type = 'text', options = {}) {
    const wrapper = el('label', 'form-field');
    wrapper.append(el('span', '', label));
    const input = el('input');
    input.name = name; input.type = type; input.required = options.required !== false;
    if (options.autocomplete) input.autocomplete = options.autocomplete;
    if (options.maxLength) input.maxLength = options.maxLength;
    if (options.minLength) input.minLength = options.minLength;
    if (options.inputMode) input.inputMode = options.inputMode;
    wrapper.append(input);
    const error = el('small', 'field-error'); error.id = `account-error-${name}`;
    input.setAttribute('aria-describedby', error.id);
    input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); error.textContent = ''; });
    wrapper.append(error); form.append(wrapper);
    return input;
  }
  function setStatus(text, error = false) {
    const status = $('account-status');
    status.textContent = text;
    status.classList.toggle('is-error', error);
  }
  function renderDialog(title, content) {
    const dialog = $('account-dialog');
    const panel = $('account-dialog-content');
    panel.replaceChildren();
    const heading = el('h2', 'account-dialog-title', title); heading.id = 'account-dialog-title';
    panel.append(el('p', 'eyebrow', 'KHUNG HÌNH / TÀI KHOẢN'), heading);
    panel.append(content);
    panel.append(el('p', 'account-limitation', 'Tài khoản demo chỉ lưu trong trình duyệt này; không đồng bộ giữa thiết bị.'));
    setStatus('');
    openDialog();
    content.querySelector('input, button, a, select')?.focus();
  }
  function addPasswordToggle(input, form) {
    const button = el('button', 'password-toggle', 'Hiện');
    button.type = 'button';
    button.setAttribute('aria-label', 'Hiển thị mật khẩu');
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.textContent = visible ? 'Ẩn' : 'Hiện';
      button.setAttribute('aria-label', visible ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu');
      button.setAttribute('aria-pressed', String(visible));
    });
    const row = el('span', 'password-row'); input.replaceWith(row); row.append(input, button);
  }
  function renderLogin() {
    dialogMode = 'login';
    const form = el('form', 'account-form'); form.noValidate = true;
    const identity = field(form, 'identity', 'Email hoặc tên người dùng', 'text', { autocomplete: 'username', maxLength: 254 });
    const password = field(form, 'password', 'Mật khẩu', 'password', { autocomplete: 'current-password', maxLength: 128 });
    addPasswordToggle(password, form);
    const rememberLabel = el('label', 'remember-row');
    const remember = el('input'); remember.type = 'checkbox'; rememberLabel.append(remember, el('span', '', 'Ghi nhớ đăng nhập trên thiết bị này')); form.append(rememberLabel);
    const submit = el('button', 'button button-accent account-submit', 'Đăng nhập'); submit.type = 'submit'; form.append(submit);
    const links = el('div', 'account-links');
    const forgot = el('button', 'text-button', 'Quên mật khẩu?'); forgot.type = 'button'; forgot.addEventListener('click', renderForgot);
    const register = el('button', 'text-button', 'Chưa có tài khoản? Đăng ký'); register.type = 'button'; register.addEventListener('click', renderRegister);
    links.append(forgot, register); form.append(links);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submit.disabled) return;
      const value = identity.value.trim();
      if (!value || !password.value) { setStatus('Vui lòng nhập tên đăng nhập/email và mật khẩu.', true); return; }
      submit.disabled = true; submit.textContent = 'Đang xử lý…';
      try { await login(value, password.value, remember.checked); if (form.isConnected) closeDialog(); }
      catch (error) { if (form.isConnected) setStatus(error.message, true); }
      finally { submit.disabled = false; submit.textContent = 'Đăng nhập'; }
    });
    renderDialog('Đăng nhập', form); identity.focus();
  }
  function renderRegister() {
    dialogMode = 'register';
    const form = el('form', 'account-form'); form.noValidate = true;
    const username = field(form, 'username', 'Tên người dùng', 'text', { autocomplete: 'username', maxLength: 32, minLength: 3 });
    const email = field(form, 'email', 'Email', 'email', { autocomplete: 'email', maxLength: 254 });
    const password = field(form, 'password', 'Mật khẩu', 'password', { autocomplete: 'new-password', maxLength: 128, minLength: 10 });
    const strength = el('small', 'password-hint', 'Ít nhất 10 ký tự, gồm chữ hoa, chữ thường và chữ số.');
    password.parentElement.append(strength); addPasswordToggle(password, form);
    password.addEventListener('input', () => {
      const message = passwordPolicy(password.value);
      strength.textContent = message || 'Mật khẩu đáp ứng yêu cầu.';
      strength.classList.toggle('is-valid', !message && password.value.length > 0);
    });
    const confirm = field(form, 'confirm', 'Xác nhận mật khẩu', 'password', { autocomplete: 'new-password', maxLength: 128 });
    addPasswordToggle(confirm, form);
    function checkDuplicate(fieldNode, name) {
      const value = fieldNode.value.trim();
      if (!value) return;
      try {
        const accounts = readAccounts();
        const duplicate = name === 'username'
          ? accounts.some(account => normalizeUsername(account.username) === normalizeUsername(value))
          : accounts.some(account => normalizeEmail(account.email) === normalizeEmail(value));
        const message = duplicate ? (name === 'username' ? 'Tên người dùng này đã được sử dụng.' : 'Email này đã được sử dụng.') : '';
        fieldNode.setAttribute('aria-invalid', String(Boolean(message)));
        form.querySelector(`#account-error-${name}`).textContent = message;
      } catch (error) { setStatus(error.message, true); }
    }
    username.addEventListener('blur', () => checkDuplicate(username, 'username'));
    email.addEventListener('blur', () => checkDuplicate(email, 'email'));
    const submit = el('button', 'button button-accent account-submit', 'Tạo tài khoản'); submit.type = 'submit'; form.append(submit);
    const back = el('button', 'text-button', 'Đã có tài khoản? Đăng nhập'); back.type = 'button'; back.addEventListener('click', renderLogin); form.append(back);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submit.disabled) return;
      const usernameValue = username.value.trim();
      const emailValue = normalizeEmail(email.value);
      const errors = {
        username: usernameError(usernameValue),
        email: emailError(emailValue),
        password: passwordPolicy(password.value),
        confirm: password.value !== confirm.value ? 'Mật khẩu xác nhận chưa khớp.' : ''
      };
      for (const [name, message] of Object.entries(errors)) {
        const node = form.querySelector(`[name="${name}"]`);
        node.setAttribute('aria-invalid', String(Boolean(message)));
        $(`account-error-${name}`).textContent = message;
      }
      const invalid = Object.keys(errors).find(name => errors[name]);
      if (invalid) { form.elements[invalid].focus(); setStatus('Vui lòng sửa các trường được đánh dấu.', true); return; }
      submit.disabled = true; submit.textContent = 'Đang tạo…';
      try { await register(usernameValue, emailValue, password.value); if (form.isConnected) closeDialog(); showToast('Tài khoản demo đã được tạo.'); }
      catch (error) {
        if (!form.isConnected) return;
        if (error.field) { form.elements[error.field].setAttribute('aria-invalid', 'true'); $(`account-error-${error.field}`).textContent = error.message; form.elements[error.field].focus(); }
        setStatus(error.message, true);
      }
      finally { submit.disabled = false; submit.textContent = 'Tạo tài khoản'; }
    });
    renderDialog('Tạo tài khoản demo', form); username.focus();
  }
  function renderForgot() {
    dialogMode = 'forgot';
    const panel = el('div', 'account-form');
    panel.append(el('p', 'account-limitation', 'Đây là tài khoản demo chỉ lưu trong trình duyệt. Website không gửi email và không thể xác minh danh tính để khôi phục mật khẩu. Hãy đăng nhập trên thiết bị này hoặc tạo tài khoản demo mới; dữ liệu tài khoản cũ không thể được mở khóa nếu quên mật khẩu.'));
    const back = el('button', 'button button-outline', 'Quay lại đăng nhập'); back.type = 'button'; back.addEventListener('click', renderLogin); panel.append(back);
    renderDialog('Khôi phục mật khẩu', panel);
  }
  async function register(username, email, password) {
    const errors = { username: usernameError(username), email: emailError(email), password: passwordPolicy(password) };
    for (const [name, message] of Object.entries(errors)) if (message) throw Object.assign(new Error(message), { field: name });
    username = username.trim(); email = normalizeEmail(email);
    const salt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
    const account = { id: randomId('account'), username, email, salt,
      passwordHash: await passwordHash(password, salt), avatar: [...username][0].toLocaleUpperCase('vi'),
      createdAt: new Date().toISOString(), watchlist: [] };
    await transaction(() => {
      const accounts = readAccounts();
      if (accounts.some(item => normalizeUsername(item.username) === normalizeUsername(username))) {
        throw Object.assign(new Error('Tên người dùng này đã được sử dụng.'), { field: 'username' });
      }
      if (accounts.some(item => normalizeEmail(item.email) === email)) {
        throw Object.assign(new Error('Email này đã được sử dụng.'), { field: 'email' });
      }
      accounts.push(account); writeAccounts(accounts); setSession(account.id, false);
    });
    await completePending();
  }
  async function login(identity, password, remember = false) {
    if (typeof identity !== 'string' || !identity.trim() || identity.length > 254
      || typeof password !== 'string' || !password || password.length > 128) throw new Error('Vui lòng kiểm tra tên đăng nhập và mật khẩu.');
    const normalized = identity.includes('@') ? normalizeEmail(identity) : normalizeUsername(identity);
    const account = readAccounts().find(item => normalizeEmail(item.email) === normalized || normalizeUsername(item.username) === normalized);
    if (!account) throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
    const candidate = await passwordHash(password, account.salt);
    if (candidate !== account.passwordHash) throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
    await transaction(() => {
      const latest = readAccounts().find(item => item.id === account.id);
      if (!latest || latest.passwordHash !== account.passwordHash) throw new Error('Thông tin tài khoản đã thay đổi. Hãy đăng nhập lại.');
      setSession(account.id, remember);
    });
    await completePending();
  }
  function logout() {
    try { localStorage.setItem(LOGOUT_KEY, String(Date.now())); localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); }
    catch (_) { refresh(); throw new Error('Không thể kết thúc phiên đăng nhập.'); }
    pendingMovieId = null; publish();
  }
  function updateAccount(accountId, patch) {
    if (activeAccount().id !== accountId) throw new Error('Tài khoản đã thay đổi. Hãy thử lại.');
    const accounts = readAccounts();
    const index = accounts.findIndex(account => account.id === accountId);
    if (index < 0) throw new Error('Tài khoản hiện tại không còn tồn tại.');
    accounts[index] = { ...accounts[index], ...patch };
    writeAccounts(accounts); publish();
  }
  function profileErrors(values) {
    return {
      username: usernameError(values.username), email: emailError(typeof values.email === 'string' ? values.email.trim() : values.email),
      displayName: typeof values.displayName !== 'string' || !values.displayName.trim() || values.displayName.trim().length > 80 ? 'Tên hiển thị cần từ 1 đến 80 ký tự.' : '',
      bio: typeof values.bio !== 'string' || values.bio.length > 500 ? 'Giới thiệu tối đa 500 ký tự.' : '',
      avatarImage: values.avatarImage && !window.KH.avatar.valid(values.avatarImage) ? 'Ảnh đại diện không hợp lệ hoặc quá lớn.' : ''
    };
  }
  async function updateProfile(values) {
    const accountId = activeAccount().id;
    const legacy = typeof values === 'string';
    if (legacy) { const message = usernameError(values); if (message) throw Object.assign(new Error(message), { field: 'username' }); }
    else {
      if (!values || typeof values !== 'object') throw new Error('Thông tin hồ sơ không hợp lệ.');
      for (const [field, message] of Object.entries(profileErrors(values))) if (message) throw Object.assign(new Error(message), { field });
    }
    const patch = legacy ? { username: values.trim() } : {
      username: values.username.trim(), email: normalizeEmail(values.email), displayName: values.displayName.trim(),
      bio: values.bio.trim(), avatarImage: values.avatarImage || ''
    };
    return transaction(() => {
      const latest = activeAccount();
      if (latest.id !== accountId) throw new Error('Tài khoản đã thay đổi. Hãy thử lại.');
      if (!legacy && values.expectedVersion != null && values.expectedVersion !== (latest.profileVersion ?? 0)) throw new Error('Hồ sơ đã thay đổi ở trang khác. Hãy tải lại trước khi lưu.');
      if (readAccounts().some(account => account.id !== accountId && normalizeUsername(account.username) === normalizeUsername(patch.username))) {
        throw Object.assign(new Error('Tên người dùng này đã được sử dụng.'), { field: 'username' });
      }
      if (!legacy && readAccounts().some(account => account.id !== accountId && normalizeEmail(account.email) === patch.email)) {
        throw Object.assign(new Error('Email này đã được sử dụng.'), { field: 'email' });
      }
      updateAccount(accountId, { ...patch, profileVersion: (latest.profileVersion ?? 0) + 1, avatar: [...(patch.displayName || patch.username)][0].toLocaleUpperCase('vi') });
    });
  }
  async function changePassword(oldPassword, nextPassword) {
    const policy = passwordPolicy(nextPassword);
    if (policy) throw Object.assign(new Error(policy), { field: 'new-password' });
    const account = activeAccount();
    if (typeof oldPassword !== 'string' || !oldPassword || oldPassword.length > 128) throw new Error('Nhập mật khẩu hiện tại.');
    if (!account || await passwordHash(oldPassword, account.salt) !== account.passwordHash) throw Object.assign(new Error('Mật khẩu hiện tại không chính xác.'), { field: 'old-password' });
    if (oldPassword === nextPassword) throw Object.assign(new Error('Mật khẩu mới phải khác mật khẩu hiện tại.'), { field: 'new-password' });
    const salt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
    const hash = await passwordHash(nextPassword, salt);
    return transaction(() => {
      const latest = activeAccount();
      if (latest.id !== account.id || latest.passwordHash !== account.passwordHash) throw new Error('Tài khoản hoặc mật khẩu đã thay đổi. Hãy thử lại.');
      updateAccount(account.id, { salt, passwordHash: hash, credentialVersion: (latest.credentialVersion ?? 0) + 1 });
    });
  }
  async function addToWatchlist(movieId) {
    const accountId = activeAccount().id;
    if (!window.KH.movies.some(movie => movie.id === movieId)) throw new Error('Không tìm thấy bộ phim trong thư viện.');
    return transaction(() => {
      const account = activeAccount();
      if (account.id !== accountId) throw new Error('Tài khoản đã thay đổi. Hãy thử lại.');
      if (account.watchlist.some(item => item.movieId === movieId)) return { added: false };
      updateAccount(accountId, { watchlist: [...account.watchlist, { movieId, addedAt: new Date().toISOString() }] });
      return { added: true };
    });
  }
  async function removeFromWatchlist(movieId) {
    const accountId = activeAccount().id;
    return transaction(() => {
      const account = activeAccount();
      if (account.id !== accountId) throw new Error('Tài khoản đã thay đổi. Hãy thử lại.');
      updateAccount(accountId, { watchlist: account.watchlist.filter(item => item.movieId !== movieId) });
    });
  }
  function getWatchlist() {
    try { const account = readSession(); return account ? account.watchlist.map(item => ({ ...item })) : []; }
    catch (_) { return []; }
  }
  function getCurrent() { try { return publicAccount(readSession()); } catch (_) { return null; } }
  function showToast(message) {
    let toast = $('account-toast');
    if (!toast) { toast = el('p', 'account-toast'); toast.id = 'account-toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
    toast.textContent = message; toast.classList.add('is-visible');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }
  function renderHeader() {
    const loginButton = document.querySelector('.login-button');
    let accountBox = $('account-menu-wrap');
    if (!accountBox && loginButton) {
      accountBox = el('div', 'account-menu-wrap'); accountBox.id = 'account-menu-wrap';
      loginButton.replaceWith(accountBox);
      accountBox.addEventListener('focusout', event => {
        // During a native pointer click, activeElement can be body before the link receives focus.
        if (accountBox.contains(event.relatedTarget)) return;
        const menu = accountBox.querySelector('.account-menu'); if (menu) menu.hidden = true;
        accountBox.querySelector('.account-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
    if (!accountBox) return;
    accountBox.replaceChildren();
    if (!current) {
      const button = el('button', 'login-button', 'Đăng nhập'); button.type = 'button'; button.addEventListener('click', renderLogin);
      accountBox.append(button); return;
    }
    const button = el('button', 'account-trigger');
    button.type = 'button'; button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-label', `${current.displayName || current.username}, ${current.watchlist.length} phim trong Watchlist, mở menu tài khoản`);
    button.append(window.KH.avatar.node(publicAccount(current)), el('span', 'account-trigger-name', current.displayName || current.username),
      el('span', 'watchlist-count', String(current.watchlist.length)));
    const menu = el('div', 'account-menu glass'); menu.hidden = true; menu.setAttribute('role', 'menu');
    const actions = [
      ['profile', 'Hồ sơ của tôi'], ['watchlist', 'Watchlist của tôi'], ['edit', 'Chỉnh sửa thông tin'],
      ['password', 'Đổi mật khẩu'], ['logout', 'Đăng xuất']
    ];
    actions.forEach(([action, label]) => {
      const routes = { profile: 'profile.html', watchlist: 'watchlist.html', edit: 'profile-edit.html' };
      const item = el(routes[action] ? 'a' : 'button', 'account-menu-item', label);
      if (routes[action]) item.href = routes[action];
      else { item.type = 'button'; item.addEventListener('click', () => {
        menu.hidden = true; button.setAttribute('aria-expanded', 'false');
        if (action === 'logout') { try { logout(); showToast('Đã đăng xuất.'); } catch (error) { showToast(error.message); } }
        else renderChangePassword();
      }); }
      item.setAttribute('role', 'menuitem'); menu.append(item);
    });
    button.addEventListener('click', () => {
      menu.hidden = !menu.hidden; button.setAttribute('aria-expanded', String(!menu.hidden));
    });
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); menu.hidden = false; button.setAttribute('aria-expanded', 'true');
        (event.key === 'ArrowDown' ? menu.firstElementChild : menu.lastElementChild).focus();
      }
    });
    menu.addEventListener('keydown', event => {
      const items = [...menu.children]; const index = items.indexOf(document.activeElement);
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next].focus();
      }
    });
    accountBox.append(button, menu);
  }
  function renderChangePassword() {
    if (!current) return;
    dialogMode = 'password';
    const form = el('form', 'account-form'); form.noValidate = true;
    const oldPassword = field(form, 'old-password', 'Mật khẩu hiện tại', 'password', { autocomplete: 'current-password', maxLength: 128 });
    const nextPassword = field(form, 'new-password', 'Mật khẩu mới', 'password', { autocomplete: 'new-password', maxLength: 128 });
    const confirm = field(form, 'confirm-password', 'Xác nhận mật khẩu mới', 'password', { autocomplete: 'new-password', maxLength: 128 });
    [oldPassword, nextPassword, confirm].forEach(input => addPasswordToggle(input, form));
    const submit = el('button', 'button button-accent account-submit', 'Đổi mật khẩu'); submit.type = 'submit'; form.append(submit);
    const cancel = el('button', 'button button-outline', 'Hủy'); cancel.type = 'button'; cancel.addEventListener('click', closeDialog); form.append(cancel);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submit.disabled) return;
      const errors = {
        'old-password': oldPassword.value ? '' : 'Nhập mật khẩu hiện tại.',
        'new-password': passwordPolicy(nextPassword.value),
        'confirm-password': !confirm.value || nextPassword.value !== confirm.value ? 'Mật khẩu xác nhận chưa khớp.' : ''
      };
      for (const [name, message] of Object.entries(errors)) {
        form.elements[name].setAttribute('aria-invalid', String(Boolean(message)));
        form.querySelector(`#account-error-${name}`).textContent = message;
      }
      const invalid = Object.keys(errors).find(name => errors[name]);
      if (invalid) { form.elements[invalid].focus(); setStatus('Vui lòng sửa các trường được đánh dấu.', true); return; }
      submit.disabled = true; submit.textContent = 'Đang cập nhật…';
      try {
        await changePassword(oldPassword.value, nextPassword.value);
        if (form.isConnected) { closeDialog(); renderLogin(); }
        showToast('Đã đổi mật khẩu. Hãy đăng nhập lại bằng mật khẩu mới.');
      }
      catch (error) {
        if (form.isConnected) {
          if (error.field) { form.querySelector(`#account-error-${error.field}`).textContent = error.message; form.elements[error.field].setAttribute('aria-invalid', 'true'); form.elements[error.field].focus(); }
          setStatus(error.message, true);
        }
      }
      finally { submit.disabled = false; submit.textContent = 'Đổi mật khẩu'; }
    });
    renderDialog('Đổi mật khẩu demo', form); oldPassword.focus();
  }
  function requestLogin(movieId = null) { pendingMovieId = movieId; renderLogin(); }
  document.addEventListener('DOMContentLoaded', () => {
    const dialog = el('dialog', 'account-dialog'); dialog.id = 'account-dialog';
    dialog.setAttribute('aria-labelledby', 'account-dialog-title'); dialog.setAttribute('aria-describedby', 'account-status');
    const content = el('div', 'account-dialog-content glass'); content.id = 'account-dialog-content';
    const close = el('button', 'dialog-close', 'Đóng'); close.type = 'button'; close.setAttribute('aria-label', 'Đóng hộp thoại');
    close.addEventListener('click', closeDialog);
    const status = el('p', 'form-status account-status'); status.id = 'account-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    dialog.append(close, content, status); document.body.append(dialog);
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const targets = [...dialog.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')]
        .filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length);
      const first = targets[0]; const last = targets[targets.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener('close', () => {
      if (dialog.open) return;

      pendingMovieId = null; dialogMode = '';
      (returnFocus?.isConnected ? returnFocus : document.querySelector('.account-trigger, .login-button'))?.focus({ preventScroll: true });
    });
    renderHeader();
    if (initialSessionError) showToast(initialSessionError);
  });
  document.addEventListener('click', event => {
    const box = $('account-menu-wrap'); const menu = box?.querySelector('.account-menu');
    const button = box?.querySelector('.account-trigger');
    if (menu && !box.contains(event.target)) { menu.hidden = true; button?.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', event => {
    const box = $('account-menu-wrap'); const menu = box?.querySelector('.account-menu');
    const button = box?.querySelector('.account-trigger');
    if (event.key === 'Escape' && menu && !menu.hidden) { menu.hidden = true; button?.setAttribute('aria-expanded', 'false'); button?.focus(); }
  });
  try { current = readSession(); }
  catch (error) { initialSessionError = error.message; current = null; }
  window.addEventListener('storage', event => {
    if (event.key === ACCOUNTS_KEY || event.key === SESSION_KEY || event.key === LOGOUT_KEY || event.key === null) refresh();
  });
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  window.KH.auth = {
    get current() { return getCurrent(); }, get accountsKey() { return ACCOUNTS_KEY; },
    get: getCurrent, register, login, logout, updateProfile, changePassword, profileErrors,
    lookup: id => { try { return publicAccount(readAccounts().find(account => account.id === id)); } catch (_) { return null; } }, refresh,
    addToWatchlist, removeFromWatchlist, getWatchlist, requestLogin,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
    showToast, openLogin: renderLogin
  };
})();
