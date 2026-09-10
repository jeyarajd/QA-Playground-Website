document.addEventListener('DOMContentLoaded', function () {
  var openPopupBtn = document.getElementById('open-popup-btn');
  var output = document.getElementById('popup-message-output');

  if (openPopupBtn) {
    openPopupBtn.addEventListener('click', function () {
      window.open('popup.html', 'qaPlaygroundPopup', 'width=420,height=260');
    });
  }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.source === 'qa-playground-popup') {
      output.setAttribute('data-state', 'ok');
      output.textContent = 'Received: "' + e.data.text + '"';
    }
  });
});
