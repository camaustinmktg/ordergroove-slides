# Brand Constants

The values in this file are the ground truth for every Ordergroove deck. Colors match the variables in the Figma file "Slide Skill 2.0" (key `1LAizYM7R7QVubcHuix1KF`, checked 2026-10-19), with one exception: Green is `#009A50` (Cameron confirmed 2026-10-19), while Figma's Green-300 variable reads `#009950`. Token names are the Figma variable names. Copy them directly — don't approximate, don't substitute "close enough" equivalents.

## Colors

### Primary palette

| Figma variable | Hex | When to use |
|---|---|---|
| Midnight | `#17132F` | Dark backgrounds; heading + body text on light backgrounds |
| Gray-200 (Dark Indigo) | `#2E2A47` | Subtitle text on light backgrounds; muted body text |
| Green | `#009A50` | Accent on **light** backgrounds — section labels, numerals, stat highlights |
| Groovy Green | `#00FF85` | Accent on **dark** backgrounds — section labels, CTA, highlights; chart series 1 |
| Intense Cyan | `#00FAFF` | Chart series 3; gradient stop |
| Neon Carrot | `#FF8500` | Gradient accent stop (gradient callout cards); chart series 8 |
| Laser Lemon | `#EAFF00` | Gradient accent stop; chart series 4; emphasis on dark only; **never** as text on white |
| White | `#FFFFFF` | Light background; text on dark |
| Gray-900 | `#EBEAF0` | Lines and dividers on dark. **Not for text:** text on Midnight is White (Cameron, 2026-10-20) |
| Gray-800 | `#D8D7DF` | Card borders; divider lines; chart gridlines; chart series 7 |

### Secondary palette

| Figma variable | Hex | When to use |
|---|---|---|
| Green-400 | `#00CC6A` | A Figma variable. Not used for text or icons (green rule, 2026-10-20) and not an icon tile colour (Tile Green removed 2026-10-19) |
| Cyan-300 | `#009699` | Icon tiles on **dark** backgrounds; Roadmap's second project label |
| Cyan-400 | `#00BEC0` | Icon tiles on **light** backgrounds only. New token, decided 2026-10-19; not yet a Figma variable |
| Piercing Pitaya | `#FF61D3` | Chart series 5; icon tiles; card outlines |
| Electric Eggplant | `#8500FF` | Chart series 6 |
| Radiant Radish | `#D32E55` | Used on the comparison slide. Also Figma's designer-note badge, which is not slide content |
| Gray-700 | `#ABA9BA` | Light muted lines and labels; chart leader lines; placeholder outlines |
| Gray-950 | `#F5F5F8` | Off-white card and panel fill on light slides; table row shading |
| Gray-975 | `#F6F7FB` | Light slide background behind white cards (card grids, logo grid, stat, quote and testimonial slides). Named 2026-10-19; Figma's library style for it is still called "#F6F7FB". `C.gray975` |

### Secondary text tones

| Figma variable | Hex | Use |
|---|---|---|
| Gray-300 (Muted) | `#4F4A6A` | Secondary body text on light backgrounds |
| Gray-400 (Soft) | `#666279` | Tertiary/caption text on light backgrounds; chart axis labels |

### The green contrast rule (most important)

This is the rule people get wrong most often:

- **Light/white background** → accent is Green `#009A50`
- **Dark/Midnight background** → accent is Groovy Green `#00FF85`

Groovy Green on white has insufficient contrast and looks cheap. Green on dark disappears. Always use `accentColor(isDark)` from `scripts/build.js` — it returns the right value.

**Strict for text and icons (Cameron, 2026-10-20):** any green text, numeral or icon (labels, numbers, check marks, icon glyphs, list bullets) is Green `#009A50` on a light background and Groovy Green `#00FF85` on a dark one. Never Green-400 `#00CC6A`, and never Groovy Green on white.
- **Judge by what the element sits on, not the slide.** A white card on a Midnight slide is light, so its icon is `#009A50` (Card grid D). A Midnight panel on a white slide is dark, so its numbers are `#00FF85` (Content + dark side panel).
- **Fills keep their Figma colours:** chart bars and slices, pills, card outlines, timeline dots and lines, icon-tile tints, gradients and the logo. Groovy Green bars on white are fine; Groovy Green text on white is not.

