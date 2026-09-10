import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, "build")

with open(os.path.join(BUILD, "sidebar.html"), encoding="utf-8") as f:
    SIDEBAR = f.read()

PAGE_HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230e7c5f'/><path d='M10 9 L5.5 16 L10 23 M22 9 L26.5 16 L22 23 M12.5 16.5 L15 19 L20 12.5' stroke='white' stroke-width='2.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
<link rel="stylesheet" href="css/styles.css" />
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<button class="sidebar-toggle" data-sidebar-toggle aria-expanded="false" aria-controls="sidebar" data-testid="sidebar-toggle">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
  Menu
</button>

<div class="app-shell">
  <aside class="sidebar" id="sidebar" data-sidebar>
{sidebar}
  </aside>

  <main class="main" id="main">
    <header class="page-header">
      <div class="page-kicker">qa.playground / {kicker}</div>
      <h1 class="page-title">{h1}</h1>
      <p class="page-desc">{page_desc}</p>
    </header>

{content}

    <footer class="site-footer">Built for practicing Playwright, Selenium, and Robot Framework locators.</footer>
  </main>
</div>

<script src="js/app.js"></script>
{extra_scripts}
</body>
</html>
"""

with open(os.path.join(BUILD, "pages.json"), encoding="utf-8") as f:
    pages = json.load(f)

for slug, meta in pages.items():
    content_path = os.path.join(BUILD, "content", slug + ".html")
    with open(content_path, encoding="utf-8") as f:
        content = f.read()
    extra_scripts = "\n".join(
        '<script src="js/{}.js"></script>'.format(s) for s in meta.get("scripts", [])
    )
    html = PAGE_HEAD.format(
        title=meta["title"],
        desc=meta["desc"],
        sidebar=SIDEBAR,
        kicker=meta["kicker"],
        h1=meta["h1"],
        page_desc=meta["page_desc"],
        content=content,
        extra_scripts=extra_scripts,
    )
    out_path = os.path.join(ROOT, slug + ".html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", out_path)
