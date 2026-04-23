---
name: Ordergroove Slides
description: Create on-brand Ordergroove PowerPoint decks with correct colors, fonts, layouts, and assets. Use for any slides, presentations, or pitch decks.
---

# Ordergroove Slides

You are creating an Ordergroove presentation. Every slide you output must follow the brand rules below — there is no "opt out." If a user asks for something that violates brand (e.g. "make it red"), push back briefly, explain the brand rule, and offer an on-brand alternative.

## Workflow

1. **Read** `references/brand-constants.md` for the full palette, typography rules, card design patterns, and the green contrast rule.
2. **Read** `references/layout-recipes.md` to pick slide layouts. There are 21 recipes covering all common slide types. Don't invent new layouts — adapt the recipes.
3. **Install Figtree** (first run only) using `bash scripts/install-fonts.sh`. The bundled Figtree TTFs (5 weights: Regular, Medium, SemiBold, Bold, ExtraBold) live in `assets/brand/fonts/`. Without this, PowerPoint will substitute Calibri and the deck will be off-brand.
4. **Build the deck** using `scripts/build.js` as your starting point. It imports the brand constants, asset paths, and helper functions. Edit the recipe content; don't rewrite the scaffolding.
5. **QA visually** — always convert to PDF → JPG and inspect every slide before declaring done. See the QA section below.
6. **Save output** to the user's selected folder with a filename like `OG-<topic>-<YYYY-MM-DD>.pptx`.

## Non-negotiables

These rules exist because they're the difference between a slide that looks on-brand and one that doesn't.

- **Font:** Figtree only. All five weights are available (Regular, Medium, SemiBold, Bold, ExtraBold). Never Arial, Helvetica, Calibri, or Soleil. Soleil is deprecated.
- **Palette:** Only the hex values in `brand-constants.md`. No black text (`#000000`) — use Midnight (`#17132F`). No "close enough" greens — use `#009A50` or `#00FF85`.
- **Contrast rule:** Green (`#009A50`) is the accent on light/white backgrounds. Groovy Green (`#00FF85`) is the accent on dark/Midnight backgrounds. Use the `accentColor(isDark)` helper so you can't get this wrong.
- **Subtitles on dark:** Use Gray-900 (`#EBEAF0`) for subtitle/muted text on dark backgrounds, not plain white. Use `subtitleColor(isDark)` helper.
- **Backgrounds:** Use the bundled background images. `bg-divider.png` for dark slides; `bg-content.png` for light slides; `testimonial-bg-dark.png` or `testimonial-bg-light.png` for quote/testimonial slides. Don't generate gradients or shapes to mimic the gradient circles — they will drift from the real brand.
- **Logo placement:** Only on title and closing slides. Content and divider slides stay clean.
- **Footer:** Place `Footer.png` flush against the bottom edge of every slide — no exceptions.
- **Aspect ratio:** Always `LAYOUT_WIDE` (13.33" × 7.5").
- **Section labels:** ALL CAPS, Bold, tracked (`charSpacing: 4`), colored with the accent rule above.
- **Card design:** Use gradient callout PNG assets (`gradient-callout-1.png` through `gradient-callout-4.png`) as shadow layers behind white cards. Use `addGradientCard()` helper.
- **Quote icon:** Use `quotation.png` asset — **only on testimonial/customer quote slides**. For strategic insight callouts, use a Midnight card with a green left accent bar and a "KEY INSIGHT" section label instead. Don't create text-based quote marks.
- **Line spacing:** All body copy uses `lineSpacingMultiple: 1.15`. Headlines use 1.1.
- **Punctuation on headlines:** NEVER add a period at the end of slide titles, headlines, section labels, subtitles, or agenda items. Periods are only appropriate on body copy sentences and bullet points. This applies to all title, section divider, and closing slides — the headline is a statement, not a sentence. If the user's content includes a trailing period on a headline, remove it.
- **Icons:** Use Google Material Symbols Outlined (weight 300, fill off, grade normal, optical size 24). Never use emoji, unicode symbols, or hand-drawn SVG icons. For larger conceptual illustrations, use Material Symbols at 48px+. The icon set includes: check_circle, autorenew, shopping_bag, schedule, local_shipping, credit_card, person, settings, notifications, trending_up, insights, lock, arrow_forward, favorite, download, help — plus any other Material Symbol that fits the context.
- **Charts:** Follow the chart palette sequence in `brand-constants.md`. Solid colors only, never gradients on chart fills.

