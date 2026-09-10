document.addEventListener('DOMContentLoaded', function () {
  var output = document.getElementById('dialog-output');

  var alertBtn = document.getElementById('alert-btn');
  if (alertBtn) alertBtn.addEventListener('click', function () {
    alert('This is a native alert dialog.');
    output.textContent = 'alert() was dismissed.';
  });

  var confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn) confirmBtn.addEventListener('click', function () {
    var ok = confirm('Proceed with this action?');
    output.textContent = 'confirm() result: ' + ok;
  });

  var promptBtn = document.getElementById('prompt-btn');
  if (promptBtn) promptBtn.addEventListener('click', function () {
    var value = prompt('Enter your name:', '');
    output.textContent = 'prompt() result: ' + (value === null ? 'null (cancelled)' : JSON.stringify(value));
  });

  /* Modal with focus trap */
  var overlay = document.getElementById('modal-overlay');
  var openBtn = document.getElementById('open-modal-btn');
  var cancelBtn = document.getElementById('modal-cancel-btn');
  var confirmModalBtn = document.getElementById('modal-confirm-btn');
  var modalBox = document.getElementById('modal-box');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    cancelBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = modalBox.querySelectorAll('button');
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (confirmModalBtn) confirmModalBtn.addEventListener('click', function () {
    closeModal();
    window.showToast('Record deleted (demo only).');
  });
  if (overlay) overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  /* Toast */
  var toastBtn = document.getElementById('toast-btn');
  if (toastBtn) toastBtn.addEventListener('click', function () {
    window.showToast('Changes saved successfully.');
  });
});
