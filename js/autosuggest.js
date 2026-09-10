document.addEventListener('DOMContentLoaded', function () {
  /* Typeahead */
  var tools = [
    'Playwright', 'Selenium', 'Robot Framework', 'Cypress', 'WebdriverIO',
    'TestCafe', 'Appium', 'JUnit', 'TestNG', 'PyTest',
  ];
  var input = document.getElementById('typeahead-input');
  var list = document.getElementById('typeahead-list');
  var selectedOut = document.getElementById('typeahead-selected');
  var activeIndex = -1;
  var currentMatches = [];
  var debounceTimer = null;

  function closeList() {
    list.classList.remove('open');
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function renderMatches(matches) {
    currentMatches = matches;
    list.innerHTML = '';
    if (matches.length === 0) {
      closeList();
      return;
    }
    matches.forEach(function (m, i) {
      var li = document.createElement('li');
      li.className = 'suggest-item';
      li.setAttribute('role', 'option');
      li.setAttribute('data-testid', 'suggest-item');
      li.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
      li.textContent = m;
      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        selectMatch(m);
      });
      list.appendChild(li);
    });
    list.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
  }

  function selectMatch(value) {
    input.value = value;
    selectedOut.textContent = value;
    closeList();
  }

  if (input) {
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      clearTimeout(debounceTimer);
      if (!q) {
        closeList();
        return;
      }
      debounceTimer = setTimeout(function () {
        var matches = tools.filter(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
        activeIndex = -1;
        renderMatches(matches);
      }, 300);
    });

    input.addEventListener('keydown', function (e) {
      if (!list.classList.contains('open')) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, currentMatches.length - 1);
        renderMatches(currentMatches);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderMatches(currentMatches);
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0) {
          e.preventDefault();
          selectMatch(currentMatches[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        closeList();
      }
    });

    document.addEventListener('click', function (e) {
      if (!input.contains(e.target) && !list.contains(e.target)) closeList();
    });
  }

  /* Tag input */
  var tagBox = document.getElementById('tag-box');
  var tagInput = document.getElementById('tag-input');
  var tagSummary = document.getElementById('tag-summary');
  var tags = ['playwright'];

  function renderSummary() {
    tagSummary.textContent = tags.length ? tags.join(', ') : 'none';
  }
  function bindRemove(pill, btn, value) {
    btn.addEventListener('click', function () {
      pill.remove();
      tags = tags.filter(function (t) { return t !== value; });
      renderSummary();
    });
  }
  function addTagPill(value) {
    var pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.setAttribute('data-testid', 'tag-pill');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '×';
    btn.setAttribute('data-testid', 'button-remove-tag');
    btn.setAttribute('aria-label', 'Remove ' + value);
    bindRemove(pill, btn, value);
    pill.textContent = value + ' ';
    pill.appendChild(btn);
    tagBox.insertBefore(pill, tagInput);
  }

  // Bind the seed pill rendered server-side in the HTML (not created via addTagPill).
  document.querySelectorAll('.tag-pill').forEach(function (pill) {
    var btn = pill.querySelector('[data-testid="button-remove-tag"]');
    if (!btn) return;
    var value = pill.textContent.replace('×', '').trim();
    bindRemove(pill, btn, value);
  });
  if (tagInput) {
    tagInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        var value = tagInput.value.trim().replace(/,$/, '');
        if (value && tags.indexOf(value) === -1) {
          tags.push(value);
          addTagPill(value);
          renderSummary();
        }
        tagInput.value = '';
      } else if (e.key === 'Backspace' && tagInput.value === '' && tags.length) {
        var last = tags.pop();
        var pills = tagBox.querySelectorAll('.tag-pill');
        if (pills.length) pills[pills.length - 1].remove();
        renderSummary();
      }
    });
  }

  /* Date hint */
  var dateInput = document.getElementById('range-date');
  var dateHint = document.getElementById('range-date-hint');
  if (dateInput) {
    var today = new Date();
    var min = today.toISOString().slice(0, 10);
    var maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    var max = maxDate.toISOString().slice(0, 10);
    dateInput.min = min;
    dateInput.max = max;
    dateHint.textContent = 'Allowed range: ' + min + ' to ' + max;
  }
});
