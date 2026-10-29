# Ordergroove Slides (Slide Skill 2.0)

On-brand presentation generator for Ordergroove. Built from the Figma design file "Slide Skill 2.0" (`1LAizYM7R7QVubcHuix1KF`): its Layouts, Assets, Icons and Logo Archive.

## What it does

When anyone at Ordergroove asks Claude for a presentation, this skill makes every slide follow the brand system (colours, typography, layouts, backgrounds, logos, icons, charts, footer) without the user having to specify any of it. The output is a .pptx that opens in Google Slides, PowerPoint and Keynote.

## What's included

- **28 layout recipes** (`references/layout-recipes.md`): title, divider, agenda, content, icon columns, card grids, stats, big number, bar/line/donut charts, table, comparison, timeline, roadmap, testimonial, case study, logo grid, team, org chart, closings. All 27 are built from Figma frames, with A/B/C variants: every one of the 52 slide frames in Figma's Layouts section maps to a recipe and variant (coverage table at the top of the file).
- **Brand tokens** (`references/brand-constants.md`): colours, type scale, layout and logo rules, asset inventory.
- **Build helpers** (`scripts/build.js`): contrast rule, footer bars 1–3 and logo, native cards (any corner radii, shadows) and pills, logo cards, gradient shapes, placeholders, icons, shape charts.
- **Assets:** glow and gradient backgrounds, logo wall, footer bars, logos, gradient elements (`assets/brand/`, 2x PNG); 9 customer logos (`assets/logos/`); 213 Material Symbols Rounded icons with a keyword index (`assets/icons/`, `references/icon-index.md`); 5 Figtree weights.

## Installation

1. Unzip the package into the skills folder (claude.ai: upload the zip as a skill).
2. The first deck build runs `npm install` (pptxgenjs 3.12.0 and @resvg/resvg-js 2.6.2, from `package.json`); SKILL.md says how when the folder is read-only.

Run `node audit/test-recipes.js` in the source folder before every upload: it builds every recipe and variant against `scripts/build.js`, checks the coverage table (all 52 Figma frames), and fails on any error.

## Changelog

### Fixes from the second real-deck test (2026-10-29)

