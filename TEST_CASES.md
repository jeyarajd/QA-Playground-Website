# QA Playground — Automatable Test Case List

Organized by module. Each case lists the target page, the relevant
`data-testid` selectors, and the expected behavior to assert. All selectors
below are attribute selectors, e.g. `[data-testid="button-submit-form"]`.

---

## 01 — Forms & Inputs (`forms.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| F1 | Fill required text fields and submit | `input-full-name`, `input-email`, `button-submit-form` | `text-form-output` JSON reflects entered values |
| F2 | Submit with required fields empty | `input-full-name`, `button-submit-form` | Native HTML5 validation blocks submit; `:invalid` pseudo-class matches |
| F3 | Phone field rejects invalid pattern | `input-phone` | Browser validation message appears for non-matching input; valid pattern (e.g. `+1 555 0100`) passes |
| F4 | Autofocus field receives focus on load | (field marked autofocus) | `document.activeElement` matches it immediately after `page.goto` |
| F5 | Readonly field cannot be edited | `input-locked` | `fill()` does not change value; attribute `readonly` present |
| F6 | Disabled field is not interactable | disabled input | `isEnabled()` returns false; `fill()` throws/is a no-op |
| F7 | Textarea accepts multiline text | `textarea-bio` | Value round-trips with `\n` preserved |
| F8 | Radio group allows only one selection | `radio-payment-card`, `radio-payment-bank`, `radio-payment-paypal` | Selecting one deselects the others; `isChecked()` confirms |
| F9 | "Select all" checkbox — indeterminate state | `checkbox-select-all`, `checkbox-channel-email/push/sms` | Checking some (not all) children sets `indeterminate === true` on the parent; checking all sets it fully checked; unchecking all clears it |
| F10 | Terms checkbox gates submit | `checkbox-terms`, `button-submit-form` | Submit blocked/validation fires when unchecked |
| F11 | Single-select dropdown | `select-country` | `selectOption()` changes value; output reflects selected country |
| F12 | Multi-select dropdown | `select-skills` | `selectOption([...])` selects multiple; output lists all selected values |
| F13 | Range/volume slider | `input-volume`, `text-volume-value` | Dragging or setting value updates the live label in sync |
| F14 | Color picker | `input-color` | `fill()`/`evaluate` sets hex value; reflected in UI swatch |
| F15 | Date field | `input-birthdate` | Accepts ISO date string via `fill()` |
| F16 | Numeric quantity input (stepper) | `input-quantity` | Respects min/max/step; typing out-of-range clamps or invalidates |
| F17 | Ghost/placeholder-only input (no visible label) | `input-ghost-search` | Must be located via placeholder or `aria-label`, not visible text — practice accessible-name locators |
| F18 | Reset button clears the form | `button-reset-form` | All fields return to defaults after click |
| F19 | Full round-trip assertion | all fields + `button-submit-form` + `text-form-output` | Fill every field type in one flow, submit, parse JSON output, assert every field matches input |

---

## 02 — Buttons & Actions (`buttons.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| B1 | Disabled button cannot be clicked | `button-disabled` | `isEnabled()` false; click has no effect |
| B2 | Delayed-enable button | `button-delayed` | Disabled on load, becomes enabled after N seconds — assert with `expect(locator).toBeEnabled({ timeout })`, not a hard click immediately |
| B3 | Click counter increments correctly | `button-counter`, `text-counter-value` | N clicks → counter shows N; test rapid successive clicks |
| B4 | Loading-state button | `button-loading`, `text-loading-output` | Click shows a loading indicator, then resolves to a completed state after delay |
| B5 | Double-click handler | `button-dblclick` | Single click does nothing/different text; `dblclick()` triggers the double-click-specific output |
| B6 | Right-click / context menu | `button-rightclick` | `click({ button: 'right' })` triggers the context-click output (not the left-click one) |
| B7 | Toggle button aria-pressed | `button-toggle` | `aria-pressed` flips between `"true"`/`"false"` each click |
| B8 | Scoped duplicate-label remove buttons | `card-item`, `button-remove` (repeats per card) | Must scope locator to the specific card (`card-item.filter(...).locator('button-remove')`) — clicking an unscoped first match removes the wrong item |
| B9 | Reveal-after-delay element | `button-load-action` | Element/text appears only after an async delay; requires explicit wait, not immediate assertion |
| B10 | Link styled as a button | `link-styled-as-button`, `text-link-output` | Confirm it's an `<a>` under the hood (role "link", not "button") despite visual styling |
| B11 | Ghost/icon-only button (no text) | `button-ghost` | Must be located by `aria-label`/role, not text content |

---

