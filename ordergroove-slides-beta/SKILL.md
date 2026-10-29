---
name: ordergroove-slides-beta
description: BETA test build of Slide Skill 2.0, for side-by-side testing with the org v1 skill. Create on-brand Ordergroove presentations (PowerPoint .pptx that also opens in Google Slides). Use this skill whenever anyone asks for slides, decks, presentations, .pptx files, pitch decks, board decks, sales decks, QBRs, section dividers, agendas, or anything that will end up in PowerPoint or Google Slides. Also use when someone says "make me some slides about X," "build a deck on Y," "put this into a presentation," "create a slide for Z," or asks to update or extend an existing Ordergroove deck. This skill covers everything visual — colors, typography, layouts, backgrounds, logos, icons, charts, footer — so teammates never have to think about brand compliance. Trigger liberally; this skill should win over the generic pptx skill whenever the user is at Ordergroove or the content is Ordergroove-related. Even if the user doesn't mention Ordergroove by name, if the context suggests they work there, use this skill.
---

# Ordergroove Slides (v2.0 beta)

You are creating an Ordergroove presentation. Every slide must follow the brand rules below; there is no "opt out." If a user asks for something off-brand (e.g. "make it red"), push back briefly, explain the rule, and offer an on-brand alternative.

The design source is the Figma file "Slide Skill 2.0". The recipes, assets and colours in this skill were built from it.

## Workflow

1. **Read** `references/brand-constants.md`: palette, the green contrast rule, typography, layout and asset rules.
2. **Read** `references/layout-recipes.md` and pick a recipe for every slide. There are 28, listed below. Adapt the closest recipe; don't invent layouts (one exception when rebuilding a deck, below).
3. **Pick icons** from `references/icon-index.md` when a recipe has icon tiles (Icon columns, Card grid D). Match the slide's content to the keywords.
4. **Set up** (first run only):
   - Check the packages: `node -e "require('pptxgenjs'); require('@resvg/resvg-js')"`. If that fails, run `npm install` in the skill folder. If the skill folder is read-only, run `npm install --prefix <work-dir> pptxgenjs@3.12.0 @resvg/resvg-js@2.6.2` and run your build with `NODE_PATH=<work-dir>/node_modules`.
   - Run `bash scripts/install-fonts.sh`. This installs Figtree for the QA render only; it does not put the font in the user's PowerPoint.
