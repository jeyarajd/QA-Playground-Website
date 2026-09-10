# QA Playground

A small, self-contained website built to practice Playwright (and Selenium /
Robot Framework) automation. Eleven pages, each isolating one class of web UI
behavior, with edge cases baked in on purpose — flaky timing, hidden/duplicate
elements, dynamic content, iframes, popups, drag-and-drop, and more.

Every interactive control carries a `data-testid` attribute where a real app
would have one. A handful of controls deliberately **omit**, **duplicate**, or
**hide** their identifiers so you get practice writing resilient locators
(by role, text, and structure) instead of relying on test ids alone — see
`10-locators.html`.

## Running it locally

No build step and no dependencies — it's static HTML/CSS/JS.

**Option A — open directly:**

Just double-click `index.html` or open it with `file://` in your browser.
Everything works except the iframe pages (`frames.html`) — most browsers
block same-origin iframe content over `file://`. Use Option B for those.

**Option B — serve it (recommended):**

```bash
# Python (built-in, no install)
python3 -m http.server 3000

# or Node (no install, via npx)
npx serve . -l 3000
```

Then open `http://localhost:3000`.

> **Avoid `serve`'s `--single` / SPA-fallback flag.** Running `npx serve . --single`
> redirects every clean URL (e.g. `/forms`) back to `index.html`, which breaks
> multi-page navigation on this site — it is a set of separate static pages,
> not a single-page app. Plain `npx serve .` (no flags) or `python -m http.server`
> works correctly.

Point your Playwright config's `baseURL` at whichever local server you use, e.g.:

```js
use: { baseURL: 'http://localhost:3000' }
```

## Folder structure

```
qa-playground/
├── index.html              # Home page — module overview + quick-reference table
├── forms.html               # 01 — text/textarea/radio/checkbox/select
├── buttons.html              # 02 — buttons, links, context menu
├── tables.html               # 03 — sorting, filtering, pagination, editable rows
├── frames.html                # 04 — same-origin, nested, and lazy-loaded iframes
├── dialogs.html               # 05 — native alert/confirm/prompt + custom modal/toast
├── dynamic.html                # 06 — delayed render, polling, stale elements, overlays
├── dragdrop.html                # 07 — drag reorder, cross-list drag, upload, download
├── windows.html                  # 08 — new tab, popup window + postMessage
├── locators.html                  # 09 — duplicate ids, hidden/offscreen twins, shadow DOM
├── autosuggest.html                # 10 — typeahead, datalist, tag input, date/week pickers
├── frame-inner.html, frame-nested-*.html, frame-lazy.html   # iframe targets used by 04
├── popup.html, new-tab.html                                  # window targets used by 08
├── css/styles.css            # design system (light + dark themes)
├── js/                       # one script per page + shared app.js (theme/sidebar/toast)
└── build/                    # simple templating used to assemble the pages (not needed at runtime)
```

The `build/` folder is only used to *generate* the shipped HTML files from
shared content + sidebar fragments — you don't need to run it to use the site.
The generated pages are already committed at the project root.

## Module-by-module edge cases

**01 — Forms & Inputs** (`forms.html`)
Labelled text input, autofocus + readonly + disabled fields, a
pattern-constrained phone input, textarea, radio group, checkboxes including a
tri-state "select all" (indeterminate), single and multi-select dropdowns.
Submitting renders the collected values as JSON so you can assert against
exact form state.

**02 — Buttons & Actions** (`buttons.html`)
A button that only enables after a delay, a click counter, a button that
shows a loading state on click, double-click and right-click (context menu)
handlers, an `aria-pressed` toggle button, scoped duplicate-label remove
buttons per row (classic "which one do I click" locator trap), and a
reveal-after-delay element.

**03 — Tables** (`tables.html`)
Sortable columns (asc/desc), a text filter, an editable table with add/delete
row, and a paginated table (23 records, 5 per page) to practice "wait for
row count" and "navigate to page N" patterns.

**04 — Frames & iFrames** (`frames.html`)
A same-origin iframe, a two-level nested iframe, and an iframe that only
loads its `src` when a button is clicked (lazy loading) — good for practicing
`frame_locator` / `switch_to.frame` and waiting for frame content to exist.

**05 — Dialogs & Modals** (`dialogs.html`)
Native `alert`, `confirm` (accept and dismiss paths), and `prompt`, plus a
custom modal with a real focus trap (focus moves in on open, `Escape` closes
it, focus returns to the trigger element on close), and a toast notification.

**06 — Dynamic Content** (`dynamic.html`)
Delayed render (2.5s), a live poll counter, a re-render that invalidates a
previously-grabbed element handle (stale element practice), a button covered
by an overlay that blocks the click via actionability checks until the
overlay is removed, a banner that vanishes after 3s, a progress bar, a target
that moves before settling into a clickable position, and infinite scroll
(loads 10 more rows as you scroll, up to 20).

**07 — Drag, Drop & Upload** (`dragdrop.html`)
HTML5 drag-to-reorder within a list, drag between two lists (e.g.
backlog → done, with live counts), file upload (`setInputFiles`), and a
generated file download.

**08 — Windows & Tabs** (`windows.html`)
A link that opens a new tab, and a button that opens a popup window which
posts a message back to the opener via `postMessage` before closing itself —
covers multi-page/multi-context handling.

**09 — Tricky Locators** (`locators.html`)
A duplicate `id` used on two elements (forces a non-id locator strategy),
scoped "View" buttons that repeat per table row, a genuinely hidden element
vs. an "offscreen" element (moved off-canvas with `position: absolute; left:
-9999px` — technically still visible per Playwright's actionability
definition, since it has non-zero size and no hidden styling) vs. a
zero-opacity element, an id/class that regenerates every 2 seconds, a button
inside a Shadow DOM root (Playwright pierces shadow roots automatically —
most other tools don't), and text with irregular whitespace/unicode that
needs `getByText`'s normalization to match reliably.

**10 — Autocomplete & Pickers** (`autosuggest.html`)
A typeahead search box with a simulated network delay and full keyboard
navigation (arrow keys, Enter to select, Escape to close), a native
`<datalist>` autocomplete (rendered entirely by the browser, not the page —
Playwright can't interact with its dropdown the way it can with page-rendered
suggestions), a tag input that adds values on Enter/comma and removes them on
click or Backspace, and native date/week picker inputs with `min`/`max`
constraints.

## Notes

- Every page has a working light/dark theme toggle (top of the sidebar) and a
  responsive layout that collapses the sidebar into a hamburger menu below
  ~768px width.
- Nothing persists to `localStorage` — state resets to defaults on every page
  load, so your tests always start from a known baseline.
- The site has no backend and makes no network calls beyond loading its own
  static assets and a webfont from Fontshare's CDN.
