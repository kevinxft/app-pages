(function () {
  const SUPPORTED_LANGS = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'];
  const LANG_LABELS = { en: 'EN', zh: '中文', ja: '日本語', ko: '한국어', es: 'ES', fr: 'FR', de: 'DE' };
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'app-pages-lang';

  function getSharedBase() {
    const script = document.querySelector('script[src*="i18n.js"]');
    if (script) return script.src.replace(/js\/i18n\.js.*$/, '');
    return '';
  }

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    const browser = (navigator.language || '').split('-')[0].toLowerCase();
    return SUPPORTED_LANGS.includes(browser) ? browser : DEFAULT_LANG;
  }

  function resolve(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
  }

  function applyTranslations(t) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n'));
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n-title'));
      if (val != null) el.title = val;
    });
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent =
      '.lang-switcher{position:relative;display:flex;justify-content:flex-end;margin-bottom:10px}' +
      '.lang-trigger{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;' +
      'border:1px solid var(--line,#d8e3dc);border-radius:10px;background:#fafdff;' +
      'cursor:pointer;font-size:0.85rem;font-family:inherit;color:var(--muted,#56635e);' +
      'transition:all .2s ease}' +
      '.lang-trigger:hover{background:#eef7f3;color:var(--accent,#17785e)}' +
      '.lang-trigger svg{width:16px;height:16px;fill:currentColor}' +
      '.lang-dropdown{position:absolute;top:calc(100% + 4px);right:0;min-width:130px;' +
      'background:#fff;border:1px solid var(--line,#d8e3dc);border-radius:12px;' +
      'box-shadow:0 8px 24px rgba(19,33,27,.12);padding:4px;z-index:100;' +
      'opacity:0;transform:translateY(-4px);pointer-events:none;transition:all .15s ease}' +
      '.lang-dropdown.open{opacity:1;transform:translateY(0);pointer-events:auto}' +
      '.lang-option{display:block;width:100%;padding:7px 12px;border:none;background:transparent;' +
      'cursor:pointer;font-size:0.85rem;font-family:inherit;color:var(--ink,#13211b);' +
      'text-align:left;border-radius:8px;transition:background .15s ease}' +
      '.lang-option:hover{background:rgba(23,120,94,.06)}' +
      '.lang-option.active{color:var(--accent,#17785e);font-weight:600}';
    document.head.appendChild(style);
  }

  function createSwitcher(currentLang, onChange) {
    injectStyles();
    var container = document.createElement('div');
    container.className = 'lang-switcher';

    var trigger = document.createElement('button');
    trigger.className = 'lang-trigger';
    trigger.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>' +
      '<span>' + LANG_LABELS[currentLang] + '</span>';

    var dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';

    SUPPORTED_LANGS.forEach(function (lang) {
      var opt = document.createElement('button');
      opt.className = 'lang-option' + (lang === currentLang ? ' active' : '');
      opt.textContent = LANG_LABELS[lang];
      opt.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, lang);
        onChange(lang);
        dropdown.querySelectorAll('.lang-option').forEach(function (o) { o.classList.remove('active'); });
        opt.classList.add('active');
        trigger.querySelector('span').textContent = LANG_LABELS[lang];
        dropdown.classList.remove('open');
        document.documentElement.lang = lang;
      });
      dropdown.appendChild(opt);
    });

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });

    container.appendChild(trigger);
    container.appendChild(dropdown);
    var main = document.querySelector('.wrap, .shell, main');
    if (main) main.insertBefore(container, main.firstChild);
  }

  var translationsCache = {};

  async function loadTranslations(lang) {
    if (translationsCache[lang]) return translationsCache[lang];
    var base = getSharedBase();
    var resp = await fetch(base + 'lang/' + lang + '.json');
    if (!resp.ok) throw new Error('Failed to load ' + lang);
    var data = await resp.json();
    translationsCache[lang] = data;
    return data;
  }

  async function switchLang(lang) {
    try {
      var t = await loadTranslations(lang);
      applyTranslations(t);
    } catch (e) {
      console.error('i18n: failed to load', lang, e);
    }
  }

  async function init() {
    var lang = detectLang();
    document.documentElement.lang = lang;
    createSwitcher(lang, switchLang);
    await switchLang(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