## 03 — Tables (`tables.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| T1 | Sort by name ascending/descending | `th-sort-name`, `table-sortable` | First click sorts asc, second click on same header reverses to desc — assert row order via `locator('tr').allTextContents()` |
| T2 | Sort by role / score columns | `th-sort-role`, `th-sort-score` | Same asc/desc toggle behavior per column; sorting one column doesn't corrupt another |
| T3 | Filter table by text | `input-table-filter` | Typing narrows visible rows; clearing restores full set; assert row count before/after |
| T4 | Add a row to the editable table | `input-new-task`, `input-new-owner`, `button-add-row`, `table-editable` | New row appended with entered values; row count increments by 1 |
| T5 | Delete a row from the editable table | `button-delete-row`, `row-task` | Row count decrements by 1; correct row removed (assert by content, not index) |
| T6 | Add row with empty inputs | `button-add-row` | Verify whether empty submission is blocked or adds a blank row — decide expected behavior and assert it |
| T7 | Pagination — navigate pages | `pagination-nav`, `table-paginated` | 23 records / 5 per page → 5 pages; last page shows remaining 3 rows; next/prev disabled at bounds |
| T8 | Pagination — row count per page | `table-paginated` | Every page except the last shows exactly 5 rows |
| T9 | Static table read-only baseline | `table-static` | Confirm no sort/filter controls exist here — pure text-extraction practice (`allTextContents`) |

---

## 04 — Frames & iFrames (`frames.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| I1 | Interact with same-origin iframe content | `iframe-basic` | Use `frame_locator('[data-testid="iframe-basic"]')` to click/read inside; verify parent page locators do NOT see iframe content directly |
| I2 | Two-level nested iframe | `iframe-outer` (contains another nested frame) | Chain `frameLocator` twice to reach the innermost content; assert deepest element text |
| I3 | Lazy-loaded iframe | `button-load-frame` | Iframe has no `src`/is absent before click; clicking loads it — assert frame doesn't exist beforehand and does after, with an explicit wait |
| I4 | Frame isolation | any frame + parent page | Actions inside a frame (e.g. filling a field) don't leak into parent page state, and vice versa |

---

## 05 — Dialogs & Modals (`dialogs.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| D1 | Native `alert()` | `button-alert` | Register `page.on('dialog', ...)` before click; assert dialog type is `alert` and message text; must `accept()` or it blocks the page |
| D2 | Native `confirm()` — accept | `button-confirm`, `text-dialog-output` | Accept the dialog; output reflects the "OK" branch |
| D3 | Native `confirm()` — dismiss | `button-confirm`, `text-dialog-output` | Dismiss the dialog; output reflects the "Cancel" branch |
| D4 | Native `prompt()` with input | `button-prompt`, `text-dialog-output` | Accept with custom text via `dialog.accept('some text')`; output shows entered text |
| D5 | Native `prompt()` dismissed | `button-prompt` | Dismiss returns null/cancelled state, distinct from D4 |
| D6 | Custom modal opens with focus trap | `button-open-modal`, `modal-overlay` | Focus moves into the modal on open; `Tab`/`Shift+Tab` cannot escape to background elements |
| D7 | Custom modal — Escape closes it | `modal-overlay` | Pressing `Escape` closes the modal |
| D8 | Custom modal — confirm/cancel buttons | `button-modal-confirm`, `button-modal-cancel` | Each closes the modal and produces a distinct outcome/output |
| D9 | Focus returns to trigger on modal close | `button-open-modal` | After closing (any method), `document.activeElement` is back on the button that opened it |
| D10 | Toast notification appears and auto-dismisses | `button-show-toast` | Toast appears immediately, then disappears after its timeout without user action — assert both states with appropriate waits |
| D11 | Tooltip on hover/focus | `button-tooltip-trigger`, `tooltip-bubble` | Tooltip is hidden by default, becomes visible on hover/focus, hides again on mouse-leave/blur |

---

## 06 — Dynamic Content (`dynamic.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| DY1 | Delayed render | `text-delayed-render` | Element/text is absent immediately after load, appears after ~2.5s — use `expect(...).toBeVisible({ timeout: 3000 })`, never a fixed `waitForTimeout` in production tests |
| DY2 | Live poll counter | `text-poll-counter` | Value increases over time without page interaction; assert it changes between two reads |
| DY3 | Stale element handle after re-render | `stale-slot` | Grab a handle, trigger the re-render, then try to use the old handle — expect a stale-element error; re-query for the fresh element instead |
| DY4 | Overlay blocks click via actionability | `button-covered`, `overlay-loading` | Attempting to click while the overlay covers the button should fail/timeout on actionability (not silently succeed); after the overlay is removed (~2s), the same click succeeds |
| DY5 | Vanishing banner | (banner shown via `button-show-vanishing`) | Banner appears immediately, then disappears after 3s on its own |
| DY6 | Progress bar completion | `button-start-progress`, `progress-fill`, `progress-track`, `text-progress-label` | Starts at 0, animates to 100%, label updates to a "done" state — assert final state with a wait, not immediately after click |
| DY7 | Moving target eventually clickable | `button-show-moving`, `button-moving-target` | Element moves for a period then settles; a click attempt should wait for it to stop and become actionable, not click mid-animation |
| DY8 | Infinite scroll loads more rows | `infinite-scroll-box` | Starts with 10 rows; scrolling to the bottom loads 10 more (up to 20 total); assert row count before and after scroll |

