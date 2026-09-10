document.addEventListener('DOMContentLoaded', function () {
  // Delayed enable
  var delayedBtn = document.getElementById('delayed-btn');
  var delayedCount = document.getElementById('delayed-count');
  if (delayedBtn) {
    var remaining = 3;
    var timer = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timer);
        delayedBtn.disabled = false;
        delayedBtn.textContent = 'Ready to submit';
      } else {
        delayedCount.textContent = remaining;
      }
    }, 1000);
  }

  // Reveal action button after delay
  var revealTrigger = document.getElementById('reveal-trigger');
  if (revealTrigger) {
    revealTrigger.addEventListener('click', function () {
      revealTrigger.disabled = true;
      revealTrigger.textContent = 'Loading…';
      setTimeout(function () {
        var slot = document.getElementById('reveal-slot');
        var btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Newly loaded action';
        btn.setAttribute('data-testid', 'button-revealed-action');
        btn.type = 'button';
        btn.addEventListener('click', function () {
          window.showToast('Revealed action clicked.');
        });
        slot.appendChild(btn);
        revealTrigger.remove();
      }, 1200);
    });
  }

  // Click counter
  var counterBtn = document.getElementById('counter-btn');
  var counterVal = document.getElementById('counter-val');
  var count = 0;
  if (counterBtn) {
    counterBtn.addEventListener('click', function () {
      count += 1;
      counterVal.textContent = count;
    });
  }

  // Loading state button
  var loadingBtn = document.getElementById('loading-btn');
  var loadingOutput = document.getElementById('loading-output');
  if (loadingBtn) {
    loadingBtn.addEventListener('click', function () {
      if (loadingBtn.getAttribute('aria-busy') === 'true') return;
      loadingBtn.setAttribute('aria-busy', 'true');
      loadingBtn.setAttribute('aria-disabled', 'true');
      var original = loadingBtn.textContent;
      loadingBtn.textContent = 'Saving…';
      loadingOutput.setAttribute('data-state', '');
      loadingOutput.textContent = 'Saving…';
      setTimeout(function () {
        loadingBtn.removeAttribute('aria-busy');
        loadingBtn.removeAttribute('aria-disabled');
        loadingBtn.textContent = original;
        loadingOutput.setAttribute('data-state', 'ok');
        loadingOutput.textContent = 'Saved successfully.';
      }, 1500);
    });
  }

  // Double-click / right-click
  var dblBtn = document.getElementById('dblclick-btn');
  var rightBtn = document.getElementById('rightclick-btn');
  var clickOutput = document.getElementById('click-output');
  if (dblBtn) {
    dblBtn.addEventListener('dblclick', function () {
      clickOutput.textContent = 'Double-click detected.';
    });
    dblBtn.addEventListener('click', function () {
      if (clickOutput.textContent.indexOf('Double-click') === -1) {
        clickOutput.textContent = 'Single click registered (double-click for a different result).';
      }
    });
  }
  if (rightBtn) {
    rightBtn.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      clickOutput.textContent = 'Right-click (contextmenu) detected.';
    });
  }

  // Toggle button
  var toggleBtn = document.getElementById('toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var pressed = toggleBtn.getAttribute('aria-pressed') === 'true';
      toggleBtn.setAttribute('aria-pressed', String(!pressed));
      toggleBtn.textContent = 'Notifications: ' + (!pressed ? 'On' : 'Off');
    });
  }

  // Duplicate label remove buttons — scoped by parent card
  document.querySelectorAll('.remove-card-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('[data-testid="card-item"]');
      if (card) card.remove();
      if (!document.querySelector('[data-testid="card-item"]')) {
        document.getElementById('card-empty-note').style.display = 'block';
      }
    });
  });

  // Link vs button semantics
  var fakeLink = document.getElementById('fake-nav-link');
  var realBtn = document.querySelector('[data-testid="button-real"]');
  var linkOutput = document.getElementById('link-output');
  if (fakeLink) {
    fakeLink.addEventListener('click', function (e) {
      e.preventDefault();
      linkOutput.textContent = 'You activated the <a role="link"> element.';
    });
  }
  if (realBtn) {
    realBtn.addEventListener('click', function () {
      linkOutput.textContent = 'You activated the real <button> element.';
    });
  }
});