5. **Build the deck** with a script that requires `scripts/build.js` (brand constants, asset paths, helpers) and pastes the recipes. Start it with `newPresentation({ title, audience })`, where audience is `"internal"` or `"external"` ([Footer by audience](#non-negotiables)). Edit the recipe content; don't rewrite the scaffolding. Each recipe adds one slide.
6. **QA visually** before you hand it off. See [QA](#qa-required).
7. **Save** the .pptx as `OG-<topic>-<YYYY-MM-DD>.pptx` in the folder the user chose. In claude.ai, that is `/mnt/user-data/outputs/`.
8. **Hand off** with the lines in [What to tell the user](#what-to-tell-the-user).

If the user gives you an existing deck to put on brand, follow [Rebuilding an existing deck](#rebuilding-an-existing-deck) too.

## Rebuilding an existing deck

When the user hands you a deck (theirs, a customer's, an old Ordergroove one) and asks for it on brand, rebuild it from the recipes. Don't restyle the old file.

1. **Extract.** Unzip the .pptx into a work folder (or use python-pptx). Pull each slide's text in reading order, copy the images out of `ppt/media/`, and render the source with the [QA](#qa-required) commands so you can see every slide.
2. **Inventory.** List each source slide's blocks: title, body, stats, chart data, table, logos, images, quotes. This list is your check that all the content made it.
3. **One source slide in, one slide out, in the same order.** Pick the recipe that holds the slide's content. A slide with a main block and a dark panel beside it (a chart + questions, a timeline + asks, features + metrics, terms + a quote) is Content + dark side panel (recipe 28). Never split a slide into several, and never move content between slides.
4. **If no single recipe holds a slide's content,** build that one slide from the skill's parts (recipe blocks, `addCard`, logo cards, `addStatStrip`, `sectionLabel()`, the footer), following the source slide's own arrangement. Measure the user's text with `textWidth` / `wrapLines` / `fitFontSize` so it fits the box you give it. For example, a slide with two 3 × 3 logo grids, each with a subhead, plus a 4-stat strip stays one slide. This is the one exception to "don't invent layouts". Ask the user before splitting a slide, and only if its content truly can't fit at the smallest sizes in the type scale (`brand-constants.md`).
5. **Reuse the source's images** (customer logos, product shots, mock-ups) as files the user supplied: pass `path:`, with `fit: "contain"` for a cut-out. Prefer a bundled `customerLogo()` over a small copy from the deck.
6. **Rule breaks baked into images.** Text inside an image follows the same rules as slide text. Crop off a zero-padded label, an off-brand colour or an old logo and redraw it natively (a "1 · Scan" pill, say). If it can't be cropped cleanly, keep the image and flag it.
7. **Keep customer files local.** The source deck and everything extracted from it stay in the work folder: don't upload them, don't send them to web tools, and don't copy them into the skill folder.
8. **QA the text too.** Diff all slide text against the source. The only differences allowed are the formatting changes in "Content is the user's" ([Non-negotiables](#non-negotiables)).

At hand-off, add these to the usual lines:

- **Content issues:** list only what you flagged (two numbers that disagree, a typo). There is no "new wording" list, because you added none.
- **Assets:** every image you recoloured, cropped or redrew, and every one under about 300 px per inch on the slide (a logo shown 1.5 in wide needs about 450 px), which may look soft on a big screen. Ask for the official files.

## Non-negotiables

These rules are the difference between a slide that looks on-brand and one that doesn't.

- **Content is the user's.** When the user gives you content (an existing deck, a doc, notes, pasted text), use their text, numbers, names and punctuation exactly as given. Don't reword, shorten, summarise, merge, add, correct or "tidy" it. The skill does layout and brand, not copy.
  - If you think the content could use work, don't change it. Ask: "Do you want help drafting content?" Change it only if they say yes.
  - If the user gives no text ("make me some slides about X"), write the copy. The formatting rules below still apply.
  - Only these formatting changes are allowed:
    - slide titles in sentence case (product and proper names keep their capitals)
    - section labels in ALL CAPS via `sectionLabel()`
    - zero-padded numbers written plainly (01 → 1)

    Everything else keeps its case and punctuation, including table row labels ("Base Case") and milestone names.
  - A recipe slot the content doesn't fill (title, subhead, label, caption, row label): leave it out, or use a variant without it. Never write words to fill it.
  - Keep a caption or attribution as given: "CEO, $2B+ retailer" stays one line; don't split it into name + role.
  - If the content looks wrong (two numbers disagree, a typo), keep it and flag it in the hand-off.
  - Use only the file the user gave you; don't pull text from other versions.
- **Font:** Figtree only (Regular, Medium, SemiBold, Bold, ExtraBold). Never Arial, Helvetica, Calibri or Soleil. Soleil is deprecated.
- **Palette:** only the hex values in `brand-constants.md`. No black text (`#000000`); use Midnight (`#17132F`).
- **Text on Midnight is White:** titles, subtitles, body, captions and attributions on any dark fill are White, never a light gray (Gray-900, Gray-700). The only exception is an accent in Groovy Green.
- **Contrast rule:** Green `#009A50` is the accent on light backgrounds; Groovy Green `#00FF85` on dark. Use `accentColor(isDark)`. Strict for text and icons: every green label, numeral, bullet or icon glyph follows it, judged by what it sits on (a white card on a dark slide is light). Never Green-400 `#00CC6A` for text or icons. Fills keep their Figma colours: chart bars, pills, card outlines, timeline dots, tile tints, gradients and the logo.
- **Logo (one per slide):** title and closing slides get the large logo (`addLogo`) plus the text-only footer (`addFooterText`). Every other slide gets the footer bar (`addFooter`), which carries the small logo. Never two logos on one slide. The recipes follow Figma's exceptions: Title / cover (light) A puts the logo in a header bar, and Closing (with contact) A uses the footer bar instead of the large logo.
- **Footer:** every slide has one, the bar or the text-only line. Use the bar the recipe names: `addFooter(s)` is Footer Bar 1; `{ bar: 2 }` adds the slide number; `{ bar: 3 }` is the slimmer bar on tables, timelines, Team and Org chart.
- **Footer by audience:** internal decks keep "Confidential and proprietary. Do not distribute."; external decks get the same footer without that line. Set it once per deck, `newPresentation({ audience: "internal" | "external" })`, and every `addFooter` / `addFooterText` follows it.
  - Infer the audience from the request. A deck for a customer, prospect or partner (a pitch, proposal, QBR, case study, or a rebuild of a deck made for one) is `"external"`. A deck for Ordergroove people only (all-hands, board, team update, enablement, planning) is `"internal"`.
  - Ask only when you can't tell: "Is this deck for people outside Ordergroove (a customer, prospect or partner), or internal only? Internal decks keep the 'Confidential and proprietary' line in the footer."
- **Backgrounds:** use the one the recipe names. `ASSETS.bgGlowDark` / `bgGlowLight` (glow on the right: keep text inside `SAFE.glow`, left of 5.8 in), `bgGlowLight2` (glow along the bottom, centred text) and `bgGradient1` (full Intense Cyan → Laser Lemon, Midnight text). Everything else is a plain fill from the recipe (White, Gray-975 or Midnight). Never draw your own gradients or circles to imitate the brand look.
- **Numbers:** plain numerals, 1, 2, 3. Never zero-padded (01, 02, 03): not in agendas, steps, timelines, section labels, badges or callouts. Big stat numbers are fine; the rule is about how numbers are written.
- **Slide titles:** sentence case ("Presentation title goes here"), as in Figma.
- **Section labels:** ALL CAPS, Bold, tracked (`sectionLabel()`), accent-coloured. Above a title, place it as in "Section label above a title" at the top of `layout-recipes.md`.
- **Cards, pills, dividers, tables:** native shapes (`addCard`, `addPill`, `addTable`), so they stay editable. The brand card shape (top-right corner square) is `addCard(..., { squareTR: true })`. Gradient elements (accent blocks, gradient cards and outlines, number circles) are images from `ASSETS`, placed at their own aspect ratio; `addGradientShape()` places the ones with a baked-in shadow.
- **Icons:** Material Symbols Rounded from `assets/icons/`, placed with `addIcon()` or `addIconTile()`, names from `references/icon-index.md`. Never unicode symbols or emoji as stand-ins.
- **Icon tile colours by section:** colour marks a section, not an item. The 1st section with icons on a slide is green, the 2nd pink, the 3rd teal, the 4th Midnight. A section is a labelled group of items ("Platform", "Hands-on services") or a separate block, such as a dark side panel, which comes after the main block. Use `addSectionTile(s, icon, x, y, { section, isDark })`.
  - On light backgrounds the tiles are Figma's Tinted tiles; on dark backgrounds, its Solid tiles with a Midnight glyph (Groovy Green, pink, Intense Cyan, Neon Carrot). Judge light or dark by what the tile sits on.
  - One section: every icon is green. Icon columns treats each column as a section (green, pink), and Card grid D each card (green, pink, teal).
  - Only the tile changes colour. Section labels, numbers and text keep the green rule.
  - Keep a section's colour across the deck: if "Platform" is green on one slide, it's green wherever it appears.
- **Photo accents:** Team and Org chart can take one brand colour around people's photos: `const ACCENT = "cyan" | "pink" | "green"` (Intense Cyan, Flamingo Pink, Groovy Green). `null` is the default and keeps Figma's look.
  - Team gets a coloured ring only, never a colour behind the photo: most headshots keep their own background. Org chart's offset tile takes the colour in full.
  - Use one only when the user asks for colour around the photos. Use the same accent on every people slide in the deck.
  - No other recipe takes an accent: Closing (with contact) A, Big number, Card grid and the other headshot slides keep their colours.
- **Customer logos:** use `customerLogo("<slug>")` for the 9 bundled logos (`olly`, `loreal`, `petsmart`, `dollar-shave-club` (orange), `dollar-shave-club-midnight`, `pg`, `keurig`, `gnc`, `nestle`) or a file the user gives you. Never draw or invent a logo; leave the placeholder.
- **Customer logo that doesn't suit the white logo card** (the only file is a white wordmark, say): recolour the whole logo Midnight `#17132F`, keeping its transparency, and save the copy in the work folder, never in `assets/logos/`. Flag it at hand-off and offer to swap in a full-colour logo: "The <customer> logo I had is white, so I made an all-Midnight version for the white logo card. If you have their full-colour logo, upload it and I'll swap it in."
- **Photos and product shots:** not bundled. The recipes draw a placeholder; pass `path:` when the user supplies a file, plus `fit: "contain"` for a cut-out so it isn't cropped.
- **Quote marks:** only where the recipe places one (the gradient quote mark on Testimonial cards). Don't add quote icons to other slides.
- **Line spacing:** body copy 1.15, headlines 1.1 (or the exact `lineSpacing` the recipe sets).
- **Aspect ratio:** always `LAYOUT_WIDE` (13.33 × 7.5 in).

## Charts: which build to use

Google Slides comes first, then PowerPoint. Google Slides turns PowerPoint charts into fixed, low-resolution pictures with Google's font on the axes, and Keynote doesn't show them at all (tested 2026-10-19).

1. **Default: draw charts as native shapes.** Chart (bar) uses `drawBarChart`, Chart (line) `drawLineChart`, Chart (pie / donut) arc shapes. They look the same in Google Slides, PowerPoint and Keynote.
2. **Use a native PowerPoint chart (`POWERPOINT = true` in the recipe) only when the user explicitly says the deck is for PowerPoint.** "Make me a deck" is not a PowerPoint request. "I'll present this in PowerPoint and want to edit the numbers there" is. The donut has no PowerPoint build.
3. **Don't ask which app just to choose a chart.** Use the default unless the user has said otherwise.
4. Series colours follow `C.chart` in order; N series use the first N. Solid fills only.

## Available layouts

All 28 recipes are in `layout-recipes.md`. Pick the one that matches the content; ask only if it's genuinely ambiguous. Letters are variants (`const VARIANT = "A"`).

**Title slides**
1. Title / cover (dark): glow background, large logo, 2-line title
2. Title / cover (light): A full gradient + header bar, B white glow
3. Title with client logo + image: co-branded; A Midnight + image panel, B white, C Midnight

**Structure**
4. Section divider: A full gradient, B white + product shot, C full-bleed photo statement
5. Agenda: A number pills (up to 10, 2 columns), B bullets (up to 5)

**Content**
6. Content: heading + bullets: A lead + content panel, B bullets + product shot
7. Two-column with quote card: customer quote + proof; A stat card, B logo card + headshot, C three reasons
8. Stat card + image: dark, headline + gradient stat card + large image
9. Icon columns: two columns, each with an icon tile, subheader and body
10. Card grid: 3 across (A logos, D icons on dark, E dark cards + image, F numbered on the logo wall) or 4 × 2 (B light, C dark)
28. Content + dark side panel: a main block on the left (milestones, cards in labelled groups, option cards + rows, or a bar chart) and a Midnight panel on the right; A label + numbered list, C quote, and label + 1–4 metrics in four styles: B figure first (default), D ledger, E stat cards, F hero card

**Data**
11. Three-stat callout: three or four cards with big figures on a highlight sized to each figure
12. Numbered columns: three numbered columns with subheaders, light
13. Big number: one huge figure + quote; A gradient card, B Midnight card
14. Chart (bar): column chart, shapes by default
15. Chart (line): line chart, shapes by default
16. Chart (pie / donut): A labels + legend, B centre stat
17. Table: A up to 4 rows, B 5–6 rows, one highlighted row; number columns right-aligned, spanning cells, optional assumptions strip and footnote
18. Before / after comparison: A check / cross lists, B two cards
19. Process timeline: A numbered steps, B / D milestones on an arrow (`NAMES = "heading"` keeps the user's milestone names; current-step ring), C titled periods
20. Roadmap: Gantt by month

**Customers and people**
21. Testimonial with gradient cards: one or two quote cards; A light + initials, B dark + logos; `attribution:` for an anonymous speaker
22. Case study one-pager
23. Logo grid: 1–12 customer logos, or two labelled groups of up to 9, with an optional stat strip
24. Team: three people; A dark, B light; optional accent ring (`ACCENT`)
25. Org chart: up to 10 people; optional accent tile (`ACCENT`)

**Closing**
26. Closing / thank you (simple): optional note and customer quote
27. Closing / thank you (with contact): A gradient panel + headshot, B full gradient, C white glow

`layout-recipes.md` starts with a coverage table: every Figma slide frame, with its recipe and variant letter.

If a user needs a layout not on this list, adapt the closest one; don't freestyle.

## QA (required)

Every deck must pass a spacing check and a visual check before you hand it off.

```bash
node scripts/check-spacing.js output.pptx
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

`check-spacing.js` measures every card and panel against its content and lists what's off: content bunched at one end (EMPTY BOTTOM / TOP), content touching or running past an edge (TIGHT / OVERFLOW), and text within 0.35 in of the footer bar (FOOTER). Look at each flagged slide in the render and fix it, or confirm it's the recipe's Figma design. On the sample recipes, the Case study's stat band and Team B's role lines (0.29 in above Footer Bar 3) are Figma's own spacing.

Then view every `slide-*.jpg` and check for:

- Text overflowing its box (especially big stats and 3-line titles)
- Text running into the background glow (title, divider and closing slides: keep it inside `SAFE.glow`)
- Elements overlapping, or content within 0.35 in of the footer bar
- Spacing inside cards and panels: the space above the content matches the space below, repeated items (list rows, metrics, cards) are evenly spaced, and dividers sit centred between items. No empty band at the bottom of a card or panel; spread the items or shorten the box instead.
- Accent colour wrong for the background (Groovy Green text on white = bug)
- Two logos on one slide, or a slide with no footer
- Zero-padded numbers (01, 02)
- Leftover placeholder text ("[Brand X]", "[Your Name]") or placeholder boxes the user should fill
- Icons missing or shown as broken images

If you find an issue, fix it and re-render. Don't declare done after the first pass. LibreOffice draws Figtree Medium and SemiBold close to Regular on some machines; judge weights in Google Slides or PowerPoint, not in the QA render.

## What to tell the user

At hand-off, tell the user in a line or two:

- **Footer, always:** say which footer the deck has and why, in one line. External: "This deck is for <customer>, so the footer leaves out the 'Confidential and proprietary' line. Tell me if it's internal only." Internal: "This is an internal deck, so every footer says 'Confidential and proprietary. Do not distribute.'"
- **Fonts, always:** "The deck uses Figtree. If it looks wrong in PowerPoint, install Figtree (free from Google Fonts), or open the deck in Google Slides, which has it built in."
- **Google Slides, always:** "For Google Slides, open the .pptx itself: upload it to Drive and choose Open with › Google Slides, or in Slides use File › Open › Upload. Don't use File › Import slides into an existing deck: a standard Google Slides deck is 10 in wide, so everything shrinks to 75% and each font size rounds to a whole point (18 pt becomes 14), which moves line breaks."
- **Charts, if the deck has one (shapes, the default):** "The chart is drawn with shapes so it looks right in Google Slides, PowerPoint and Keynote. To change the numbers, ask me and I'll rebuild the slide. If you'll present in PowerPoint and want to edit the data there, say so and I'll make it a native PowerPoint chart instead."
- **Charts, PowerPoint build:** "This is a native PowerPoint chart: right-click › Edit Data in PowerPoint to change the numbers. If the deck is opened in Google Slides it becomes a fixed picture, and Keynote won't show it."
- **If the user asks to edit a shape chart by hand:** moving dots or bars won't move the axis or labels; offer to rebuild the slide with the new numbers.
- **Placeholders, if any are left:** name the slides with logo, photo or product-shot placeholders and say what file each needs.

## Common pushbacks

When a user asks for something off-brand:

- **"Can we use a different font?"** → "Ordergroove's brand is Figtree. A different font makes the deck feel disconnected from other OG materials. I can adjust weight or size for more visual interest."
- **"Make the background blue/red/orange."** → "Those aren't in the brand palette, but I can use the dark glow, Midnight, or the gradient cards to create contrast."
- **"Just put the logo on every slide."** → "Every slide already carries the logo: the footer bar on content slides, the large logo on title and closing slides. Adding another would put two logos on one slide."
- **"Use Soleil for the title."** → "Soleil is deprecated. Figtree Bold or ExtraBold gives a similar impact."
- **"Number them 01, 02, 03."** → "Ordergroove writes numbers plainly: 1, 2, 3."