---

## 07 — Drag, Drop & Upload (`dragdrop.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| DD1 | Reorder items within a list (HTML5 drag) | `list-reorder`, `dnd-item` | Dragging an item to a new position changes the DOM order — assert via `allTextContents()` before/after |
| DD2 | Drag an item between two lists | `list-backlog`, `list-done`, `dnd-card` | Item moves from backlog to done; both lists' counts update correctly; item no longer exists in source list |
| DD3 | Drag-and-drop onto a dropzone | `dropzone` | Dropping a card/file-like element onto the zone triggers the expected visual/state change |
| DD4 | File upload via input | `input-file` | Use `setInputFiles()` with a real file path; assert the file name appears in `file-list` |
| DD5 | File upload — multiple files (if supported) | `input-file` | Verify whether multiple selection is accepted; assert accordingly |
| DD6 | File download | `button-download` | Use `page.waitForEvent('download')` around the click; assert the downloaded filename (`sample-report.txt`) and that content is non-empty |
| DD7 | Drag with keyboard (accessibility check, optional) | `dnd-item` | Note: HTML5 drag-and-drop is typically mouse-only; document this as a known limitation if attempting keyboard-based reorder |

---

## 08 — Windows & Tabs (`windows.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| W1 | Link opens a new tab | `link-new-tab` | Listen for `context.on('page', ...)` (or `waitForEvent('popup')`) around the click; assert the new tab's URL/title |
| W2 | Popup window opens | `button-open-popup` | New popup page opens; assert it loads `popup.html` |
| W3 | Popup sends `postMessage` back to opener | `text-popup-message` | After the popup posts its message and closes itself, the parent page's `text-popup-message` updates with the received text |
| W4 | Popup closes itself automatically | `button-open-popup` | After the message is sent, assert the popup page's `isClosed()` becomes true without the test explicitly closing it |
| W5 | Switching context back to the original tab | n/a | After interacting with the new tab/popup, confirm you can still interact with the original page (context/page references remain valid) |

---

## 09 — Tricky Locators (`locators.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| L1 | Duplicate `id` attribute resolves ambiguously | `dup-id-first`, `dup-id-second` (share one `id`) | An `id`-based CSS selector matches 2 elements — this should fail Playwright's strict-mode locator check; use `data-testid` or `.first()`/`.nth()` instead, and assert the strict-mode violation is caught |
| L2 | Scoped "View" buttons per row | `button-view` (repeats), `text-view-output` | Must scope the locator to the specific row/card; clicking an unscoped match hits the wrong row — assert correct row's output |
| L3 | Hidden element is not visible | `twin-hidden` | `isVisible()` returns false; interacting with it should fail/timeout |
| L4 | Offscreen element is technically visible | `twin-offscreen` | Despite being positioned off-canvas (`left: -9999px`), Playwright's `isVisible()` returns **true** (non-zero size, no hidden CSS) — a good lesson that "visible" ≠ "on screen"; consider asserting `boundingBox()` to detect true on-screen position |
| L5 | Zero-opacity element visibility | `twin-zero-opacity` | Confirm actual Playwright behavior (test and document whether `isVisible()` treats `opacity: 0` as visible or not, since it currently only sets `pointer-events: none` — verify empirically rather than assuming) |
| L6 | Regenerating id/class | `text-current-id` | The element's `id`/`class` changes every 2 seconds — an id-based locator captured once will go stale; re-query on each interaction or use a stable `data-testid` |
| L7 | Shadow DOM piercing | `shadow-widget` | Playwright's standard locators automatically pierce open shadow roots — click the button inside `shadow-widget` without manually accessing `shadowRoot` |
| L8 | Whitespace/unicode text normalization | `text-unicode`, `button-whitespace` | Raw text contains irregular whitespace/unicode; `getByText()` with default normalization still matches, while an exact-string comparison of `textContent()` may not — demonstrate both |
| L9 | Stable target as a control/baseline | `button-stable-target` | A "normal" element with no tricks — useful as a sanity-check control test |
| L10 | Row-order locator practice | `row-order` | Practice `nth()`/structural locators when no unique identifying attribute is available |

