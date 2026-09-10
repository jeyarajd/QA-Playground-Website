document.addEventListener('DOMContentLoaded', function () {
  /* ---- Sortable & filterable dataset ---- */
  var people = [
    { name: 'Priya Menon', role: 'QA Lead', score: 92 },
    { name: 'Arjun Rao', role: 'SDET', score: 78 },
    { name: 'Divya Shah', role: 'QA Engineer', score: 85 },
    { name: 'Karan Patel', role: 'SDET', score: 66 },
    { name: 'Meera Nair', role: 'QA Engineer', score: 74 },
    { name: 'Rohit Sen', role: 'Automation Architect', score: 95 },
  ];
  var sortState = { key: null, dir: 1 };
  var filterInput = document.getElementById('table-filter');
  var tbody = document.getElementById('sortable-tbody');
  var emptyNote = document.getElementById('sortable-empty');

  function renderPeople() {
    var q = (filterInput.value || '').trim().toLowerCase();
    var rows = people.filter(function (p) { return p.name.toLowerCase().indexOf(q) !== -1; });
    if (sortState.key) {
      rows.sort(function (a, b) {
        var av = a[sortState.key], bv = b[sortState.key];
        if (typeof av === 'number') return (av - bv) * sortState.dir;
        return String(av).localeCompare(String(bv)) * sortState.dir;
      });
    }
    tbody.innerHTML = '';
    rows.forEach(function (p) {
      var tr = document.createElement('tr');
      tr.setAttribute('data-testid', 'row-person');
      tr.innerHTML = '<td>' + p.name + '</td><td>' + p.role + '</td><td>' + p.score + '</td>';
      tbody.appendChild(tr);
    });
    emptyNote.style.display = rows.length === 0 ? 'block' : 'none';
  }

  document.querySelectorAll('[data-sort]').forEach(function (th) {
    th.addEventListener('click', function () {
      var key = th.getAttribute('data-sort');
      sortState.dir = sortState.key === key ? -sortState.dir : 1;
      sortState.key = key;
      document.querySelectorAll('[data-sort]').forEach(function (h) {
        h.setAttribute('aria-sort', 'none');
        h.querySelector('.sort-arrow').textContent = '';
      });
      th.setAttribute('aria-sort', sortState.dir === 1 ? 'ascending' : 'descending');
      th.querySelector('.sort-arrow').textContent = sortState.dir === 1 ? '▲' : '▼';
      renderPeople();
    });
  });
  if (filterInput) filterInput.addEventListener('input', renderPeople);
  renderPeople();

  /* ---- Editable table ---- */
  var editableTbody = document.getElementById('editable-tbody');
  var addRowBtn = document.getElementById('add-row-btn');
  var editableEmpty = document.getElementById('editable-empty');

  function bindDeleteButtons() {
    editableTbody.querySelectorAll('.delete-row-btn').forEach(function (btn) {
      btn.onclick = function () {
        btn.closest('tr').remove();
        editableEmpty.style.display = editableTbody.children.length === 0 ? 'block' : 'none';
      };
    });
  }
  bindDeleteButtons();

  if (addRowBtn) {
    addRowBtn.addEventListener('click', function () {
      var nameInput = document.getElementById('new-task-name');
      var ownerInput = document.getElementById('new-task-owner');
      var name = nameInput.value.trim();
      var owner = ownerInput.value.trim();
      if (!name) {
        nameInput.focus();
        return;
      }
      var tr = document.createElement('tr');
      tr.setAttribute('data-testid', 'row-task');
      tr.innerHTML =
        '<td>' + name + '</td><td>' + (owner || '—') + '</td>' +
        '<td><span class="badge tone-warning">pending</span></td>' +
        '<td><button class="btn btn-ghost delete-row-btn" data-testid="button-delete-row">Delete</button></td>';
      editableTbody.appendChild(tr);
      bindDeleteButtons();
      editableEmpty.style.display = 'none';
      nameInput.value = '';
      ownerInput.value = '';
      nameInput.focus();
    });
  }

  /* ---- Pagination ---- */
  var tickets = [];
  var priorities = ['Low', 'Medium', 'High', 'Critical'];
  for (var i = 1; i <= 23; i++) {
    tickets.push({ id: i, name: 'TCK-' + (1000 + i), priority: priorities[i % priorities.length] });
  }
  var pageSize = 5;
  var currentPage = 1;
  var paginatedTbody = document.getElementById('paginated-tbody');
  var paginationNav = document.getElementById('pagination-nav');

  function renderPage(page) {
    currentPage = page;
    var start = (page - 1) * pageSize;
    var rows = tickets.slice(start, start + pageSize);
    paginatedTbody.innerHTML = '';
    rows.forEach(function (t) {
      var tr = document.createElement('tr');
      tr.setAttribute('data-testid', 'row-ticket');
      tr.innerHTML = '<td>' + t.id + '</td><td>' + t.name + '</td><td>' + t.priority + '</td>';
      paginatedTbody.appendChild(tr);
    });
    renderPagination();
  }

  function renderPagination() {
    var totalPages = Math.ceil(tickets.length / pageSize);
    paginationNav.innerHTML = '';
    var prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.textContent = 'Prev';
    prev.disabled = currentPage === 1;
    prev.setAttribute('data-testid', 'button-page-prev');
    prev.addEventListener('click', function () { renderPage(currentPage - 1); });
    paginationNav.appendChild(prev);

    for (var p = 1; p <= totalPages; p++) {
      (function (p) {
        var btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.textContent = p;
        btn.setAttribute('data-testid', 'button-page-' + p);
        if (p === currentPage) btn.setAttribute('aria-current', 'true');
        btn.addEventListener('click', function () { renderPage(p); });
        paginationNav.appendChild(btn);
      })(p);
    }

    var next = document.createElement('button');
    next.className = 'page-btn';
    next.textContent = 'Next';
    next.disabled = currentPage === totalPages;
    next.setAttribute('data-testid', 'button-page-next');
    next.addEventListener('click', function () { renderPage(currentPage + 1); });
    paginationNav.appendChild(next);
  }

  renderPage(1);
});