### Text on Midnight is White

On Midnight and other dark fills (dark slides, dark cards, the dark side panel), every line of text is **White**: titles, subtitles, body, captions and attributions (Cameron, 2026-10-20). Never a light gray such as Gray-900 `#EBEAF0` or Gray-700 `#ABA9BA`. The only other colour is an accent, Groovy Green, under the green rule. `subtitleColor(true)` returns White. The gray "Image" / "Photo" label inside a placeholder box is not slide text; it disappears when the user's file goes in.

### Chart sequence

For multi-series charts, use these colors in order. This is the order on Figma's "Pie chart colors" slide (node `1:1349`): a chart with N series uses the first N colors. It's `C.chart` in `scripts/build.js`.

1. `#00FF85` Groovy Green
2. `#17132F` Midnight (on dark slides, swap in White `#FFFFFF`)
3. `#00FAFF` Intense Cyan
4. `#EAFF00` Laser Lemon
5. `#FF61D3` Piercing Pitaya
6. `#8500FF` Electric Eggplant
7. `#D8D7DF` Gray-800
8. `#FF8500` Neon Carrot

The contrast rule is about text. Groovy Green and Laser Lemon are fine as chart *fills* on white; Figma's light chart slides use them.

A control, baseline or benchmark series gets no muted grey: it takes its place in this order like any other series, so a two-series chart is Groovy Green and Midnight (Cameron, 2026-10-20).

Never use gradients in chart fills. Solid colors only. Charts are native shapes by default; see SKILL.md "Charts".

### Forbidden

