/* Runs early from an external script, before the stylesheets are parsed. */
(() => {
  'use strict';
  const root = document.documentElement;
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (_) { /* Session-only theme remains usable. */ }
  const media = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
  let manual = saved === 'light' || saved === 'dark';
  const resolve = (value, dark) => value === 'light' || value === 'dark' ? value : dark ? 'dark' : 'light';
  window.KH = window.KH || {};
  window.KH.theme = { resolve };
  function apply(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const label = theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';
      button.setAttribute('aria-label', label); button.title = label;
      button.querySelector('[data-theme-symbol]').textContent = theme === 'dark' ? '☀' : '☾';
    });
  }
  apply(resolve(saved, media?.matches));
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
      manual = true;
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(theme);
      try { localStorage.setItem('theme', theme); } catch (_) { /* No persistence, no failed interaction. */ }
    }));
  });
  media?.addEventListener?.('change', event => { if (!manual) apply(event.matches ? 'dark' : 'light'); });
})();