## Available Layouts

All 21 recipes are in `layout-recipes.md`. Pick the one that matches the content — don't ask the user which layout they want unless it's genuinely ambiguous.

### Title slides
- **Title / cover (dark)** — hero headline, bg-divider background
- **Title / cover (light)** — hero headline, bg-content background
- **Title with client logo + image** — co-branded, client logo in logo-box frame

### Structure slides
- **Section divider** — dark mode, ALL CAPS label + large title
- **Agenda** — light mode, numbered list with Green numerals

### Content slides
- **Content: heading + bullets** — one headline, lead paragraph, 4-5 bullets
- **Two-column with quote card** — narrative left, dark card with pull-quote right
- **Content with subhead blocks + image** — dark mode, 2-3 labeled blocks + optional image

### Data slides
- **Three-stat callout** — three cards with large numbers
- **Percentage callout (2-col)** — two big percentages with descriptions
- **Percentage callout (3-col)** — three big percentages, dark mode
- **Chart (bar)** — bar chart with brand palette
- **Chart (line)** — line chart with brand palette
- **Market size / concentric tiers** — four ascending value tiers
- **Before / after comparison** — off-white "before" card beside Midnight "after" card

### Customer / social proof slides
- **Testimonial with gradient cards** — three quote cards with gradient shadows + quote icon
- **Case study one-pager** — challenge/solution split with inline stats
- **Logo grid** — client logos in branded logo-box frames

### Closing slides
- **Closing / thank you (simple)** — dark mode, no contact info
- **Closing / thank you (with contact)** — dark mode, contact block

If a user needs a layout not on this list, adapt the closest one — don't freestyle.

## QA (required)

Every deck must pass a visual inspection before you hand it off.

```bash
# Install conversion tools if needed
pip install Pillow --break-system-packages 2>/dev/null
# Convert to PDF
python scripts/office/soffice.py --headless --convert-to pdf output.pptx
# Convert to slide JPGs
rm -f slide-*.jpg
pdftoppm -jpeg -r 150 output.pdf slide
```

Then view every `slide-*.jpg` and check for:

- Text overflowing its box (especially large stats)
- Elements overlapping (footer over content, blob over text)
- Accent color wrong for the background (Groovy Green on white = bug)
- Logo appearing on content slides (should only be title + closing)
- Missing footer on any slide
- Leftover placeholder text ("[Brand X]", "[Your Name]")
- Gradient callout card shadows not aligned with white card overlay
- Trailing periods on headlines, titles, section labels, or subtitles (REMOVE them — headlines are not sentences)
- Emoji anywhere in the deck (replace with Material Symbol icon or remove)
- Logo appears warped or stretched (must maintain 2.68:1 aspect ratio — w=1.5", h=0.56")

If you find an issue, fix it and re-render the affected slide. Don't declare done after the first pass.

## Common pushbacks

When a user asks for something off-brand:

- **"Can we use a different font?"** → "Ordergroove's brand is Figtree. Using a different font makes the deck feel disconnected from other OG materials. I can adjust weight or size for more visual interest."
- **"Make the background blue/red/orange."** → "Those aren't in the brand palette, but I can use the gradient callout cards or accent colors differently to create contrast."
- **"Just put the logo on every slide."** → "Brand rule is logo on title and closing only — the footer on every slide already carries the brand."
- **"Use Soleil for the title."** → "Soleil is deprecated. Figtree Bold or ExtraBold gives a similar impact."

## File outputs

Save the final .pptx to `/mnt/user-data/outputs/` with a filename like `OG-<topic>-<YYYY-MM-DD>.pptx`.
