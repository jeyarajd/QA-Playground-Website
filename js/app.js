/* Shared behavior: theme toggle, mobile sidebar, active nav highlight, toast helper */
(function () {
  var root = document.documentElement;
  var stored = 'system';
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = prefersDark ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function paintToggleIcon(btn, mode) {
    btn.innerHTML =
      mode === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      paintToggleIcon(toggle, theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      toggle.addEventListener('click', function () {
        theme = theme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', theme);
        paintToggleIcon(toggle, theme);
        toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      });
    }

    var sidebar = document.querySelector('[data-sidebar]');
    var sidebarToggle = document.querySelector('[data-sidebar-toggle]');
    if (sidebar && sidebarToggle) {
      sidebarToggle.addEventListener('click', function () {
        var open = sidebar.classList.toggle('open');
        sidebarToggle.setAttribute('aria-expanded', String(open));
      });
      document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          sidebar.classList.remove('open');
          sidebarToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Highlight active nav link based on current filename
    var current = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  });

  // Global toast helper: window.showToast('message')
  window.showToast = function (message, timeout) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('data-testid', 'toast');
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add('show');
    });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () {
        el.remove();
      }, 250);
    }, timeout || 2500);
  };
})();
