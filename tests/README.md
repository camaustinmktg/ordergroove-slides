# Tests for Slide Skill 2.0 (beta)

Not part of the skill package: these build decks from `ordergroove-slides-beta/references/layout-recipes.md` the way Claude does, by pasting each recipe's code against `scripts/build.js`.

Install the build's dependencies once (`npm install` in `ordergroove-slides-beta/`, or anywhere and point `NODE_PATH` at its `node_modules`).

- `node tests/build-all.js ordergroove-slides-beta all.pptx` builds every recipe and variant with its Figma sample content. Add `--source` to give every recipe with a `SOURCE` slot a 2-line note.
- `node tests/regression-2026-10-29.js` rebuilds the failures from the second real-deck test (8-row table, highlight rows at other heights, recipe 28 with a 2-line title + 3 metrics + a source note, the co-branded cover with the user's line break) and fails on any FOOTER, OVERLAP or OVERFLOW flag from `scripts/check-spacing.js`.

Render a deck to check it by eye: `soffice --headless --convert-to pdf deck.pptx && pdftoppm -jpeg -r 80 deck.pdf slide`.
