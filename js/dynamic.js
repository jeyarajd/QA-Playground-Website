document.addEventListener('DOMContentLoaded', function () {
  /* Delayed render */
  setTimeout(function () {
    var el = document.getElementById('delayed-render-slot');
    if (el) {
      el.setAttribute('data-state', 'ok');
      el.textContent = 'Loaded after 2.5s.';
    }
  }, 2500);

  /* Polling counter */
  var pollEl = document.getElementById('poll-counter');
  var n = 0;
  if (pollEl) {
    setInterval(function () {
      n += 1;
      pollEl.textContent = n;
    }, 1000);
  }

  /* Moving target */
  var showMovingBtn = document.getElementById('show-moving-btn');
  var movingTarget = document.getElementById('moving-target');
  if (showMovingBtn) {
    showMovingBtn.addEventListener('click', function () {
      movingTarget.classList.remove('hidden-el');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          movingTarget.style.transform = 'translateX(0)';
          movingTarget.style.opacity = '1';
        });
      });
    });
    movingTarget.addEventListener('click', function () {
      window.showToast('Caught it.');
    });
  }

  /* Stale element replacement */
  var staleSlot = document.getElementById('stale-slot');
  var staleGen = 0;
  function renderStaleButton() {
    staleGen += 1;
    staleSlot.innerHTML = '';
    var btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.textContent = 'Click to re-render (gen ' + staleGen + ')';
    btn.setAttribute('data-testid', 'button-stale');
    btn.type = 'button';
    btn.addEventListener('click', renderStaleButton);
    staleSlot.appendChild(btn);
  }
  if (staleSlot) renderStaleButton();

  /* Covered element */
  setTimeout(function () {
    var cover = document.getElementById('cover-layer');
    if (cover) cover.remove();
  }, 2000);
  var coveredBtn = document.getElementById('covered-btn');
  if (coveredBtn) {
    coveredBtn.addEventListener('click', function () {
      window.showToast('Order confirmed.');
    });
  }

  /* Disappearing element */
  var showVanishBtn = document.getElementById('show-vanish-btn');
  if (showVanishBtn) {
    showVanishBtn.addEventListener('click', function () {
      var slot = document.getElementById('vanish-slot');
      slot.innerHTML = '';
      var banner = document.createElement('div');
      banner.className = 'badge tone-success';
      banner.textContent = 'Visible for 3 seconds…';
      banner.setAttribute('data-testid', 'banner-vanishing');
      slot.appendChild(banner);
      setTimeout(function () {
        banner.remove();
      }, 3000);
    });
  }

  /* Progress bar */
  var startProgressBtn = document.getElementById('start-progress-btn');
  var progressFill = document.getElementById('progress-fill');
  var progressLabel = document.getElementById('progress-label');
  if (startProgressBtn) {
    startProgressBtn.addEventListener('click', function () {
      if (startProgressBtn.disabled) return;
      startProgressBtn.disabled = true;
      var pct = 0;
      progressFill.style.width = '0%';
      var iv = setInterval(function () {
        pct += 5;
        if (pct >= 100) {
          pct = 100;
          clearInterval(iv);
          startProgressBtn.disabled = false;
          progressLabel.textContent = 'Done';
        } else {
          progressLabel.textContent = pct + '%';
        }
        progressFill.style.width = pct + '%';
      }, 150);
    });
  }

  /* Infinite scroll */
  var scrollBox = document.getElementById('scroll-box');
  var scrollTbody = document.getElementById('scroll-tbody');
  var loaded = 0;
  var maxRows = 50;
  function loadMoreRows() {
    if (loaded >= maxRows) return;
    var batch = Math.min(10, maxRows - loaded);
    for (var i = 0; i < batch; i++) {
      loaded += 1;
      var tr = document.createElement('tr');
      tr.setAttribute('data-testid', 'row-scroll');
      tr.innerHTML = '<td>Row ' + loaded + '</td>';
      scrollTbody.appendChild(tr);
    }
  }
  if (scrollBox) {
    loadMoreRows();
    scrollBox.addEventListener('scroll', function () {
      if (scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight - 20) {
        loadMoreRows();
      }
    });
  }
});