---

## 10 — Autocomplete & Pickers (`autosuggest.html`)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| A1 | Typeahead search — debounced results | `input-typeahead`, `list-typeahead` | Suggestions appear only after a simulated delay (~300ms) following typing — assert with a wait, not immediately after `fill()` |
| A2 | Typeahead — keyboard navigation | `input-typeahead`, `list-typeahead` | `ArrowDown`/`ArrowUp` moves highlighted suggestion; assert active/highlighted item changes |
| A3 | Typeahead — Enter selects highlighted item | `input-typeahead`, `text-typeahead-selected` | Pressing Enter on a highlighted suggestion commits it; output reflects the selection |
| A4 | Typeahead — Escape closes suggestions | `input-typeahead`, `list-typeahead` | Escape hides the suggestion list without selecting anything |
| A5 | Typeahead — no matches | `input-typeahead` | Typing a query with no matches shows an empty/no-results state (verify actual behavior, don't assume) |
| A6 | Native `<datalist>` autocomplete | `input-datalist` | Confirm the field accepts free text plus the datalist-suggested options; note that the native dropdown itself is OS-rendered and not directly inspectable/clickable via Playwright — test by `fill()`-ing a listed value and asserting it's accepted |
| A7 | Tag input — add via Enter | `input-tag`, `tag-pill`, `text-tag-summary` | Typing a value and pressing Enter creates a new pill and updates the summary text |
| A8 | Tag input — add via comma | `input-tag` | Typing a value followed by `,` also commits a tag |
| A9 | Tag input — remove a tag (including the pre-seeded one) | `button-remove-tag`, `tag-pill`, `text-tag-summary` | Clicking the × on any pill (including the initial "playwright" seed pill) removes it and updates the summary — this seed-pill case was previously a real bug, worth a dedicated regression test |
| A10 | Tag input — duplicate tag handling | `input-tag` | Verify whether adding a value that's already a tag is blocked or creates a duplicate — assert actual behavior |
| A11 | Date range input respects min/max | `input-range-date` | `min`/`max` attributes are set to a bounded window (today .. +30 days); filling an out-of-range date should be flagged invalid via `:invalid`/`checkValidity()` |
| A12 | Week picker input | `input-week` | Accepts a week-format value (e.g. `2026-W37`) via `fill()` |

---

## Cross-cutting / global test cases (apply on every page)

| # | Test case | Key selectors | Expected result |
|---|---|---|---|
| G1 | Theme toggle switches light/dark | `theme-toggle` | Clicking toggles `data-theme` attribute on `<html>` between `light`/`dark`; icon swaps too |
| G2 | Theme persists across navigation within a session (or resets — verify actual behavior) | `theme-toggle` | Navigate to another page and check whether the theme choice carries over (no `localStorage` is used, so expect it to reset to system preference on full reload — confirm and document) |
| G3 | Sidebar navigation — active link highlighting | nav links in sidebar | The current page's nav link has `aria-current="page"` |
| G4 | Mobile responsive — sidebar collapses | `sidebar-toggle` | At viewport widths ≲768px, sidebar is hidden by default; clicking the hamburger (`sidebar-toggle`) opens it; clicking a nav link closes it again |
| G5 | Every interactive element has an accessible name | all controls | Icon-only buttons (`button-ghost`, `theme-toggle`, `sidebar-toggle`) expose `aria-label`; run an automated a11y scan (e.g. axe-core) per page as a smoke test |
| G6 | No console errors on page load | n/a | Attach a `page.on('console')`/`pageerror` listener on each of the 10 module pages; assert zero uncaught errors |
| G7 | No unhandled network failures | n/a | Assert all local asset requests (css/js/fonts) return 2xx; the only external request is the Fontshare font CDN |

---

## Suggested automation approach

- **Framework:** Playwright Test (`@playwright/test`) fits best given the `data-testid` convention — use `page.getByTestId(...)` everywhere instead of raw attribute selectors.
- **Structure:** One spec file per module (`forms.spec.ts`, `buttons.spec.ts`, …) mirroring this table, plus a `global.spec.ts` for the cross-cutting cases.
- **Timing-sensitive cases** (buttons/dynamic/autosuggest modules): always assert with Playwright's built-in auto-waiting / `expect(locator).toBeVisible({timeout})` rather than `waitForTimeout`, except where you're deliberately testing timing behavior itself.
- **Priority order if automating incrementally:** Forms → Buttons → Tables (core CRUD-style interactions) → Dialogs → Dynamic Content (timing/staleness — most valuable for interview-style Playwright practice) → Frames/Windows (context switching) → Locators/Autosuggest (advanced locator strategy).
