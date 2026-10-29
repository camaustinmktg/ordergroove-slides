# Handoff: Slide Skill 2.0 beta fixes (2026-10-29)

Branch: `claude/slide-skill-2-beta-fixes`. The beta skill lives in `ordergroove-slides-beta/`. The first commit is the beta exactly as synced; the second has the fixes, so `git diff 5742602` shows every change.

## Done
- Source / methodology notes: `addSourceNote()` plus a `SOURCE` slot on every content and data recipe.
- Table (17): any number of rows and columns (`addBrandTable()`), and highlight rows at any height (`addGradientOutline()`).
- Recipe 28: measured title (`addTitleBlock()`), auto room, tighter panel padding, a fallback to the ledger style, and a table main block.
- Covers: `fitTitle()` keeps the user's line breaks. New recipe 3 variants D and E (co-branded, no photo, full-width title).
- `addGradientPanel()` draws gradient cards at any size.
- `check-spacing.js` now flags overlapping text and tables that run into the footer.
- Tests: `tests/build-all.js`, `tests/regression-2026-10-29.js` (passes), and `tests/before-after-2026-10-29.png`. See `tests/README.md`.

## In progress: dark title and section divider slides
Cameron: "Make sure you're using the latest dark title and separator slides. The glow should be coming from the bottom."
The skill still uses `bg-glow-dark.png`, which has the glow on the right, for recipe 1 (dark title) and recipe 26. Section divider (recipe 4) has no dark variant.

Figma file `1LAizYM7R7QVubcHuix1KF` ("Slide Skill 2.0") has newer frames to check. I found them but haven't opened them yet:
- `298:2634` New Dark Backgrounds (top level). Likely the bottom-glow dark background.
- `10:713` Background Glow Dark 1 and `179:1352` Background Glow Light 3 (Assets › Backgrounds).
- `232:1770` Feedback round 2 / 19 Section dividers: dark and light glow (options `232:1774`, `232:1799`, `232:1824`, `232:1850`).
- `298:2685` Image Title Slides w/o customer (holds A `298:2736` and B `298:2747`).
- `234:1832` Feedback round 2 / 20 Co-branded cover: white logos, no card.
- `180:1352` "Title with client logo + image D" and `180:1401` "…D, logo card" already exist in Figma. My new 3 D/E were built without seeing them: reconcile the names and the design with these frames.

Next steps: screenshot those frames; export the new dark background(s) at 2x into `assets/brand/`; update recipe 1, recipe 26 and `SAFE` (the text column changes when the glow comes from the bottom); add the dark section divider to recipe 4; check whether 3 D/E should follow `180:1352` / `234:1832`. Then rerun `tests/build-all.js` and the regression test.

## Open questions for Cameron
- Roll `addTitleBlock()` out to the other content recipes? Only 17 and 28 handle 2-line titles today.
- Open a PR for Greg?