- **Source and methodology notes:** new `addSourceNote()` and a `const SOURCE = ""` slot on every content and data recipe (6–20, 22, 23, 28; not Card grid F, where it can't be read over the logo wall). The note sits at the foot, ends 0.35 in above the footer bar, and returns the bottom the content must end above, so cards, plots, panels and rows shorten to clear it. Stat card + image's "(Optimizely research)" line is now this slot. The source lines had no home before, and they caused most of the layout fights.
- **Table (17) takes any number of rows and columns:** new `addBrandTable()`. Rows keep Figma's heights while there's room and share the room when there isn't; a row with wrapped text gets the height it needs; text steps down from 12 pt to 9.5 pt only when it must; it warns before it would overflow. About 13 rows fit under a 1-line title. The label column widens for long labels. "1 in 41" figures right-align as numbers.
- **Highlighted rows at any height:** new `addGradientOutline()` draws the gradient outline for the box (it matches the Table Highlight Row PNGs to under 1/255 on the outline), so any row, or several, can take the brand highlight instead of a stand-in green outline. Before / after uses it too, and its "after" card can shorten.
- **Recipe 28 has room for real copy:** the title and subhead are measured (`addTitleBlock()`), so a 2-line title moves both blocks down instead of running into the subhead; the blocks then use the room down to the footer clearance; the panel tightens its padding before shrinking text; a metrics style that still doesn't fit switches to D (ledger) and says so; nothing runs past the blocks' bottom. New `MAIN = "table"` main block. A 2-line title, three metrics with 2-line captions and a 2-line source note now fit.
- **Co-branded cover without a photo:** Title with client logo + image D (Midnight) and E (white, glow along the bottom): the Ordergroove logo top left, the client's logo card top right, and a full-width title. No Figma frame yet.
- **Cover titles keep the user's line breaks:** new `fitTitle()` sizes a cover title (50 pt as designed, down to 36) to keep each line the user broke on one line, and the subtitle follows the title's real height. Title / cover (light) A widens to the full width before it shrinks. A cover whose column can't hold the breaks warns and points to a full-width cover.
- **Gradient panels at any size:** new `addGradientPanel()` draws Large Card Gradient 1 and Content Panel Gradient 1 for the box, so Big number, Two-column B and Content A can shorten for a note without squashing the PNG or cropping its corners.
- **Spacing check:** `check-spacing.js` now flags text that runs into other text (OVERLAP: a 2-line title over its subhead, a cover title over its subtitle) and tables that run into the footer. The three broken slides from the test deck passed the old check.
- **Unchanged:** every recipe's Figma sample still renders as before (pixel-compared, all 58 frames), apart from Stat card + image's source line (now 9.5 pt Regular, the note style) and a 1 px title nudge on Table.

### Photo accents and Icon columns section colours (2026-10-20)

- **Photo accents:** Team and Org chart take `const ACCENT = "cyan" | "pink" | "green"` (Intense Cyan, Flamingo Pink, Groovy Green); `null`, the default, keeps Figma's look. Team's round headshots get a coloured ring only, never a colour behind the photo; Org chart's offset tile takes the colour in full. New helpers `photoAccent()` and `addPhotoRing()`. Figma: "Accent options, picked" block in Layouts.
- **Icon columns and Card grid D follow the section colours:** each column / card is a section (green, pink, teal), through `addSectionTile`. Tile 1's tint is now Brand Green, not Groovy Green. Figma `1:324` and `1:427` use Icon Tile instances; the section rule has no exceptions.

### Recipe 28 metrics styles (2026-10-20)

- **Metrics panel, four styles** (Cameron picked all four and dropped the original): B figure first (White figure on a Gradient Highlight, as on Three-stat callout; the default), D ledger (name left, Groovy Green figure right), E stat cards (icon tile per metric), F hero (the first metric on a gradient card). 1–4 metrics each, sizes step down to fit real copy. Figma: B `124:965` redrawn, D–F new (`156:1212`, `156:1288`, `156:1371`); 58 Figma frames now map to a recipe.
- **New helper `addStatCardGradient()`:** Stat Card Gradient 2 at any size, rendered from Figma's gradient (matches the exported PNG to 1/255).

### Third pass: Cameron's answers and real-copy recipes (2026-10-20)

- **Footer by audience.** `newPresentation({ audience: "internal" | "external" })`. External decks (customers, prospects, partners) get the same footers without "Confidential and proprietary. Do not distribute."; SKILL.md says how to infer the audience and when to ask. New asset `footer-bar-1-external.png` (Figma "Footers External (no line)").
- **Renames:** Percentage callout (3-col) → Numbered columns; Content with subhead blocks + image → Stat card + image.
- **Green rule, strict for text and icons:** green labels, numerals, bullets and icon glyphs are `#009A50` on light and `#00FF85` on dark, judged by what they sit on. No more Green-400 text or icons. Fills keep their Figma colours.
- **New recipe 28, Content + dark side panel** (Figma `123:949`, `124:965`, `125:1019`): a main block (milestones, cards, options + rows or a bar chart) beside a Midnight panel (numbered list, metrics or a quote), so a dense proposal slide stays one slide. 55 Figma frames now map to a recipe.
- **Icon tile colours by section:** the 1st section with icons on a slide is green, the 2nd pink, the 3rd teal, the 4th Midnight (Figma's Tinted tiles); a dark side panel takes the next colour as a Solid tile. `addSectionTile()` / `tileColor()`.
- **Text on Midnight is White:** captions, subtitles and body on dark fills are White, never light gray; `subtitleColor(true)` now returns White.
- **Spacing check:** `node scripts/check-spacing.js deck.pptx` measures every card and panel against its content and flags bunched content, tight edges, overflow and text too close to the footer. It runs first in the QA step. The dark side panel now spreads its items so the space above and below match.
- **Real copy:** new helpers `textWidth`, `wrapLines`, `fitFontSize`, `addGradientHighlight` (the highlight bar at any width) and `addStatStrip`. Three-stat callout takes 3 or 4 figures; Process timeline B / D keeps the user's milestone names, fits pills and 4-line notes, and marks the current step; Logo grid does 9 as 3 × 3 and two labelled groups with a stat strip; Testimonial takes one quote or an anonymous attribution; Closing (simple) can carry a quote; Table right-aligns numbers, spans cells and takes an assumptions strip and footnote.

### Fixes from the first real-deck test (2026-10-20)

- **`sectionLabel()` tracking** is 0.33 pt (3% at 11 pt), like the recipes' own caps labels; it was 4 pt, which spaced the letters out. `layout-recipes.md` shows a label above a title (title moves down 0.23 in).
- **Theme fonts are Figtree** (`newPresentation()`), so numbered bullets and text added later in PowerPoint or Google Slides aren't Calibri.
- **`addPlaceholder(..., { path, fit: "contain" })`** places a cut-out (product shot, phone mock-up) whole instead of cropping it to the box.
- **Content is the user's** (SKILL.md, first non-negotiable): when the user gives content (an existing deck, a doc, notes), the skill keeps their text, numbers and punctuation exactly as given. The only changes are sentence-case titles, ALL CAPS section labels and plain numerals. It never writes copy to fill a slot, flags content that looks wrong instead of fixing it, and asks "Do you want help drafting content?" rather than editing. With no text given, it writes the copy.
- **SKILL.md:** "Rebuilding an existing deck" (extract, inventory, one source slide in and one slide out in the same order, build from the skill's parts when no recipe holds a slide, reuse and clean the source's images, keep customer files local, diff the text against the source) and a rule for a customer logo that doesn't suit the white logo card (recolour all Midnight, flag it, offer to swap in a full-colour one).

### Slide Skill 2.0, second pass (2026-10-20)

- **Every Figma slide is reproducible.** 52 slide frames → 27 recipes with variants. The 12 recipes that still had v2.1 layouts are rebuilt from Figma: Section divider (A gradient, B product shot, C photo), Agenda (A pills, B bullets), Content: heading + bullets (A panel, B product shot), Two-column with quote card (A, B, C), Content with subhead blocks + image, Three-stat callout, Percentage callout (3-col), Before / after (A lists, B cards), Process timeline (A–D), Testimonial (A light, B dark), Case study one-pager, Closing with contact (A, B, C). New variants on built recipes: Title / cover (light) A, Title with client logo + image A.
- **Coverage table** in `layout-recipes.md`: Figma frame and node → recipe → variant. The test reads it and fails if a frame or a variant is missing.
- **Footer bars 2 and 3:** `addFooter(s, { bar: 2 })` adds the slide number; `{ bar: 3 }` is the slimmer bar on tables, timelines, Before / after A, Team and Org chart, as in Figma.
- **Fixed to match Figma:** Title with client logo C uses the wider Gradient Accent 2; Section divider is the Figma gradient / product-shot / photo design, not the dark glow.
- **New assets:** full gradient and second light-glow backgrounds, Gradient Accents 2 and 3, gradient stat cards, content panel, highlight bar, four gradient-outline cards, number circle, initials disc, quote mark, all-Midnight logo, Footer Bar 3, and the Midnight Dollar Shave Club logo.
- **New helpers:** `addGradientShape()` (gradient images with a baked-in shadow), `addLogoCard()`, `figmaShadow()`, per-corner radii in `addCard()` and `addPlaceholder(..., { shape: "round" })`, `addLogoFit(..., { align: "left" })`, `addLogo(..., { mono: true })`.

### Slide Skill 2.0 (2026-10-20, first pass for testing)

- **Figma is the source of truth.** Recipes, assets and colours rebuilt from the "Slide Skill 2.0" file.
- **Recipes: 21 → 27.** New: Chart (pie / donut), Roadmap, Table, Team, Org chart, Card grid (6 variants), Big number, Icon columns. Redesigned in Figma: Title / cover (dark), Chart (line), Logo grid, Closing / thank you (simple). Rebuilt from Figma: Title / cover (light), Title with client logo + image, Chart (bar). Removed: Percentage callout (2-col) and Market size / concentric tiers. Renumbered and grouped by slide type.
- **Charts are native shapes by default** (`drawBarChart`, `drawLineChart`, arc donut), so they look the same in Google Slides, PowerPoint and Keynote. A native PowerPoint chart only when the user explicitly says PowerPoint.
- **Icons:** 213 Material Symbols Rounded SVGs with a keyword index; `addIcon()` / `addIconTile()` render them to PNG at build time. The "unicode stand-ins" rule is gone.
- **Logo placement follows Figma:** large logo + text-only footer on title and closing slides, the footer bar everywhere else, never two logos on one slide.
- **Backgrounds:** the overlapping-circle backgrounds are retired; title, divider and closing slides use the new glow backgrounds, content slides plain fills.
- **Green is `#009A50`** (v2.1's `#009950` was wrong). New tokens: Green-400, Cyan-300, Cyan-400, Piercing Pitaya, Electric Eggplant, Radiant Radish, Gray-700, Gray-950, Gray-975. Chart order now follows Figma.
- **Numbers are plain** (1, 2, 3), never zero-padded. Slide titles are sentence case.
- **Fixes from the v1 audit:** QA uses `soffice` directly (v1 pointed at a soffice.py helper this skill never had); `addGradientCard()` no longer draws a mismatched box over the PNG or stretches it; the hand-off tells users to install Figtree or use Google Slides; `addLogoBox()` and the quote icon keep their aspect ratio; before/after cards clear the footer; `package.json` added.
- Assets re-exported at 2x from Figma with transparency; `Footer.png` is now 2x.

### 2.1

- Footer height corrected to 0.75" (Footer.png is 1920×108 px).
- Body copy line spacing standardised at 1.15.
- Quote icon reserved for testimonials; insight callouts use a Midnight card with a green bar and a "KEY INSIGHT" label.

### v2 (from v1)

- Soleil removed; Regular, SemiBold and ExtraBold weights added; Gray-900, Gray-800 and secondary text tones added.
- 21 layout recipes (up from 10), gradient callout cards, testimonial backgrounds, quote icon and logo-box assets, `subtitleColor()`, `addGradientCard()`, `addQuoteIcon()`, `addLogoBox()`.
