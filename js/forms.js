document.addEventListener('DOMContentLoaded', function () {
  var bio = document.getElementById('bio');
  var bioCount = document.getElementById('bio-count');
  if (bio) {
    bio.addEventListener('input', function () {
      bioCount.textContent = bio.value.length;
    });
  }

  // Select-all indeterminate checkbox
  var selectAll = document.getElementById('select-all');
  var channelBoxes = Array.prototype.slice.call(document.querySelectorAll('.channel-cb'));
  function syncSelectAll() {
    var checkedCount = channelBoxes.filter(function (c) { return c.checked; }).length;
    if (checkedCount === 0) {
      selectAll.checked = false;
      selectAll.indeterminate = false;
    } else if (checkedCount === channelBoxes.length) {
      selectAll.checked = true;
      selectAll.indeterminate = false;
    } else {
      selectAll.checked = false;
      selectAll.indeterminate = true;
    }
  }
  if (selectAll) {
    channelBoxes.forEach(function (cb) {
      cb.addEventListener('change', syncSelectAll);
    });
    selectAll.addEventListener('change', function () {
      channelBoxes.forEach(function (cb) {
        cb.checked = selectAll.checked;
      });
      selectAll.indeterminate = false;
    });
    syncSelectAll();
  }

  // Form submit: run validation, show inline errors, print collected values
  var form = document.getElementById('practice-form');
  var output = document.getElementById('form-output');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      document.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });

      if (!form.checkValidity()) {
        var invalidEls = form.querySelectorAll(':invalid');
        invalidEls.forEach(function (el) {
          var field = el.closest('.field');
          if (field) field.classList.add('invalid');
        });
        output.setAttribute('data-state', 'error');
        output.textContent = 'Validation failed: ' + invalidEls.length + ' field(s) need attention.';
        if (invalidEls[0]) invalidEls[0].focus();
        return;
      }

      var fd = new FormData(form);
      var summary = {};
      fd.forEach(function (value, key) {
        if (summary[key] !== undefined) {
          summary[key] = [].concat(summary[key], value);
        } else {
          summary[key] = value;
        }
      });
      var skillsSelect = document.getElementById('skills');
      summary.skills = Array.prototype.filter
        .call(skillsSelect.options, function (o) { return o.selected; })
        .map(function (o) { return o.value; });

      output.setAttribute('data-state', 'ok');
      output.textContent = JSON.stringify(summary, null, 2);
    });

    form.addEventListener('reset', function () {
      setTimeout(function () {
        document.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
        output.removeAttribute('data-state');
        output.textContent = 'Submit the form to see the collected values here.';
        bioCount.textContent = '0';
        syncSelectAll();
      }, 0);
    });
  }
});
