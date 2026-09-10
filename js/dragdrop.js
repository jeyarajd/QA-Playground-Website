document.addEventListener('DOMContentLoaded', function () {
  var dragged = null;

  function enableDragList(list) {
    list.addEventListener('dragstart', function (e) {
      if (e.target.classList.contains('dnd-item')) {
        dragged = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id') || '');
      }
    });
    list.addEventListener('dragend', function (e) {
      if (e.target.classList.contains('dnd-item')) {
        e.target.classList.remove('dragging');
      }
      document.querySelectorAll('.dnd-list').forEach(function (l) { l.classList.remove('drag-over'); });
    });
    list.addEventListener('dragover', function (e) {
      e.preventDefault();
      list.classList.add('drag-over');
      var afterEl = getDragAfterElement(list, e.clientY);
      if (!dragged) return;
      if (afterEl == null) {
        list.appendChild(dragged);
      } else {
        list.insertBefore(dragged, afterEl);
      }
    });
    list.addEventListener('dragleave', function (e) {
      if (e.target === list) list.classList.remove('drag-over');
    });
    list.addEventListener('drop', function (e) {
      e.preventDefault();
      list.classList.remove('drag-over');
    });
  }

  function getDragAfterElement(container, y) {
    var items = Array.prototype.slice.call(container.querySelectorAll('.dnd-item:not(.dragging)'));
    return items.reduce(function (closest, child) {
      var box = child.getBoundingClientRect();
      var offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
  }

  ['reorder-list', 'list-backlog', 'list-done'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) enableDragList(el);
  });

  /* File upload */
  var fileInput = document.getElementById('file-input');
  var fileList = document.getElementById('file-list');
  var dropzone = document.getElementById('dropzone');

  function renderFiles(files) {
    fileList.innerHTML = '';
    Array.prototype.forEach.call(files, function (f) {
      var li = document.createElement('li');
      li.setAttribute('data-testid', 'file-list-item');
      li.textContent = f.name + ' (' + Math.max(1, Math.round(f.size / 1024)) + ' KB)';
      fileList.appendChild(li);
    });
  }
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      renderFiles(fileInput.files);
    });
  }
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
      });
    });
    dropzone.addEventListener('drop', function (e) {
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        renderFiles(e.dataTransfer.files);
      }
    });
  }

  /* File download */
  var downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      var content = 'QA Playground sample report\nGenerated: ' + new Date().toISOString() + '\nStatus: OK\n';
      var blob = new Blob([content], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'sample-report.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }
});