- Black `#000000` for text — always use Midnight `#17132F`
- Soleil font — deprecated, use Figtree everywhere
- Arial, Helvetica, Calibri — always Figtree
- Any green outside `#009A50`, `#00CC6A` or `#00FF85`. `#009950` (Figma's Green-300 variable, used in v2.1) is wrong. `#00CC6A` is never text or an icon.
- Laser Lemon text on white backgrounds (contrast failure)
- Groovy Green text on white/light backgrounds (contrast failure)
- Zero-padded numbers (01, 02, 03…) anywhere: agendas, steps, timelines, section labels, badges, callouts. Write 1, 2, 3.
- Unicode symbols or emoji standing in for icons. Use the bundled icons.

## Typography

**Font family:** Figtree (bundled at `assets/brand/fonts/`). `scripts/install-fonts.sh` installs it for the QA render. pptxgenjs can't embed fonts, so the recipient needs Figtree installed, or opens the deck in Google Slides (see SKILL.md "What to tell the user").

**Available weights:**

| Weight | File | pptxgenjs mapping |
|---|---|---|
| Regular (400) | `Figtree-Regular.ttf` | `FONT` — default body, no bold flag |
| Medium (500) | `Figtree-Medium.ttf` | `FONT_MEDIUM` ("Figtree Medium") — subheads, card body |
| SemiBold (600) | `Figtree-SemiBold.ttf` | `FONT_SEMI` ("Figtree SemiBold") — card headers, table headers, chart labels |
| Bold (700) | `Figtree-Bold.ttf` | `FONT` + `bold: true` — headings, stats |
| ExtraBold (800) | `Figtree-ExtraBold.ttf` | `FONT_EXTRA` ("Figtree ExtraBold") — number badges (rare) |

**Note on pptxgenjs:** pptxgenjs only supports regular and bold (`bold: true`). Medium, SemiBold and ExtraBold are separate font faces named in full (`fontFace: "Figtree SemiBold"`). Google Slides shows them correctly; Keynote substitutes Helvetica for Medium.

**Case:** slide titles are sentence case ("Presentation title goes here"), as on the Figma slides. Section labels are ALL CAPS.

### Type scale

Figma uses pixels on a 1920×1080 canvas. PowerPoint uses points on a 13.33"×7.5" canvas: **Figma px ÷ 2 = pt**, and **Figma px ÷ 144 = inches**.

| Context | Figma (px) | PowerPoint (pt) | Weight | Notes |
|---|---|---|---|---|
| Hero / cover title | 100 | 50 | Bold | Line height 55 pt |
| Slide H1 | 64.5 | 32 | Bold | |
| H2 / subhead | 40 | 20 | Medium or Regular | |
| Big number | 160 | 80 | Bold | Big number recipe |
| Stat callout number | 80–100 | 40–50 | Bold | |
| Section label (ALL CAPS) | 20–24 | 11–12 | Bold, tracked | Accent-coloured |
| Body large | 30–34 | 15–17 | Regular or Medium | Line height 1.15 |
| Body default | 24–26 | 12–13 | Regular or Medium | Line height 1.15 |
| Caption / sub | 19–24 | 9.5–12 | Regular | |
| Footer text | 15 | 7.5 | Regular | `addFooterText()`; baked into `Footer.png` on the bar |

## Layout defaults

- **Aspect ratio:** `LAYOUT_WIDE` (13.33" × 7.5") — always
- **Margins:** 0.69" from the left and right edges, about 0.65" from the top, 0.35" minimum clear above the footer bar
- **Spacing inside a card or panel:** equal space above and below the content (Figma's 50 px, 0.35", on the dark side panel); repeated items evenly spaced, with dividers centred in the gaps; no empty band at one end. When a box grows (a longer subhead above it, a denser layout), spread the items rather than leaving the space at the bottom. `scripts/check-spacing.js` checks this on a built deck.
- **Footer bar:** `addFooter(slide, { bar })`, every slide except title and closing slides. Bar 1 (default): `Footer.png` (Figma Footer Bar 1, 1920×108 at 2x) at `y: 6.75, h: 0.75, w: 13.33`. Bar 2: Bar 1 plus the slide number, bottom right. Bar 3: `footer-bar-3.png` (92 px bar, 0.64" tall) plus the confidentiality line in Bold, on tables, timelines B–D, Before / after A, Team and Org chart. Each recipe names its bar.
- **Footer by audience:** `newPresentation({ audience })` sets it for the whole deck. `"internal"`: every footer carries "Confidential and proprietary. Do not distribute." `"external"` (customers, prospects, partners): the same footers without it. Bars 1 and 2 use `footer-bar-1-external.png`, Bar 3 drops its native line, and the text-only footer draws nothing. Figma: "Footers External (no line)" (`120:911`), under the originals in Assets.
- **Text-only footer:** title and closing slides, `addFooterText()`: the confidentiality line, centred, 7.5 pt, at y 7.06" (internal decks only)
- **Large logo:** title and closing slides only, `addLogo()`: 3.02" wide at `x: 0.674, y: 1.319` (dark title, closings) or `y: 0.882` (light title, client-logo title)
- **Safe areas:** `SAFE.glow` (x 0.69–5.8") on the glow backgrounds; `SAFE.content` (x 0.69–12.64", y 0.6–6.4") on plain backgrounds
- **Page numbers:** off by default. Footer Bar 2 shows one (white, bottom right), as in Figma: Card grid F, Stat card + image, Section divider C.

## Logo placement (DECISIONS §6)

- **Title and closing slides:** the large logo plus the text-only footer. Figma's exceptions, kept in the recipes: Title / cover (light) A has the logo centred in a Midnight header bar; Closing (with contact) A has no large logo and uses Footer Bar 1; Closing B uses the all-Midnight logo (`logo-dark-mono.png`, `addLogo(s, false, { mono: true })`) on the full gradient.
- **Every other slide:** the footer bar with its small logo.
- **Never two logos on one slide.** One Figma exception: Before / after B labels its "after" card with a small Ordergroove logo.
- `logo-dark.png` is the white-ink logo for **dark** backgrounds; `logo-white.png` is the dark-ink logo for **light** backgrounds. `addLogo(slide, isDark)` picks the right one.

## Cards and shapes (DECISIONS §4)

- **Native shapes** for cards, pills, dividers, tables, number circles and row shading. They stay editable and crisp. `addCard()` draws a rounded card; `addCard(..., { squareTR: true })` draws the brand card shape (three rounded corners, top-right square) as custom geometry. `addPill()` draws a pill with its label.
- **Images** for gradients, glows, logos, icons and photos, because pptxgenjs can't draw gradient fills. Each gradient image is placed at its own aspect ratio; never stretch one.
- Gradient cards and outlines that carry a drop shadow (`statCardGradient1`, `gradientOutlineCard1`–`3`) are placed with `addGradientShape(slide, key, x, y, w, h)`: x, y, w, h are the shape's own box, and the shadow falls outside it, as in Figma.
- Card shadows on native shapes: `figmaShadow(blurPx, offsetYPx, opacity)` converts a Figma drop shadow.
- The v2.1 **gradient callout cards** (`gradient-callout-N.png`: a white card with a gradient shadow) are no longer used by any recipe: Testimonial with gradient cards is rebuilt from Figma with native cards. `addGradientCard()` is kept so older build scripts still run.

### Gradient callout variants

| Asset | Shadow colours | Use |
|---|---|---|
| `gradient-callout-1.png` | Yellow → orange | First card in a row |
| `gradient-callout-2.png` | Green → cyan | Second card |
| `gradient-callout-3.png` | Purple → blue → green | Third card |
| `gradient-callout-4.png` | Same file as 2 | Fourth card / alternate |

### Callout vs. testimonial

- **Testimonial / customer quote:** the gradient quote mark (`ASSETS.quotationMark`, Quotation Mark 1) on the quote card, plus the attribution. Reserves the quote visual for real customer voices. The v2.1 `quotation.png` / `addQuoteIcon()` is unused.
- **Key insight / strategic callout:** a Midnight card with a Groovy Green left accent bar + "KEY INSIGHT" section label. No quote icon.

## Icons

- 213 Material Symbols Rounded icons in `assets/icons/<name>.svg`, from the Figma Icon Library (`18:782`), 13 categories. Index with keywords: `references/icon-index.md` (machine-readable: `assets/icons/index.json`).
- `addIcon(slide, name, x, y, size, color)` recolours the SVG and embeds it as a PNG rendered at build time (needs `@resvg/resvg-js`; Keynote shows embedded SVGs as broken images).
- `addIconTile(slide, name, x, y, { tint, color, solid })`: the Figma icon tile, a 0.53" circle in the tint at 12% opacity (Tinted) or filled (`solid: true`, Midnight glyph), with the glyph centred.
- **Tile colour by section (Cameron, 2026-10-20):** the n-th section with icons on a slide takes colour n. `addSectionTile(slide, name, x, y, { section, isDark })` picks the colour and style; `tileColor(section, isDark)` returns the hex.

  | Section | Light background: Tinted tile, glyph in the colour (Icon Tile `27:846`) | Dark background: Solid tile, Midnight glyph (Icon Tile Dark `32:857`) |
  |---|---|---|
  | 1 (and a slide with one section) | Brand Green `#009A50` | Groovy Green `#00FF85` |
  | 2 | Flamingo Pink `#FF61D3` | Flamingo Pink `#FF61D3` |
  | 3 | Tile Teal (Cyan-400) `#00BEC0` | Intense Cyan `#00FAFF` |
  | 4 | Midnight `#17132F` | Neon Carrot `#FF8500` |

  A section is a labelled group of items or a separate block; a dark side panel comes after the main block. Only the tile changes colour: labels, numbers and text keep the green rule (pink and teal text fails contrast on white). Icon columns treats each column as a section (green, pink) and Card grid D each card (green, pink, teal); both Figma frames (`1:324`, `1:427`) use Icon Tile instances since 2026-10-20, so the rule has no exceptions.
- **Photo accents (Cameron, 2026-10-20):** an optional colour around people's photos, `const ACCENT` in Team and Org chart. `PHOTO_ACCENTS` / `photoAccent(name)` / `addPhotoRing()` in build.js. Closing (with contact) A has no accent (Cameron, 2026-10-20).

  | `ACCENT` | Colour | Team (round headshots) | Org chart |
  |---|---|---|---|
  | `null` (default) | Figma's | A gradient ring, B Gray-950 ring | Gray-950 `#F5F5F8` offset tile |
  | `"cyan"` | Intense Cyan `#00FAFF` | 11 px ring over the photo's edge | Offset tile, full solid |
  | `"pink"` | Flamingo Pink `#FF61D3` | 11 px ring | Offset tile, full solid |
  | `"green"` | Groovy Green `#00FF85` | 11 px ring | Offset tile, full solid |

  Never a colour behind a round headshot, and no tints (Cameron turned both down: most headshots keep their own background). One accent per deck. No text sits on these shapes.
- **Contrast:** on white, the pink and teal Tinted tiles are 2.4:1 and 2.1:1 (green 3.2:1), below the usual 3:1 for icons. That's accepted because the card title next to each icon carries the meaning. Every Solid tile on dark passes (5.7:1 or more). Details: `audit/third-pass/icon-colour/ICON-COLOUR-OPTIONS.md`.

## Asset inventory

All paths are relative to the skill root. Brand images are 2x renders of the Figma Assets frame (`1:2594`), exported 2026-10-19 (first pass) and 2026-10-20 (second pass).

| Asset | `ASSETS` key | Use |
|---|---|---|
| `assets/brand/bg-glow-dark.png` | `bgGlowDark` | Title / cover (dark), Closing (simple): Midnight + green/cyan glow (Figma `58:821` background) |
| `assets/brand/bg-glow-light.png` | `bgGlowLight` | Title / cover (light) B: white + glow on the right (Background Glow Light 1, `10:709`) |
| `assets/brand/bg-glow-light-2.png` | `bgGlowLight2` | Closing (with contact) C: white + glow along the bottom (Background Glow Light 2, `10:711`) |
| `assets/brand/bg-gradient-1.png` | `bgGradient1` | Title / cover (light) A, Section divider A, Closing (with contact) B: full-bleed Intense Cyan → Laser Lemon (Background Gradient 1, `10:708`) |
| `assets/brand/background-logo-wall-dark-2.png` | `bgLogoWallDark` | Card grid F only: 62 customer logos, white at 40% on Midnight (`81:911`) |
| `assets/brand/Footer.png` | `footer` | Footer Bar 1 and 2 (`10:854`), every non-title slide that doesn't use Bar 3 |
| `assets/brand/footer-bar-1-external.png` | `footerExternal` | Footer Bar 1 External (`120:912`): bar + logo, no confidentiality line; Bars 1 and 2 on external decks |
| `assets/brand/footer-bar-3.png` | `footerBar3` | Footer Bar 3: 92 px bar + logo, no text (from Org chart `1:1457`); `addFooter(s, { bar: 3 })` adds the line |
| `assets/brand/logo-dark.png` (+ `.svg`) | `logoDark` | Large logo for **dark** backgrounds, white ink (Logo White 1, `10:788`) |
| `assets/brand/logo-white.png` (+ `.svg`) | `logoWhite` | Large logo for **light** backgrounds, dark ink (Logo Dark 1, `10:774`) |
| `assets/brand/logo-dark-mono.png` (+ `.svg`) | `logoDarkMono` | All-Midnight logo for the full gradient: Closing (with contact) B (Logo Dark Mono 1, `10:802`) |
| `assets/brand/gradient-accent-1.png` | `gradientAccent1` | Title with client logo + image B, Content B: cyan → lemon block, 841×729 px, flush right (`1:2595`) |
| `assets/brand/gradient-accent-2.png` | `gradientAccent2` | Title with client logo + image C, Section divider B: the 1211 px block, cropped to the 841 px that show (`10:719`) |
| `assets/brand/gradient-accent-3.png` | `gradientAccent3` | Closing (with contact) A: 960×729 px, flush left, rounded right (`1:2600`) |
| `assets/brand/large-card-gradient-1.png` | `largeCardGradient` | Big number A, Two-column B (`10:720`) |
| `assets/brand/stat-card-gradient-1.png` | `statCardGradient1` | Two-column A stat card, with shadow (`10:721`); `addGradientShape` |
| `assets/brand/stat-card-gradient-2.png` | `statCardGradient2` | Stat card + image: the stat card (`10:722`) |
| `assets/brand/content-panel-gradient-1.png` | `contentPanelGradient` | Content A panel, gradient at 10% (`10:723`) |
| `assets/brand/gradient-highlight-1.png` | `gradientHighlight` | Three-stat callout bar under each figure (`10:724`) |
| `assets/brand/gradient-outline-card-1.png` … `-3.png` | `gradientOutlineCard1` … `3` | White cards with a gradient outline and shadow: Before / after A row, Two-column C reasons, Before / after B "after" card (`10:725`–`10:727`); `addGradientShape` |
| `assets/brand/gradient-outline-card-4.png` | `gradientOutlineCard4` | Process timeline C title boxes, Gray-975 fill (`10:728`) |
| `assets/brand/number-circle-gradient-1.png` | `numberCircleGradient` | Process timeline A step circles (`10:908`) |
| `assets/brand/avatar-initials-gradient-1.png` | `avatarInitialsGradient` | Testimonial A initials disc (`10:915`, without its text) |
| `assets/brand/quotation-mark-1.png` | `quotationMark` | Testimonial quote mark, green → teal at 80% (`10:933`) |
| `assets/brand/avatar-frame-gradient-1.png` | `avatarFrameGradient` | Team A headshot ring (`10:935`) |
| `assets/brand/number-badge-gradient-1.png` | `numberBadgeGradient` | Card grid F number badges, disc only (`76:917`) |
| `assets/brand/table-highlight-row-1.png` | `tableHighlightRow1` | Table A highlighted row, with shadow (`76:919`) |
| `assets/brand/table-highlight-row-2.png` | `tableHighlightRow2` | Table B highlighted row, with shadow (`76:920`) |
| `assets/brand/gradient-callout-1.png` … `-4.png` | `gradientCard1` … `4` | v2.1 testimonial cards; no 2.0 recipe uses them |
| `assets/brand/quotation.png` | `quotation` | v2.1 quote icon; no 2.0 recipe uses it |
| `assets/brand/logo-box.png` | `logoBox` | v2.1 client-logo frame; no 2.0 recipe uses it |
| `assets/brand/testimonial-bg-dark.png`, `testimonial-bg-light.png` | `testimonialDark`, `testimonialLight` | v2.1 backgrounds; no recipe uses them |
| `assets/brand/fonts/Figtree-*.ttf` | `fontRegular` … `fontExtraBold` | The five Figtree weights |
| `assets/logos/<slug>.png` | `customerLogo(slug)` | Customer logos from the Figma Logo Archive (`40:842`), tight-cropped, original colours: `olly`, `loreal`, `petsmart`, `dollar-shave-club`, `pg`, `keurig`, `gnc`, `nestle` (SVG too, except `dollar-shave-club` and `nestle`, which are raster in Figma). Plus `dollar-shave-club-midnight` (+ SVG), the Midnight version from Assets (`10:835`) used by Two-column with quote card |
| `assets/icons/<name>.svg` | `ICON_DIR` | 213 Material Symbols Rounded icons; see `references/icon-index.md` |

**Retired in 2.0:** `bg-divider.png` and `bg-content.png`, the overlapping-circle backgrounds (Cameron, 2026-10-19). Copies are in the skill's audit folder, not in the package.
