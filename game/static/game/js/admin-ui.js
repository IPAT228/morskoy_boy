(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('div.breadcrumbs a, div.breadcrumbs').forEach(element => {
      element.childNodes.forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = node.textContent
            .replace(/\bНачало\b/g, 'Главная')
            .replace(/\bGame\b/g, 'Панель управления');
          return;
        }

        if (node.textContent.trim() === 'Начало') {
          node.textContent = 'Главная';
        }

        if (node.textContent.trim() === 'Game') {
          node.textContent = 'Панель управления';
        }
      });
    });
  });
})();
