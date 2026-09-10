document.addEventListener('DOMContentLoaded', function () {
  /* Scoped "View" buttons */
  var viewOutput = document.getElementById('view-output');
  document.querySelectorAll('.view-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row = btn.closest('[data-testid="row-order"]');
      var order = row ? row.getAttribute('data-order') : '?';
      viewOutput.textContent = 'Viewing order #' + order + '.';
    });
  });

  /* Regenerating id/class */
  var regenBtn = document.getElementById('regen-btn');
  var idDisplay = document.getElementById('regen-id-display');
  function randomToken() {
    return 'x' + Math.random().toString(36).slice(2, 8);
  }
  function regen() {
    if (!regenBtn) return;
    var token = randomToken();
    regenBtn.id = token;
    regenBtn.className = 'btn btn-secondary cls-' + token;
    idDisplay.textContent = '#' + token;
  }
  regen();
  setInterval(regen, 2000);

  /* Shadow DOM custom element */
  if (!customElements.get('qa-shadow-widget')) {
    customElements.define('qa-shadow-widget', class extends HTMLElement {
      connectedCallback() {
        var root = this.attachShadow({ mode: 'open' });
        root.innerHTML =
          '<style>' +
          'button{background:var(--color-primary,#0e7c5f);color:#fff;border:none;padding:10px 16px;border-radius:6px;font-size:14px;cursor:pointer;font-family:inherit;}' +
          '</style>' +
          '<button type="button" data-testid="button-in-shadow">Click me (inside shadow root)</button>';
        var self = this;
        var count = 0;
        root.querySelector('button').addEventListener('click', function () {
          count += 1;
          var out = document.getElementById('shadow-output');
          if (out) out.textContent = 'Shadow button clicked ' + count + ' time(s).';
        });
      }
    });
  }
});
