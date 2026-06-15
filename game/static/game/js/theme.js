(function () {
  const storageKey = 'morskoyBoyTheme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.textContent = theme === 'light' ? '☾' : '☀';
      button.title = theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему';
      button.setAttribute('aria-label', theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему');
    });
  }

  function prepareToggle(button) {
    button.classList.add('theme-switcher-floating');
    button.type = 'button';
    if (button.parentElement !== document.body) {
      document.body.appendChild(button);
    }
  }

  const savedTheme = localStorage.getItem(storageKey) || 'dark';
  applyTheme(savedTheme);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      prepareToggle(button);
      button.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
      });
    });
    applyTheme(root.dataset.theme || savedTheme);
  });
})();
