# Brand Constants

The values in this file are the ground truth for every Ordergroove deck. They are extracted from the Figma design system source file (`Skill_Presentation`). Copy them directly — don't approximate, don't substitute "close enough" equivalents.

## Colors

### Primary palette

| Token name | Hex | When to use |
|---|---|---|
| Midnight | `#17132F` | Dark backgrounds; heading + body text on light backgrounds |
| Dark Indigo (Gray-200) | `#2E2A47` | Subtitle text on light backgrounds; muted body text |
| Green | `#009A50` | Accent on **light** backgrounds — section labels, numerals, stat highlights |
| Groovy Green | `#00FF85` | Accent on **dark** backgrounds — section labels, CTA, highlights |
| Intense Cyan | `#00FAFF` | Chart 3rd series; gradient stop |
| Neon Carrot | `#FF8500` | Gradient accent stop (gradient callout cards) |
| Laser Lemon | `#EAFF00` | Gradient accent stop; emphasis on dark only; **never** as text on white |
| White | `#FFFFFF` | Light background; text on dark |
| Gray-900 | `#EBEAF0` | Subtitle text on dark backgrounds; light muted text |
| Gray-800 | `#D8D7DF` | Card borders; divider lines |

### Secondary text tones

| Token | Hex | Use |
|---|---|---|
| Muted | `#4F4A6A` | Secondary body text on light backgrounds |
| Soft | `#666279` | Tertiary/caption text on light backgrounds |

### The green contrast rule (most important)

This is the rule people get wrong most often:

- **Light/white background** → accent is Green `#009A50`
- **Dark/Midnight background** → accent is Groovy Green `#00FF85`

Groovy Green on white has insufficient contrast and looks cheap. Green on dark disappears. Always use `accentColor(isDark)` from `scripts/build.js` — it returns the right value.

### Chart sequence

For multi-series charts, use these colors in order:

1. `#00FF85` Groovy Green (on dark) or `#009A50` Green (on light)
2. `#009A50` Green (if primary was Groovy) or `#00FF85` Groovy (if primary was Green)
3. `#00FAFF` Intense Cyan
4. `#00C8CC` Teal
5. `#009699` Deep Teal
6. `#28639D` Steel Blue
7. `#EAFF00` Laser Lemon
8. `#FF8500` Neon Carrot

Never use gradients in chart fills. Solid colors only.

### Forbidden

- Black `#000000` for text — always use Midnight `#17132F`
- Soleil font — deprecated, use Figtree everywhere
- Arial, Helvetica, Calibri — always Figtree
- Any green outside `#009A50` or `#00FF85`
- Laser Lemon text on white backgrounds (contrast failure)
- Groovy Green text on white/light backgrounds (contrast failure)
- Emoji — never used in Ordergroove materials
- Trailing periods on headlines, titles, section labels, or subtitles

## Typography

**Font family:** Figtree (bundled at `assets/brand/fonts/`). Auto-installed via `scripts/install-fonts.sh`.

**Available weights:**

| Weight | File | pptxgenjs mapping |
|---|---|---|
| Regular (400) | `Figtree-Regular.ttf` | Default body — no bold flag |
| Medium (500) | `Figtree-Medium.ttf` | Mid-emphasis body |
| SemiBold (600) | `Figtree-SemiBold.ttf` | Emphasized body, card headers |
| Bold (700) | `Figtree-Bold.ttf` | `bold: true` — headings, stats |
| ExtraBold (800) | `Figtree-ExtraBold.ttf` | Hero display text (rare) |

**Note on pptxgenjs:** pptxgenjs only supports regular and bold (`bold: true`). For Medium, SemiBold, and ExtraBold, register them as separate font faces using their full names (e.g., `fontFace: "Figtree SemiBold"`). The install-fonts script registers all variants.

### Type scale

Figma source uses pixels on a 1920×1080 canvas. PowerPoint uses points on a 13.33"×7.5" canvas. The conversion factor is approximately **px × 0.5 = pt**.

| Context | Figma (px) | PowerPoint (pt) | Weight | Notes |
|---|---|---|---|---|
| Hero / cover title | 90 | 44–48 | Bold | Line-height 1.1 |
| Slide H1 | 64.5 | 32 | Bold | Tracking -0.645px |
| H2 / subhead | 40 | 20 | Medium or Bold | |
| Stat callout number | 80–100 | 40–50 | Bold | Large numerals |
| Section label (ALL CAPS) | 20 | 11 | Bold, charSpacing 4 | Uppercase, accent-colored |
| Body large | 30 | 15–16 | Regular | Line-height 1.15 |
| Body default | 26 | 13–14 | Regular | Line-height 1.15 |
| Card body | 26 | 13 | Medium | Line-height 1.15 |
| Caption / sub | 20–24 | 10–12 | Regular | |
| Footer text | 15 | — | — | Baked into Footer.png |

## Layout defaults

- **Aspect ratio:** `LAYOUT_WIDE` (13.33" × 7.5") — always
- **Margins:** 0.7" from left edge, 0.5" from top, 0.35" minimum from bottom (above footer)
- **Footer height:** 0.75" — `Footer.png` (1920×108px) sits at `y: 6.75, h: 0.75, w: 13.33`
- **Logo size:** 1.5" wide × 0.56" tall (preserves the 2.68:1 aspect ratio of the 1204×450px source image). Positioned `x: 0.55, y: 0.45`. CRITICAL: never set height independently from width — always maintain the 2.68:1 ratio or the logo will appear warped.
- **Page numbers:** Figtree bold 10pt, accent-colored, bottom-right above footer

## Card design

Ordergroove cards have a distinctive signature: **asymmetric rounded corners** with a **gradient shadow bar** behind them.

- White card: rounded corners on three sides (top-left, bottom-left, bottom-right); top-right is squared off
- Gradient shadow: a colored bar that peeks out from the right edge and bottom
- Border: `#D8D7DF` (Gray-800), 3px

**In pptx:** Because pptxgenjs cannot render asymmetric corner radii or gradient shadows, use the pre-built `gradient-callout-N.png` assets as background images, then layer a white rectangle (with standard rounded corners as a close approximation) on top, with text on the top layer.

### Gradient callout variants

| Asset | Gradient colors | Use |
|---|---|---|
| `gradient-callout-1.png` | Green → Cyan | Default; first card in a row |
| `gradient-callout-2.png` | Orange → Yellow | Second card |
| `gradient-callout-3.png` | Purple → Blue → Green | Third card |
| `gradient-callout-4.png` | Orange → Yellow (alt) | Fourth card / alternate |

## Asset inventory

All paths are relative to the skill root.

| Asset | Use |
|---|---|
| `assets/brand/bg-divider.png` | Background for title, section dividers, closing (dark mode) |
| `assets/brand/bg-content.png` | Background for light content slides (subtle gradient accents) |
| `assets/brand/testimonial-bg-dark.png` | Full background for testimonial/quote slides (dark mode) |
| `assets/brand/testimonial-bg-light.png` | Full background for testimonial/quote slides (light mode) |
| `assets/brand/Footer.png` | Full-width footer bar — every slide |
| `assets/brand/logo-dark.png` | Wordmark for dark backgrounds (white ink) |
| `assets/brand/logo-white.png` | Wordmark for light backgrounds (dark ink) |
| `assets/brand/logo-box.png` | Card frame for client logos (green gradient shadow) |
| `assets/brand/quotation.png` | Gradient quote icon — **testimonial slides only** |

### Callout vs. testimonial distinction

- **Testimonial / customer quote:** Use `quotation.png` icon + attribution line. Reserves the quote visual for actual customer voices.
- **Key insight / strategic callout:** Use a Midnight card with a Groovy Green left accent bar + "KEY INSIGHT" section label. No quote icon. This signals an internal POV or strategic takeaway.
| `assets/brand/gradient-callout-1.png` | Card shadow: green → cyan |
| `assets/brand/gradient-callout-2.png` | Card shadow: orange → yellow |
| `assets/brand/gradient-callout-3.png` | Card shadow: purple → blue → green |
| `assets/brand/gradient-callout-4.png` | Card shadow: orange → yellow (alt) |
| `assets/brand/fonts/Figtree-Regular.ttf` | Body font |
| `assets/brand/fonts/Figtree-Medium.ttf` | Mid-weight body font |
| `assets/brand/fonts/Figtree-SemiBold.ttf` | Emphasized body font |
| `assets/brand/fonts/Figtree-Bold.ttf` | Heading font |
| `assets/brand/fonts/Figtree-ExtraBold.ttf` | Display font (rare) |

## Iconography

**System:** Google Material Symbols Outlined

**Spec:** weight 300, fill off, grade normal, optical size 24

**Usage in pptx:** Material Symbols is not available as a font in PowerPoint. For icons in slides, Claude should either:
1. Use Unicode equivalents where available (✓, →, etc.) styled in Figtree
2. Describe the icon placement as a comment for manual insertion
3. Use simple geometric shapes (circles, lines) as icon stand-ins

**Approved icon names** (from the brand icon set):

| Icon | Material Symbol name | Use |
|---|---|---|
| Check | `check_circle` | Confirmation, completed items |
| Renew | `autorenew` | Recurring, subscription renewal |
| Bag | `shopping_bag` | Commerce, checkout |
| Schedule | `schedule` | Timing, cadence |
| Ship | `local_shipping` | Delivery, fulfillment |
| Card | `credit_card` | Payment, billing |
| Account | `person` | User, subscriber |
| Settings | `settings` | Configuration |
| Notify | `notifications` | Alerts, communications |
| Growth | `trending_up` | Growth, revenue |
| Insights | `insights` | Analytics, data |
| Lock | `lock` | Security, access |
| Next | `arrow_forward` | Navigation, progression |
| Favorite | `favorite` | Loyalty, preference |
| Download | `download` | Export, download |
| Help | `help` | Support, information |

**Forbidden:**
- Emoji — never used in Ordergroove materials
- Unicode symbols as decorative icons
- Hand-drawn or custom SVG icons (only logo wordmark, logo-box, and quotation mark are bespoke SVG)

**For larger conceptual illustrations:** The brand uses custom 4-color illustrations in the primary palette (indigo/green/cyan/lemon). These are not available as assets — use Material Symbols at 48px+ as a stand-in and flag for manual replacement.

## Punctuation rules

- **Headlines, titles, section labels, subtitles:** NEVER end with a period. These are statements, not sentences.
- **Body copy, bullets, descriptions:** Periods are fine on complete sentences.
- **Agenda items:** No trailing periods.
- **Stat labels:** No trailing periods (e.g., "Subscriber retention lift" not "Subscriber retention lift.")
- **Casing:** Title Case on slide titles and CTAs. ALL CAPS with letter-spacing on eyebrow/section labels. Sentence case on body copy.
- **Emoji:** Never. Use Material Symbols icons or nothing.
- **Quotes:** Use curly/smart quotes in testimonials, not straight quotes.
