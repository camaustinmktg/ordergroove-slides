# Layout recipes (Slide Skill 2.0)

Each recipe is code you paste into a build script and adapt to the user's content. Every recipe adds exactly one slide. They assume the constants and helpers from `scripts/build.js` are in scope:

```text
C, FONT, FONT_MEDIUM, FONT_SEMI, FONT_EXTRA, W, H, ASSETS, SAFE,
accentColor, subtitleColor, sectionLabel, addFooter, addFooterText, addLogo,
customerLogo, addLogoFit, addLogoCard, addCard, addPill, addPlaceholder,
figmaShadow, addGradientShape, addIcon, addIconTile, tileColor, addSectionTile,
photoAccent, addPhotoRing,
textWidth, fitFontSize, wrapLines, addGradientHighlight, addStatCardGradient,
addStatStrip, niceAxis, drawLineChart, drawBarChart
```

- **Source of truth:** the Figma file "Slide Skill 2.0" (`1LAizYM7R7QVubcHuix1KF`, Layouts `1:92`). Every recipe is built from its Figma frames, and every one of the 58 frames maps to a recipe and variant (see [Coverage](#coverage-every-figma-slide)).
- **Units:** Figma slides are 1920×1080 px; the deck is `LAYOUT_WIDE` 13.333×7.5 in. Positions are Figma px ÷ 144. Font sizes are Figma px ÷ 2 (pt). Line widths are Figma px ÷ 2 (pt). Line spacing is Figma's line height in px ÷ 2, set in points (`lineSpacing`); keep writing points, because `newPresentation()` converts them to a percentage that Google Slides keeps. A text box with negative `charSpacing` needs about 2% more width than Figma's, because Google Slides drops letter spacing and the text would wrap sooner.
- **Variants:** recipes that cover several Figma slides start with `const VARIANT = "A";`. The letter matches the Figma frame name ("Table A", "Table B").
- **Logos and footers (DECISIONS §6):** title and closing slides get the large logo (`addLogo`) plus the text-only footer (`addFooterText`). Every other slide gets the footer bar (`addFooter`). Never two logos on one slide. Each recipe uses the footer bar its Figma frame uses: `addFooter(s)` Footer Bar 1, `addFooter(s, { bar: 2 })` Bar 2 (slide number), `addFooter(s, { bar: 3 })` Bar 3 (92 px bar: tables, timelines B–D, Before / after A, Team, Org chart). The deck's audience (`newPresentation({ audience })`) decides whether the footers carry the confidentiality line; recipes don't change for it.
- **Backgrounds:** `ASSETS.bgGlowDark` and `ASSETS.bgGlowLight` (glow on the right: keep text inside `SAFE.glow`, right edge 5.8 in), `ASSETS.bgGlowLight2` (glow along the bottom, Closing C), `ASSETS.bgGradient1` (full gradient: Title light A, Section divider A, Closing B) and `ASSETS.bgLogoWallDark` (Card grid F); everything else is a plain fill. The v2.1 circle backgrounds (`bg-divider.png`, `bg-content.png`) are gone.
- **Placeholders:** customer logos, headshots, product shots and illustrations are drawn with `addPlaceholder()`. Pass `path:` to drop in a real file; a photo fills the box and is cropped, so add `fit: "contain"` for a cut-out. Customer logos that are bundled come from `customerLogo("<slug>")` (`assets/logos/`).
- **Section label above a title:** no recipe draws one. Put `sectionLabel()` at y 0.6 and move the title and everything under it down 0.23 in. The label's line then sits where the title's top was, and the slide keeps its top margin. Check that the lowest element still clears the footer bar by 0.35 in; if it doesn't, cut content rather than close the gap.

  ```javascript
  const dy = 0.23; // room for the label: the title and everything below move down
  sectionLabel(s, "Pilot readout", 0.694, 0.6, accentColor(false)); // 11 pt Bold caps, text spans y 0.66–0.84
  s.addText("Incrementality study: proving net lift", {
    x: 0.694, y: 0.646 + dy, w: 11.479, h: 0.493, // the recipe's title, was y 0.646
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
  });
  ```
- **Real copy:** recipes are drawn with Figma's sample text. With the user's text, measure before you place: `textWidth()` (inches, from the bundled Figtree files), `wrapLines()` (how many lines a box needs) and `fitFontSize()` (largest size that fits). Recipes 11, 19 B / D, 21 and 26 already do this.
- **Icons:** Material Symbols Rounded, `addIcon()` / `addIconTile()`. Pick the name from `references/icon-index.md`. Tile colour follows the section: `addSectionTile(s, icon, x, y, { section, isDark })` (green, pink, teal, Midnight; Solid tiles on dark). See SKILL.md "Icon tile colours by section".
- **Photo accents:** Team and Org chart have `const ACCENT = null;`. `"cyan"`, `"pink"` or `"green"` (Intense Cyan, Flamingo Pink, Groovy Green) colours the ring around a round headshot (`addPhotoRing`) or Org chart's offset tile (`photoAccent`). `null` keeps Figma's look. See SKILL.md "Photo accents".
- **Charts:** drawn as native shapes by default. `POWERPOINT = true` builds a native PowerPoint chart instead, only when the user explicitly says PowerPoint (see SKILL.md "Charts").
- **Numbers:** plain numerals, 1, 2, 3. Never 01, 02, 03.

## Table of contents

**Title slides**
1. [Title / cover (dark)](#1-title--cover-dark)
2. [Title / cover (light)](#2-title--cover-light)
3. [Title with client logo + image](#3-title-with-client-logo--image)

**Structure**
4. [Section divider](#4-section-divider)
5. [Agenda](#5-agenda)

**Content**
6. [Content: heading + bullets](#6-content-heading--bullets)
7. [Two-column with quote card](#7-two-column-with-quote-card)
8. [Stat card + image](#8-stat-card--image)
9. [Icon columns](#9-icon-columns)
10. [Card grid](#10-card-grid)
28. [Content + dark side panel](#28-content--dark-side-panel) (added 2026-10-20)

**Data**
11. [Three-stat callout](#11-three-stat-callout)
12. [Numbered columns](#12-numbered-columns)
13. [Big number](#13-big-number)
14. [Chart (bar)](#14-chart-bar)
15. [Chart (line)](#15-chart-line)
16. [Chart (pie / donut)](#16-chart-pie--donut)
17. [Table](#17-table)
18. [Before / after comparison](#18-before--after-comparison)
19. [Process timeline](#19-process-timeline)
20. [Roadmap](#20-roadmap)

**Customers and people**
21. [Testimonial with gradient cards](#21-testimonial-with-gradient-cards)
22. [Case study one-pager](#22-case-study-one-pager)
23. [Logo grid](#23-logo-grid)
24. [Team](#24-team)
25. [Org chart](#25-org-chart)

**Closing**
26. [Closing / thank you (simple)](#26-closing--thank-you-simple)
27. [Closing / thank you (with contact)](#27-closing--thank-you-with-contact)

Renumbered in 2.0. v2.1 → 2.0: 1→1, 2→2, 3→3, 4→4, 5→5, 6→6, 7→7, 8→11, 10→12, 11→21, 12→8, 13→22, 14→19, 15→14, 16→15, 17→18, 19→23, 20→26, 21→27. Removed: 9 Percentage callout (2-col), now covered by Icon columns; 18 Market size / concentric tiers (DECISIONS §2).


## Coverage: every Figma slide

All 58 slide frames in Figma's Layouts section (`1:92`) map to a recipe and a variant. Set `const VARIANT` to the letter to build that frame; "—" means the recipe has one layout. `audit/test-recipes.js` reads this table: it builds every row and fails if a row or a variant is missing. "Render vs Figma" is what the LibreOffice render still shows differently (side-by-sides in `audit/renders-2.0/`). Across all slides: titles are sentence case where Figma uses Title Case, and LibreOffice draws Figtree Medium and SemiBold close to Regular.

| # | Figma frame | Node | Recipe | Variant | Render vs Figma |
|---|---|---|---|---|---|
| 1 | Title / cover (dark) | `58:821` | 1. Title / cover (dark) | — | Matches |
| 2 | Title / cover (light) A | `1:104` | 2. Title / cover (light) | A | Matches |
| 3 | Title / cover (light) B | `1:395` | 2. Title / cover (light) | B | Matches |
| 4 | Title with client logo + image A | `1:93` | 3. Title with client logo + image | A | Photo panel is a placeholder |
| 5 | Title with client logo + image B | `1:217` | 3. Title with client logo + image | B | Product shot is a placeholder |
| 6 | Title with client logo + image C | `1:242` | 3. Title with client logo + image | C | Product shot is a placeholder; footer line white (Figma's is Midnight on Midnight) |
| 7 | Section divider A | `1:390` | 4. Section divider | A | Matches |
| 8 | Section divider B | `1:267` | 4. Section divider | B | Product shot is a placeholder |
| 9 | Section divider C | `1:1747` | 4. Section divider | C | Photo is a placeholder; Footer Bar 2 shows the real slide number |
| 10 | Agenda A | `1:286` | 5. Agenda | A | Matches |
| 11 | Agenda B | `1:280` | 5. Agenda | B | Matches |
| 12 | Content: heading + bullets A | `1:384` | 6. Content: heading + bullets | A | Matches |
| 13 | Content: heading + bullets B | `1:1722` | 6. Content: heading + bullets | B | Product shot is a placeholder |
| 14 | Two-column with quote card A | `1:143` | 7. Two-column with quote card | A | Matches; the quote's opening mark doesn't hang outside the margin, so lines break slightly differently |
| 15 | Two-column with quote card B | `1:111` | 7. Two-column with quote card | B | Headshot is a placeholder; quote mark doesn't hang, so lines break slightly differently |
| 16 | Two-column with quote card C | `1:1103` | 7. Two-column with quote card | C | Numbers 1., 2., 3. (Figma: 01.); quote mark doesn't hang, so lines break slightly differently |
| 17 | Stat card + image | `1:1692` | 8. Stat card + image | — | Photo is a placeholder; no gradient circles behind it (retired background) |
| 18 | Icon columns | `1:324` | 9. Icon columns | — | Matches |
| 19 | Card grid A | `1:402` | 10. Card grid | A | Customer logos are placeholders |
| 20 | Card grid B | `1:661` | 10. Card grid | B | Matches |
| 21 | Card grid C | `1:729` | 10. Card grid | C | Matches |
| 22 | Card grid D | `1:427` | 10. Card grid | D | Matches |
| 23 | Card grid E | `1:455` | 10. Card grid | E | Illustrations are placeholders |
| 24 | Card grid F | `1:1142` | 10. Card grid | F | Logo wall is the newer 62-logo wall (`81:911`); the Figma slide still shows the older wall |
| 25 | Three-stat callout | `1:973` | 11. Three-stat callout | — | Matches |
| 26 | Numbered columns | `1:341` | 12. Numbered columns | — | Matches |
| 27 | Big number A | `1:1065` | 13. Big number | A | Matches |
| 28 | Big number B | `1:1071` | 13. Big number | B | Matches |
| 29 | Chart (bar) | `1:1411` | 14. Chart (bar) | — | Bars Groovy Green + Midnight (`C.chart`, DECISIONS §5), not cyan + green; value labels above the bars; one category label per pair |
| 30 | Chart (line) | `58:874` | 15. Chart (line) | — | Matches |
| 31 | Chart (pie / donut) A | `1:174` | 16. Chart (pie / donut) | A | Slices in `C.chart` order with real percentages, not "XX%"; Figma's designer badge left out |
| 32 | Chart (pie / donut) B | `1:1349` | 16. Chart (pie / donut) | B | One centre-stat donut at full size (the Figma frame is an 8-donut colour sheet); designer badge left out |
| 33 | Table A | `1:923` | 17. Table | A | Matches (header numbered 1–4) |
| 34 | Table B | `1:860` | 17. Table | B | Matches |
| 35 | Before / after comparison A | `1:797` | 18. Before / after comparison | A | Matches |
| 36 | Before / after comparison B | `1:1173` | 18. Before / after comparison | B | Screenshot and illustration are placeholders |
| 37 | Process timeline A | `1:358` | 19. Process timeline | A | Matches |
| 38 | Process timeline B | `1:1764` | 19. Process timeline | B | Matches; arrowhead smaller in LibreOffice |
| 39 | Process timeline C | `1:1831` | 19. Process timeline | C | Matches; arrowheads smaller in LibreOffice |
| 40 | Process timeline D | `1:998` | 19. Process timeline | D | Same as B (Figma's frame is a copy of `1:1764`) |
| 41 | Roadmap | `1:1874` | 20. Roadmap | — | Matches |
| 42 | Testimonial with gradient cards A | `1:602` | 21. Testimonial with gradient cards | A | Caption sits at the 6-line position on both cards (Figma moves it up under a 5-line quote) |
| 43 | Testimonial with gradient cards B | `1:630` | 21. Testimonial with gradient cards | B | Client logos are placeholders; caption as A |
| 44 | Case study one-pager | `1:1078` | 22. Case study one-pager | — | Product photo is a placeholder |
| 45 | Logo grid | `60:853` | 23. Logo grid | — | Matches |
| 46 | Team A | `1:1615` | 24. Team | A | Headshots are placeholders; footer line added on internal decks (Figma's Team slides have none) |
| 47 | Team B | `1:1538` | 24. Team | B | Headshots are placeholders; footer line added on internal decks (Figma's Team slides have none) |
| 48 | Org chart | `1:1456` | 25. Org chart | — | Headshots are placeholders |
| 49 | Closing / thank you (simple) | `60:968` | 26. Closing / thank you (simple) | — | Matches |
| 50 | Closing / thank you (with contact) A | `1:1713` | 27. Closing / thank you (with contact) | A | Headshot is a placeholder |
| 51 | Closing / thank you (with contact) B | `1:1402` | 27. Closing / thank you (with contact) | B | Matches |
| 52 | Closing / thank you (with contact) C | `1:1754` | 27. Closing / thank you (with contact) | C | Matches |
| 53 | Content + dark side panel A | `123:949` | 28. Content + dark side panel | A | Matches |
| 54 | Content + dark side panel B | `124:965` | 28. Content + dark side panel | B | Matches |
| 55 | Content + dark side panel C | `125:1019` | 28. Content + dark side panel | C | Matches |
| 56 | Content + dark side panel D | `156:1212` | 28. Content + dark side panel | D | Matches |
| 57 | Content + dark side panel E | `156:1288` | 28. Content + dark side panel | E | Matches |
| 58 | Content + dark side panel F | `156:1371` | 28. Content + dark side panel | F | Matches |

**Photo accent options** aren't separate frames in the table: they're settings on rows 46–48. Figma shows each one in the "Accent options, picked" block below the slides (2026-10-20): Team A `163:1351`, Team B `163:1675`, Org chart `163:2043`, each as no accent, `"cyan"`, `"pink"` and `"green"`. `audit/test-recipes.js` builds every accent once (not in `--sample` or `--defaults`). The block above it, "Accent colour options", holds the options Cameron turned down (full-colour discs, tints, Big number and Card grid A).

---

## 1. Title / cover (dark)

**Figma:** Title / cover (dark) `58:821`.

Dark mode. Midnight with a blurred green-to-cyan glow on the right (one full-bleed image). The large logo is top left, with a 2-line hero title, a subtitle, and the text-only footer. Keep the title to 2 lines: a third line runs into the subtitle.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgGlowDark }; // Background Glow Dark 2

  addLogo(s, true); // large logo, 435×75 px at 97,190

  s.addText("Presentation title goes here", {
    x: 1.069, y: 2.701, w: 4.729, h: 1.528,
    fontFace: FONT, fontSize: 50, bold: true, color: C.white,
    lineSpacing: 55, valign: "top", margin: 0,
  });
  s.addText("Subtitle or date can go here", {
    x: 1.069, y: 4.618, w: 4.729, h: 0.347,
    fontFace: FONT, fontSize: 20, color: C.white,
    lineSpacing: 25, valign: "top", margin: 0,
  });

  addFooterText(s, true); // Footer Text White 1
}
```

---

## 2. Title / cover (light)

**Figma:** Title / cover (light) A `1:104` (full gradient, Midnight header bar) and B `1:395` (white with the glow on the right).

Light twin of recipe 1: Midnight title and subtitle, text-only footer. **A**: the full-bleed Intense Cyan → Laser Lemon gradient, the logo centred in a Midnight header bar, and a larger title. **B**: the large dark logo top left on the white glow background. B's positions follow `1:395` (logo at 127 px, title at 336 px), which sit higher than the dark title's.

```javascript
{
  const VARIANT = "A"; // A: gradient + header bar (Figma 1:104) · B: white glow (Figma 1:395)
  const isA = VARIANT === "A";
  const s = pres.addSlide();
  if (isA) {
    s.background = { path: ASSETS.bgGradient1 }; // Background Gradient 1 (10:708)
    s.addShape("rect", { x: 0, y: 0, w: W, h: 0.757, fill: { color: C.midnight }, line: { type: "none" } }); // Header 1: 109 px bar
    addLogo(s, true, { x: 5.368, y: 0.153, w: 2.59 }); // 373×64 px logo, centred, at 773,22
  } else {
    s.background = { path: ASSETS.bgGlowLight }; // Background Glow Light 1 (10:709)
    addLogo(s, false, { y: 0.882 }); // large logo, 435×75 px at 97,127
  }

  s.addText("Presentation title goes here", {
    x: isA ? 1.072 : 1.097, y: isA ? 2.263 : 2.333, w: isA ? 6.13 : 4.729, h: isA ? 1.681 : 1.528,
    fontFace: FONT, fontSize: isA ? 55 : 50, bold: true, color: C.midnight,
    lineSpacing: isA ? 60.5 : 55, charSpacing: isA ? -0.55 : 0, valign: "top", margin: 0,
  }); // A: 110 px at 154,326, -1% tracking (without it the title wraps after "Presentation"), box 2% wider than Figma's 6.01" because Google Slides drops the tracking · B: 100 px at 158,336
  s.addText("Subtitle or date can go here", {
    x: isA ? 1.069 : 1.097, y: isA ? 4.181 : 4.25, w: 4.729, h: 0.347,
    fontFace: FONT, fontSize: 20, color: C.midnight,
    lineSpacing: 25, valign: "top", margin: 0,
  });

  addFooterText(s, false); // Footer Text Dark 1
}
```

- A's logo sits in the header bar and the footer is text-only, so the slide still has one logo (DECISIONS §6).
- Keep the title to 2 lines on both variants.

---

## 3. Title with client logo + image

**Figma:** Title with client logo + image A `1:93` (Midnight, rounded image panel, OLLY), B `1:217` (white, Keurig) and C `1:242` (Midnight, Keurig).

Co-branded cover. Ordergroove logo, title and subtitle on the left. On the right, the client's imagery and a white card holding the client's logo, overlapping the image's lower left. **A**: one rounded image panel that runs off the right edge. **B/C**: a gradient block flush with the right edge with a cut-out product shot over it; C's block is the wider Gradient Accent 2. Product shots and lifestyle photos aren't bundled: the recipe draws an image placeholder; pass `path:` to `addPlaceholder` for a real photo (a cut-out PNG works best on B/C). The client logo comes from `assets/logos/` or a file the user supplies.

```javascript
{
  const VARIANT = "A"; // A: Midnight + image panel (Figma 1:93) · B: white + gradient block (Figma 1:217) · C: Midnight + wide gradient block (Figma 1:242)
  const isDark = VARIANT !== "B";
  const s = pres.addSlide();
  s.background = { color: isDark ? C.midnight : C.white };

  addLogo(s, isDark, { y: 0.882 }); // large logo, 435×75 px at 97,127

  const tx = VARIANT === "A" ? 1.069 : 1.097;  // A: 154 px · B/C: 158 px
  const ty = VARIANT === "A" ? 2.264 : 2.333;  // A: 326 px · B/C: 336 px
  s.addText("Presentation title goes here", {
    x: tx, y: ty, w: 4.729, h: 1.528,
    fontFace: FONT, fontSize: 50, bold: true, color: isDark ? C.white : C.midnight,
    lineSpacing: 55, valign: "top", margin: 0,
  });
  s.addText("Subtitle or date can go here", {
    x: tx, y: ty + 1.917, w: 4.729, h: 0.347,
    fontFace: FONT, fontSize: 20, color: isDark ? C.white : C.midnight,
    lineSpacing: 25, valign: "top", margin: 0,
  });

  if (VARIANT === "A") {
    // Image panel: 1150×689 px at 960,182, 39 px corners; it runs off the right edge, so only the left corners show
    addPlaceholder(s, "image", 6.667, 1.264, 6.667, 4.783, { shape: "round", radii: [0.273, 0, 0, 0.273], onDark: true /* , path: photoPath */ });
  } else {
    // Gradient block, flush right: B Gradient accent 1 (841×729 px) · C Gradient Accent 2 (1211 px wide, its visible 841 px)
    s.addImage({ path: VARIANT === "C" ? ASSETS.gradientAccent2 : ASSETS.gradientAccent1, x: 7.493, y: 1.139, w: 5.84, h: 5.063 });
    addPlaceholder(s, "image", 8.6, 1.6, 4.1, 4.1, { onDark: isDark /* , path: productShotPath, fit: "contain" */ }); // product shot
  }

  // Client logo card: 392×181 px at 815,641 (A solid white; B/C 90% white)
  addLogoCard(s, customerLogo(VARIANT === "A" ? "olly" : "keurig"), 5.66, 4.451, 2.722, 1.254,
    { transparency: VARIANT === "A" ? 0 : 10 });

  addFooterText(s, isDark); // Footer Text White 1 / Dark 1
}
```

- C's footer line is Midnight on Midnight in Figma (invisible); the recipe draws it white, as on A.
- A cut-out product shot on B/C needs `fit: "contain"` next to `path:`, so the whole cut-out shows; without it, a tall shot (a phone) loses its top and bottom to the 4.1 × 4.1 in box.

---

## 4. Section divider

**Figma:** Section divider A `1:390` (full gradient), B `1:267` (white, gradient block + product shot) and C `1:1747` (full-bleed photo).

A transition between sections. **A** and **B**: a 1-line title with a subhead in Midnight, left. **C**: a 2–3 line statement in large white type over a darkened full-bleed photo; it uses Footer Bar 2 (with the slide number). Photos and product shots are placeholders; pass `path:` for real ones.

```javascript
{
  const VARIANT = "A"; // A: full gradient (Figma 1:390) · B: white + gradient block and product shot (Figma 1:267) · C: full-bleed photo statement (Figma 1:1747)
  const s = pres.addSlide();
  s.background = VARIANT === "A" ? { path: ASSETS.bgGradient1 } : { color: C.white }; // Background Gradient 1 (10:708)

  if (VARIANT === "C") {
    addPlaceholder(s, "photo", 0, 0, W, H, { onDark: true /* , path: photoPath */ }); // full-bleed photo
    s.addShape("rect", { // Photo Overlay Dark 1: Midnight at 60%, down to the footer
      x: 0, y: 0, w: W, h: 6.799, fill: { color: C.midnight, transparency: 40 }, line: { type: "none" },
    });
    s.addText("Autonomous\nsubscriptions,\nfor humans.", {
      x: 0.743, y: 3.264, w: 10.41, h: 3.021,
      fontFace: FONT, fontSize: 63.5, bold: true, color: C.white,
      lineSpacing: 72.5, charSpacing: -0.6, valign: "top", margin: 0,
    }); // 127 px at 107,470; 3 lines at most
    addFooter(s, { bar: 2 }); // Footer Bar 2: page number
  } else {
    if (VARIANT === "B") {
      // Gradient Accent 2 (1211 px wide, its visible 841 px) flush right, product shot over it
      s.addImage({ path: ASSETS.gradientAccent2, x: 7.493, y: 1.139, w: 5.84, h: 5.063 });
      addPlaceholder(s, "image", 8.6, 1.6, 4.1, 4.1 /* , { path: productShotPath } */);
    }
    s.addText("Transition slide", {
      x: 1.072, y: 2.663, w: 6.01, h: 0.715,
      fontFace: FONT, fontSize: 45, bold: true, color: C.midnight,
      lineSpacing: 51.75, charSpacing: -0.45, valign: "top", margin: 0,
    }); // 90 px at 154,384
    s.addText("Subhead", {
      x: 1.072, y: 3.569, w: 5.861, h: 0.347,
      fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight,
      lineSpacing: 25, valign: "top", margin: 0,
    });
    addFooter(s); // Footer Bar 1
  }
}
```

- A and B: one-line titles (about 22 characters at 45 pt). On B the product shot covers the right half, so keep the title short.
- C: the statement wraps at 3 lines; write it with explicit line breaks.

---

## 5. Agenda

**Figma:** Agenda A `1:286` (numbered pills, two columns) and B `1:280` (bullets).

Light mode. **A**: up to 10 items, 5 per column, each with a Groovy Green number pill (plain numerals: 1, 2, 3). **B**: up to 5 items with Green bullets. Item text is 25 pt; keep each item to one line (about 26 characters in A's columns).

```javascript
{
  const VARIANT = "A"; // A: number pills, up to 10 items in 2 columns (Figma 1:286) · B: bullets, up to 5 items (Figma 1:280)
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Today’s agenda", {
    x: 0.694, y: 0.646, w: 11.479, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight,
    lineSpacing: 35.5, valign: "top", margin: 0,
  });

  const five = ["State of the union", "3-year strategic pillars", "2024 strategic objectives", "Product roadmap", "Next steps"];
  const items = VARIANT === "A" ? [...five, ...five] : five; // Figma A repeats the five items in its second column
  const pitch = 0.712;                          // 102.5 px: 62.5 px line + 40 px gap
  const top = VARIANT === "A" ? 1.826 : 1.944;  // first item at 263 px (A) / 280 px (B)

  items.forEach((text, i) => {
    const col = Math.floor(i / 5), y = top + (i % 5) * pitch;
    if (VARIANT === "A") {
      const px = 0.694 + col * 6.181;           // pills at 100 and 990 px
      addPill(s, String(i + 1), px, y + 0.104, 0.681, 0.271, // Number Pill 1: 98×39 px, Groovy Green as designed
        { fill: C.groovyGreen, color: C.midnight, fontSize: 14, bold: true });
      s.addText(text, {
        x: px + 1.021, y, w: 5.0, h: 0.434,
        fontFace: FONT_MEDIUM, fontSize: 25, color: C.midnight, lineSpacing: 31.25, charSpacing: -0.25, valign: "top", margin: 0,
      });
    } else {
      s.addShape("ellipse", { x: 1.153, y: y + 0.205, w: 0.069, h: 0.069, fill: { color: C.green }, line: { type: "none" } }); // 10 px Green bullet
      s.addText(text, {
        x: 1.451, y, w: 5.861, h: 0.434,
        fontFace: FONT_MEDIUM, fontSize: 25, color: C.midnight, lineSpacing: 31.25, charSpacing: -0.25, valign: "top", margin: 0,
      });
    }
  });

  addFooter(s); // Footer Bar 1
}
```

- More than 10 items (A) or 5 (B): split the agenda, or use A.
- B's bullets are small native circles, not text bullets: pptxgenjs can't colour a bullet apart from its text.

---

## 6. Content: heading + bullets

**Figma:** Content: heading + bullets A `1:384` (heading, lead, content panel) and B `1:1722` (heading, subhead, bullets, product shot + client logo).

Light mode. **A**: a headline, a two-line lead and a pale gradient panel across the slide for the main content (bullets, a screenshot, a diagram). **B**: headline, subhead and 2–4 bullets on the left; on the right the gradient block, a product shot and a client logo card, as on Title with client logo B.

```javascript
{
  const VARIANT = "A"; // A: lead + content panel (Figma 1:384) · B: bullets + product shot and logo card (Figma 1:1722)
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText(VARIANT === "A" ? "One column sample" : "Headline for slide goes here", {
    x: 0.694, y: 0.646, w: VARIANT === "A" ? 11.479 : 6.3, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight,
    lineSpacing: 35.5, valign: "top", margin: 0,
  });

  if (VARIANT === "A") {
    s.addText("The only platform to seamlessly operate with commerce solution, across any channel to deliver the most robust and personalized experiences for your customers. Plus, we guarantee growth!", {
      x: 0.701, y: 1.278, w: 11.938, h: 0.694,
      fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, lineSpacing: 25, charSpacing: -0.2, valign: "top", margin: 0,
    }); // Figma's -1% tracking kept: without it the lead wraps to 3 lines. Box as wide as the panel (Figma 11.778") so Google Slides, which drops the tracking, keeps 2 lines

    // Content Panel Gradient 1: 1719×549 px at 101,343, the gradient at 10%
    const panel = { x: 0.701, y: 2.382, w: 11.938, h: 3.813 };
    s.addImage({ path: ASSETS.contentPanelGradient, ...panel });
    const points = []; // Figma leaves the panel empty. Put 3–5 bullets here, or place a screenshot or diagram inside `panel`.
    if (points.length) {
      s.addText(points.map((t, i) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: i < points.length - 1 } })), {
        x: panel.x + 0.42, y: panel.y + 0.42, w: panel.w - 0.84, h: panel.h - 0.84,
        fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight, lineSpacing: 25, paraSpaceAfter: 15, valign: "top", margin: 0,
      });
    }
  } else {
    s.addText("Subhead", {
      x: 0.696, y: 1.278, w: 5.861, h: 0.347,
      fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight, lineSpacing: 25, valign: "top", margin: 0,
    });
    // Bullets: 40 px body, 30 px sub-point, 30 px between items; bullet at 159 px, text at 197 px
    s.addText([
      { text: "Light text can go here.", options: { bullet: { indent: 19 }, breakLine: true } },
      { text: "Light text can go here.", options: { bullet: { indent: 19 }, breakLine: true } },
      { text: "Light text can go here.", options: { bullet: { indent: 19 }, indentLevel: 1, fontSize: 15, lineSpacing: 18.75 } },
    ], {
      x: 1.104, y: 2.153, w: 5.2, h: 2.6,
      fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight, lineSpacing: 25, paraSpaceAfter: 15, charSpacing: -0.2, valign: "top", margin: 0,
    });
    // Right: Gradient accent 1 flush right, product shot, client logo card (as Title with client logo B)
    s.addImage({ path: ASSETS.gradientAccent1, x: 7.493, y: 1.139, w: 5.84, h: 5.063 });
    addPlaceholder(s, "image", 8.6, 1.6, 4.1, 4.1 /* , { path: productShotPath } */);
    addLogoCard(s, customerLogo("keurig"), 5.431, 4.451, 2.722, 1.254, { transparency: 10 }); // 392×181 px at 782,641
  }

  addFooter(s); // Footer Bar 1
}
```

- A's lead is two lines at most. B: up to 4 bullets of one line each (about 34 characters); the product shot takes the right half.

---

## 7. Two-column with quote card

**Figma:** Two-column with quote card A `1:143`, B `1:111` and C `1:1103`.

A customer quote beside proof. **A**: a white panel on Gray-975 holding a gradient stat card on the left and the quote with the client's logo and the speaker's name. **B**: the same layout on a gradient panel, with the client's logo on a white card and a headshot beside the name. **C**: three numbered reasons on gradient-outline cards on the left, the quote on the right. The quote is 22 pt bold; keep it to about 220 characters (6 lines).

```javascript
{
  const VARIANT = "A"; // A: white panel + gradient stat card (Figma 1:143) · B: gradient panel + logo card and headshot (Figma 1:111) · C: three reasons + quote (Figma 1:1103)
  const s = pres.addSlide();
  s.background = { color: VARIANT === "B" ? C.white : C.gray975 };

  const quote = "“There is no one better equipped to handle Dollar Shave Club’s scale, depth, and innovation than Ordergroove. To deliver on our mission, we partnered with the most powerful and flexible subscription platform out there.”";
  const person = { name: "Name", role: "Chief Digital Officer, Company" };
  const logo = customerLogo("dollar-shave-club-midnight"); // client logo, Midnight version (Assets 10:835)

  if (VARIANT === "A" || VARIANT === "B") {
    // Panel: 1658×791 px at 131,94
    if (VARIANT === "A") addCard(s, 0.91, 0.653, 11.514, 5.493, { fill: C.white, line: null, r: 0.069 });
    else s.addImage({ path: ASSETS.largeCardGradient, x: 0.91, y: 0.653, w: 11.514, h: 5.493 }); // Large Card Gradient 1

    // Card on the left: 357×274 px at 237,347
    if (VARIANT === "A") {
      addGradientShape(s, "statCardGradient1", 1.646, 2.41, 2.479, 1.903); // Stat Card Gradient 1 (with its shadow)
      s.addText("99.99%", {
        x: 1.84, y: 2.944, w: 2.097, h: 0.549,
        fontFace: FONT, fontSize: 33, bold: true, color: C.midnight, lineSpacing: 39.6, align: "center", valign: "top", margin: 0,
      });
      s.addText("Migration success rate", {
        x: 1.84, y: 3.569, w: 2.097, h: 0.208,
        fontFace: FONT_SEMI, fontSize: 12, color: C.midnight, lineSpacing: 14.85, align: "center", valign: "top", margin: 0,
      });
    } else {
      addCard(s, 1.646, 2.41, 2.479, 1.903, { fill: C.white, line: null, r: 0.069, shadow: figmaShadow(24, 24, 0.15) }); // Stat Card Light 1
      addLogoFit(s, logo, 2.885, 3.361, { maxW: 1.514, maxH: 0.867 }); // logo 218×125 px, centred in the card
    }

    s.addText(quote, {
      x: 5.035, y: 1.965, w: 6.05, h: 1.993,
      fontFace: FONT, fontSize: 22, bold: true, color: C.midnight, lineSpacing: 26.4, valign: "top", margin: 0,
    }); // 44 px at 725,283; 843 px wide in Figma, 28 px wider here so line 1 wraps after "handle" as in Figma

    // Caption: A client logo | name; B headshot + name
    let nx;
    if (VARIANT === "A") {
      const lb = addLogoFit(s, logo, 5.049, 4.714, { maxW: 0.892, maxH: 0.511, align: "left" }); // 129×74 px at 727,642
      const dx = lb.x + lb.w + 0.191;
      s.addShape("line", { x: dx, y: 4.451, w: 0, h: 0.535, line: { color: C.midnight, width: 2 } }); // Divider Dark 3
      nx = dx + 0.222;
    } else {
      addPlaceholder(s, "photo", 5.076, 4.396, 0.729, 0.729, { shape: "ellipse" /* , path: headshotPath */ }); // 105 px at 731,633
      s.addShape("ellipse", { x: 5.076, y: 4.396, w: 0.729, h: 0.729, fill: { type: "none" }, line: { color: C.white, width: 1 } }); // Avatar Frame White 2
      nx = 6.076;
    }
    const ny = VARIANT === "A" ? 4.535 : 4.493;
    s.addText(person.name, { x: nx, y: ny, w: 2.6, h: 0.208, fontFace: FONT, fontSize: 10.6, bold: true, color: C.midnight, lineSpacing: 14.85, valign: "top", margin: 0 });
    s.addText(person.role, { x: nx, y: ny + 0.24, w: 2.6, h: 0.208, fontFace: FONT_MEDIUM, fontSize: 10.6, color: C.midnight, lineSpacing: 14.85, valign: "top", margin: 0 });
  } else {
    s.addText("Merchants thrive with Ordergroove for 3 reasons", {
      x: 0.694, y: 0.653, w: 11.479, h: 0.493,
      fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
    });
    const reasons = [
      "Frictionless experiences.\nSeamlessly integrated.",
      "Hell-bent on driving\nyour growth, profitably.",
      "Unmatched flexibility.\nInfinite possibilities.",
    ];
    reasons.forEach((text, i) => {
      const y = [1.556, 3.208, 4.882][i];                                    // cards at 224, 462, 703 px
      addGradientShape(s, "gradientOutlineCard2", 0.81, y, 4.278, 1.389);  // Gradient Outline Card 2: 616×200 px
      s.addText(`${i + 1}.`, { // plain numerals, never 01/02/03
        x: 0.991, y: y + 0.382, w: 0.6, h: 0.333,
        fontFace: FONT_EXTRA, fontSize: 18.5, color: C.midnight, lineSpacing: 24, valign: "top", margin: 0,
      });
      s.addText(text, {
        x: 1.588, y: y + 0.382, w: 3.0, h: 0.667,
        fontFace: FONT_SEMI, fontSize: 18.5, color: C.midnight, lineSpacing: 24, valign: "top", margin: 0,
      }); // 3.0" (Figma 2.882"): "Frictionless experiences." fills 2.868" and wraps when Google Slides rounds font sizes on "Import slides"
    });
    s.addText(quote, {
      x: 6.111, y: 2.34, w: 6.05, h: 1.993,
      fontFace: FONT, fontSize: 22, bold: true, color: C.midnight, lineSpacing: 26.4, valign: "top", margin: 0,
    }); // 44 px at 880,337
    const lb = addLogoFit(s, logo, 6.111, 5.188, { maxW: 0.896, maxH: 0.514, align: "left" }); // 129×74 px at 880,710
    const dx = lb.x + lb.w + 0.188;
    s.addShape("line", { x: dx, y: 4.924, w: 0, h: 0.535, line: { color: C.midnight, width: 2 } });
    s.addText(person.name, { x: dx + 0.222, y: 5.007, w: 2.6, h: 0.208, fontFace: FONT, fontSize: 10.6, bold: true, color: C.midnight, lineSpacing: 14.85, valign: "top", margin: 0 });
    s.addText(person.role, { x: dx + 0.222, y: 5.25, w: 2.6, h: 0.208, fontFace: FONT_MEDIUM, fontSize: 10.6, color: C.midnight, lineSpacing: 14.85, valign: "top", margin: 0 });
  }

  addFooter(s); // Footer Bar 1
}
```

- C: three reasons, two short lines each. Figma numbers them "01."; the recipe writes 1., 2., 3.
- The client logo is the Midnight Dollar Shave Club logo from Figma's Assets (`dollar-shave-club-midnight`). For another client, pass its logo; a missing file draws a "Logo" placeholder in the same spot.

---

## 8. Stat card + image

**Figma:** Stat card + image `1:1692` (named "Content with subhead blocks + image" before 2026-10-20).

Dark mode on Midnight. A two-line headline and subhead top left, a gradient stat card with a label and two figures bottom left, a source line under it, and a large image on the right (a cut-out photo works best; placeholder until the user supplies one). Footer Bar 2, with the slide number.

```javascript
{
  const s = pres.addSlide();
  s.background = { color: C.midnight };

  s.addText("Headline for slide goes here", {
    x: 0.694, y: 0.653, w: 4.41, h: 0.986,
    fontFace: FONT, fontSize: 32, bold: true, color: C.white, lineSpacing: 35.5, valign: "top", margin: 0,
  }); // 64.5 px, 2 lines in a 635 px column
  s.addText("Subhead", {
    x: 0.694, y: 1.778, w: 4.41, h: 0.347,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.white, lineSpacing: 25, valign: "top", margin: 0,
  });

  // Stat card: Stat Card Gradient 2, 553×286 px at 92,591
  const card = { x: 0.639, y: 4.104, w: 3.84, h: 1.986 };
  s.addImage({ path: ASSETS.statCardGradient2, ...card });
  s.addText("Testing averages".toUpperCase(), {
    x: 1.076, y: 4.319, w: 2.972, h: 0.215,
    fontFace: FONT, fontSize: 14, bold: true, color: C.midnight, charSpacing: 0.56, align: "center", valign: "top", margin: 0,
  });
  const stats = [
    { num: "20%", label: "Average win\nrate", x: 1.0, w: 1.236 },        // figure column at 144 px
    { num: "35-40%", label: "Conclusive\nrate", x: 2.604, w: 1.653 },     // at 375 px (wider for the range)
  ];
  stats.forEach(st => {
    s.addText(st.num, {
      x: st.x, y: 4.875, w: st.w, h: 0.271,
      fontFace: FONT, fontSize: 27.5, bold: true, color: C.midnight, lineSpacing: 19.1, align: "center", valign: "top", margin: 0,
    });
    s.addText(st.label, {
      x: st.x + (st.w - 1.236) / 2, y: 5.285, w: 1.236, h: 0.472,
      fontFace: FONT_MEDIUM, fontSize: 13, color: C.darkIndigo, lineSpacing: 16.9, align: "center", valign: "top", margin: 0,
    });
  });
  s.addText("(Optimizely research)", {
    x: 1.076, y: 6.201, w: 2.972, h: 0.18,
    fontFace: FONT_MEDIUM, fontSize: 10, color: C.white, lineSpacing: 13, align: "center", valign: "top", margin: 0,
  });

  // Image, right: Figma's photo spans 845–1920 px wide and the full height above the footer
  addPlaceholder(s, "image", 6.25, 0.35, 6.6, 6.2, { onDark: true /* , path: imagePath */ });

  addFooter(s, { bar: 2 }); // Footer Bar 2: page number
}
```

- Figma draws two large translucent gradient circles behind the photo. Those are the retired "Background Glow Dark 1" circles (removed from the skill on 2026-10-19), so the recipe keeps the background plain Midnight.
- Two figures on the card; for three, use Three-stat callout (recipe 11).
- A cut-out image (product shot, phone mock-ups) takes `fit: "contain"` next to `path:` so nothing is cropped; a full-bleed photo keeps the default fill.

---

## 9. Icon columns

**Figma:** Icon columns `1:324`.

Light mode. Headline, a two-line lead, then two columns: tinted icon tile, subheader, body. For three columns use Numbered columns (recipe 12). Each column is a section, so its tile takes the section colour (`addSectionTile`): green, then pink.

```javascript
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Headline for slide goes here", {
    x: 0.69, y: 0.65, w: 11.48, h: 0.55,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0, valign: "top",
  });
  s.addText("The only platform to seamlessly operate with commerce solution, across any channel to deliver the most robust and personalized experiences for your customers. Plus, we guarantee growth!", {
    x: 0.701, y: 1.278, w: 11.938, h: 0.694,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, lineSpacing: 25, charSpacing: -0.2, margin: 0, valign: "top",
  }); // Figma's -1% tracking kept here: without it the lead wraps to 3 lines. Box 1.5% wider than Figma's 11.764" so Google Slides, which drops the tracking, keeps 2 lines

  // Each column is a section (Figma 1:324: Icon Tile, Tinted): column 1 takes the deck's 1st section colour
  // (green), column 2 the 2nd (pink). If these sections appear elsewhere in the deck, pass their numbers.
  const cols = [
    { icon: "credit_card", section: 0, head: "Subheader placeholder",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { icon: "favorite", section: 1, head: "Subheader placeholder",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  ];

  cols.forEach((c, i) => {
    const x = 0.694 + i * 6.215; // columns at 100px and 995px
    addSectionTile(s, c.icon, x, 2.535, { section: c.section, isDark: false });
    s.addText(c.head, {
      x, y: 3.299, w: 5.729, h: 0.389,
      fontFace: FONT, fontSize: 20, bold: true, color: C.midnight, margin: 0, valign: "top",
    });
    s.addText(c.body, {
      x, y: 3.826, w: 5.208, h: 0.917,
      fontFace: FONT, fontSize: 17, color: C.darkIndigo, lineSpacing: 22.1, margin: 0, valign: "top",
    });
  });

  addFooter(s); // Figma: Footer Bar 1
}
```

---

## 10. Card grid

**Figma:** Card grid A–F (`1:402`, `1:661`, `1:729`, `1:427`, `1:455`, `1:1142`).

Six Figma slides in two layouts. **3 across** (518×600 px cards spanning the content width): A, D, E, F. **4 × 2** (407×285 px cards): B, C.

| Variant | Figma | Slide | Cards | Top of card |
|---|---|---|---|---|
| A | `1:402` | Light (Gray-975) | White, Gray-800 outline | Customer logo |
| B | `1:661` | Light (Gray-975) | White, Groovy Green outline | Pill + heading + body |
| C | `1:729` | Midnight | White, outline colour per column | Pill + heading + body |
| D | `1:427` | Midnight | White, outline colour per card | Icon tile; pill top right |
| E | `1:455` | White | Midnight, no outline | Label + heading + illustration |
| F | `1:1142` | Logo wall (dark) | White, brand card shape, Groovy Green outline | Number badge + heading |

### 3 across (A, D, E, F)

```javascript
{
  const VARIANT = "A"; // A: logo cards (Figma 1:402) · D: icon cards on dark (1:427) · E: dark cards + image (1:455) · F: numbered cards on logo wall (1:1142)
  const isDark = VARIANT === "D" || VARIANT === "F";
  const s = pres.addSlide();
  if (VARIANT === "F") s.background = { path: ASSETS.bgLogoWallDark }; // Background Logo Wall Dark 2
  else s.background = { color: VARIANT === "A" ? C.gray975 : isDark ? C.midnight : C.white };

  if (VARIANT !== "F") { // F has no title in Figma
    s.addText("Three cards", {
      x: 0.69, y: 0.65, w: 9.5, h: 0.55,
      fontFace: FONT, fontSize: 32, bold: true, color: isDark ? C.white : C.midnight, margin: 0, valign: "top",
    });
  }
  if (VARIANT === "D") {
    addPill(s, "Team update 2026", 10.667, 0.646, 1.903, 0.431,
      { fill: C.midnight, line: C.groovyGreen, lineW: 2, color: C.white, fontSize: 12 });
  }

  const cw = 3.597, gap = 0.576, x0 = 0.694;      // 518px cards across 100–1820px
  const cy = VARIANT === "F" ? 1.778 : 1.875;     // 256px / 270px

  // A and D text, one entry per card: intro, bullets, takeaway. The user's words; "" or [] leaves a part out.
  const AD_TEXT = Array.from({ length: 3 }, () => ({
    intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    bullets: ["Lorem ipsum dolor sit amet, consec tetur adipiscing elit.", "Lorem ipsum dolor sit amet, consec tetur adipiscing elit."],
    takeaway: "Main takeaway could go here.",
  }));
  const textW = 2.757, lineH = 16.8 / 72;         // 397px text column, 33.6px lines
  const parts = t => {                            // paragraphs with the space after each (12pt between blocks, 7pt between bullets)
    const ps = [];
    if (t.intro) ps.push({ text: t.intro, after: 12, w: textW });
    t.bullets.forEach((b, j) => ps.push({ text: b, after: j < t.bullets.length - 1 ? 7 : 12, w: textW - 0.25, bullet: true }));
    if (t.takeaway) ps.push({ text: t.takeaway, after: 0, w: textW });
    if (ps.length) ps[ps.length - 1].after = 0;
    return ps;
  };
  const textH = t => parts(t).reduce((h, p) => h + wrapLines(p.text, p.w, { fontSize: 12, fontFace: FONT_MEDIUM }) * lineH + p.after / 72, 0);
  // A and D cards fit their text: the space under the text matches the space above the logo / icon (47 / 55px).
  // All three share the tallest card's height. E and F keep Figma's heights.
  const topPad = VARIANT === "A" ? 0.326 : 0.382;
  const ch = VARIANT === "F" ? 3.368 : VARIANT === "E" ? 4.167 : Math.min(4.167, 1.076 + Math.max(...AD_TEXT.map(textH)) + topPad);

  const D_OUTLINES = [C.groovyGreen, C.piercingPitaya, C.intenseCyan];
  // Each card is a section (Figma 1:427: Icon Tile, Tinted): sections 1–3 are green, pink, teal. The tiles sit on
  // white cards, so they're the light-background Tinted tiles. If these sections appear elsewhere in the deck, pass their numbers.
  const D_TILES = [
    { icon: "credit_card", section: 0 },
    { icon: "favorite", section: 1 },
    { icon: "bar_chart", section: 2 },
  ];
  const E_CARDS = [
    { label: "Everychannel infrastructure", head: "One platform.\nEverychannel." },
    { label: "The Groove Network", head: "The largest enterprise\nsubscription dataset." },
    { label: "Testing velocity", head: "Test faster.\nCompound the wins." },
  ];
  const F_CARDS = [
    "Frictionless experiences.\nSeamlessly integrated.",
    "Hell-bent on driving\nyour growth, profitably.",
    "Unmatched flexibility.\nInfinite possibilities.",
  ];
  const bullet = { bullet: { indent: 9 }, indentLevel: 1, breakLine: true }; // dot at 9pt, text at 18pt

  for (let i = 0; i < 3; i++) {
    const x = x0 + i * (cw + gap);

    if (VARIANT === "E") addCard(s, x, cy, cw, ch, { fill: C.midnight, line: null });
    else addCard(s, x, cy, cw, ch, {
      fill: C.white, lineW: 2, squareTR: VARIANT === "F",
      line: VARIANT === "A" ? C.gray800 : VARIANT === "D" ? D_OUTLINES[i] : C.groovyGreen,
    });

    if (VARIANT === "A" || VARIANT === "D") {
      if (VARIANT === "A") addPlaceholder(s, "logo", x + 0.41, cy + 0.326, 1.542, 0.444); // customer logo, 222×64px
      else addSectionTile(s, D_TILES[i].icon, x + 0.41, cy + 0.382, { section: D_TILES[i].section, isDark: false }); // white card: light
      const ps = parts(AD_TEXT[i]);
      s.addText(ps.map((p, j) => ({ text: p.text, options: {
        ...(p.bullet ? bullet : {}), breakLine: j < ps.length - 1, paraSpaceAfter: p.after,
      } })), {
        x: x + 0.424, y: cy + 1.076, w: textW, h: ch - 1.076 - topPad,
        fontFace: FONT_MEDIUM, fontSize: 12, color: C.darkIndigo, lineSpacing: 16.8, margin: 0, valign: "top",
      });
    }

    if (VARIANT === "E") {
      s.addText(E_CARDS[i].label.toUpperCase(), {
        x: x + 0.375, y: cy + 0.306, w: cw - 0.5, h: 0.208,
        fontFace: FONT, fontSize: 12, bold: true, color: C.groovyGreen, charSpacing: 0.24, margin: 0,
      });
      s.addText(E_CARDS[i].head, {
        x: x + 0.375, y: cy + 0.639, w: 3.236, h: 0.55,
        fontFace: FONT, fontSize: 20.5, bold: true, color: C.white, lineSpacing: 19, margin: 0, valign: "top",
      });
      addPlaceholder(s, "image", x + 0.194, cy + 1.708, cw - 0.389, 2.292, { onDark: true }); // illustration or UI shot
    }

    if (VARIANT === "F") {
      const bd = 0.722, bx = x + (cw - bd) / 2, by = cy + 0.594; // 104px badge image (89px disc + white ring)
      s.addImage({ path: ASSETS.numberBadgeGradient, x: bx, y: by, w: bd, h: bd }); // Number Badge Gradient 1, disc only (76:917)
      s.addText(String(i + 1), { // plain numerals, never 01/02/03
        x: bx, y: by, w: bd, h: bd,
        fontFace: FONT_EXTRA, fontSize: 18, color: C.midnight, align: "center", valign: "middle", margin: 0,
      });
      s.addText(F_CARDS[i], {
        x: x + 0.257, y: cy + 1.542, w: cw - 0.514, h: 1.2,
        fontFace: FONT_SEMI, fontSize: 18, color: C.midnight, lineSpacing: 23.4, align: "center", valign: "top", margin: 0,
      });
    }
  }

  addFooter(s, { bar: VARIANT === "F" ? 2 : 1 }); // Figma: Footer Bar 1 (F: Footer Bar 2, with the slide number)
}
```

- A and D: cards are as tall as their text plus the padding above the logo or icon, repeated below it (47px on A, 55px on D). All three match the tallest card, and they never grow past Figma's 600px. E and F keep Figma's heights.

### 4 × 2 (B, C)

```javascript
{
  const VARIANT = "B"; // B: light, all Groovy Green (Figma 1:661) · C: dark, colour per column (Figma 1:729)
  const isDark = VARIANT === "C";
  const s = pres.addSlide();
  s.background = { color: isDark ? C.midnight : C.gray975 };

  s.addText("Eight cards", {
    x: 0.69, y: 0.65, w: 11.48, h: 0.55,
    fontFace: FONT, fontSize: 32, bold: true, color: isDark ? C.white : C.midnight, margin: 0, valign: "top",
  });

  const COLS = isDark
    ? [C.groovyGreen, C.intenseCyan, C.piercingPitaya, C.laserLemon]
    : [C.groovyGreen, C.groovyGreen, C.groovyGreen, C.groovyGreen];
  const cards = Array.from({ length: 8 }, () => ({
    tag: "Early access",
    head: "At-risk payment banner",
    body: "Catch subscribers before they're lost to payment issues with gentle on-site alerts the moment they return.",
  }));
  const cw = 2.826, ch = 1.979;                 // 407×285px
  const gapX = 0.213, gapY = 0.264;             // 4 cards span 100–1820px; rows 38px apart
  const x0 = 0.694, y0 = 1.743;                 // 100,251px

  cards.forEach((c, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = x0 + col * (cw + gapX), y = y0 + row * (ch + gapY);
    addCard(s, x, y, cw, ch, { fill: C.white, line: COLS[col], lineW: 0.65, r: 0.181 });
    addPill(s, c.tag.toUpperCase(), x + 0.299, y + 0.25, 0.979, 0.181,
      { fill: COLS[col], color: C.midnight, fontSize: 6.5, charSpacing: 0.78 });
    s.addText(c.head, {
      x: x + 0.299, y: y + 0.646, w: 2.319, h: 0.19,
      fontFace: FONT, fontSize: 9.7, bold: true, color: C.midnight, margin: 0, valign: "top",
    });
    s.addText(c.body, {
      x: x + 0.299, y: y + 0.924, w: 2.319, h: 0.55,
      fontFace: FONT, fontSize: 9.7, color: C.midnight, lineSpacing: 13, margin: 0, valign: "top",
    });
  });

  addFooter(s); // Figma: Footer Bar 1
}
```

- **Text sizes on B/C are small by design** (6.5 pt pill, 9.7 pt body). Keep card copy to a heading and about 15 words. For more text, use 3 across.
- A's first card has a square top-right corner in Figma while the other two are rounded. That's treated as a slip: all three are rounded.
- E's illustrations (channel diagram, globe, growth chart) are slide content, not bundled assets: placeholders.
- F's background is a wall of 62 customer logos, white at 40% on Midnight ("Background Logo Wall Dark 2", `81:911`), built from Cameron's Top 100 Customers list. Use it only where showing those logos is approved. One fixed wall for now; per-industry walls are an open question.

---

## 11. Three-stat callout

**Figma:** Three-stat callout `1:973`.

Light mode (Gray-975). Three (or four) white cards, each with a large figure on a gradient highlight bar, an ALL CAPS subhead and a short body. An outline pill top right holds a date or team label. Figures are 50 pt and shrink to fit their card ("Billions", "5,000+"); the highlight is drawn at the figure's own width.

```javascript
{
  const s = pres.addSlide();
  s.background = { color: C.gray975 };

  s.addText("3 cards", {
    x: 0.694, y: 0.646, w: 9.5, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
  });
  addPill(s, "Team Update 2026", 10.667, 0.646, 1.903, 0.431, // Outline Pill Light 1: 274×62 px at 1536,93
    { fill: C.white, line: C.groovyGreen, lineW: 2, color: C.midnight, fontSize: 12 });

  // 3 stats as designed, or 4 (cards narrow to fit). Text as given; leave head or body "" to drop it.
  const stats = [
    { num: "XX%", head: "Subhead goes here", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { num: "XX%", head: "Subhead goes here", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { num: "XX%", head: "Subhead goes here", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  ];
  const n = stats.length;                              // 3 or 4
  const ch = 4.167, cy = 1.876;                       // 600 px tall cards at y 270
  const gap = n === 3 ? 0.578 : 0.4;
  const cw = n === 3 ? 3.599 : (11.933 - gap * 3) / 4; // 518 px as designed; 4 across the same 100–1818 px
  const pad = 0.34, inner = cw - 2 * pad;
  stats.forEach((st, i) => {
    const x = n === 3 ? [0.694, 4.875, 9.028][i] : 0.694 + i * (cw + gap); // 100, 702, 1300 px
    addCard(s, x, cy, cw, ch, { fill: C.white, line: C.gray800, lineW: 2, r: 0.153 }); // Card Light 1
    const size = fitFontSize(st.num, inner, { max: 50, min: 28, bold: true, charSpacing: -0.5 });
    const figW = textWidth(st.num, { fontSize: size, bold: true, charSpacing: -0.5 * size / 50 });
    // Gradient Highlight 1 (234×28 px under "XX%"), redrawn at the figure's width + 8%
    addGradientHighlight(s, x + pad - 0.014, 3.382, Math.min(inner, Math.max(0.35, figW * 1.08)));
    s.addText(st.num, {
      x: x + pad, y: 2.833 + (50 - size) * 0.0132, w: inner + 0.1, h: 0.688, // smaller figures keep their baseline on the highlight
      fontFace: FONT, fontSize: size, bold: true, color: C.midnight, lineSpacing: size * 1.15, charSpacing: -0.5 * size / 50, valign: "top", margin: 0,
    }); // 100 px; the highlight sits under its baseline
    if (st.head) s.addText(st.head.toUpperCase(), {
      x: x + 0.354, y: 3.878, w: cw - 0.65, h: 0.208,
      fontFace: FONT, fontSize: 12, bold: true, color: C.midnight, lineSpacing: 15, charSpacing: 0.36, valign: "top", margin: 0,
    });
    if (st.body) s.addText(st.body, {
      x: x + 0.361, y: st.head ? 4.33 : 3.95, w: cw - 0.82, h: 1.25,
      fontFace: FONT, fontSize: 12, color: C.darkIndigo, lineSpacing: 15.6, charSpacing: -0.12, valign: "top", margin: 0,
    });
  });

  addFooter(s); // Footer Bar 1
}
```

- Body: about 20 words (4 lines) in 3 cards, about 14 words in 4. The pill is optional; delete it if there's no label.
- Figures shrink from 50 pt to fit the card (`fitFontSize`), down to 28 pt; past that, the figure is too long for a stat card. The highlight follows the figure's width, so "1", "23" and "Billions" each get a bar that fits.
- The subhead is set in caps as designed. When the user gave the subhead text and it isn't a label, keep its case: drop `.toUpperCase()`.
- Four figures in a strip, as on a logo or credentials slide: `addStatStrip()` (build.js).

---

## 12. Numbered columns

**Figma:** Numbered columns `1:341` (named "Percentage callout (3-col)" before 2026-10-20).

Light mode. Headline, a two-line lead, then three columns: a Green figure (a numeral or a percentage), a subheader and a body. Figures are 25 pt; up to about 6 characters ("72%", "3.2x", "$1.4M").

```javascript
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("3 columns headline for slide goes here", {
    x: 0.694, y: 0.646, w: 11.479, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
  });
  s.addText("The only platform to seamlessly operate with commerce solution, across any channel to deliver the most robust and personalized experiences for your customers. Plus, we guarantee growth!", {
    x: 0.701, y: 1.278, w: 11.875, h: 0.694,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, lineSpacing: 25, charSpacing: -0.2, valign: "top", margin: 0,
  });

  const cols = [
    { num: "1", head: "Subheader placeholder", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { num: "2", head: "Subheader placeholder", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { num: "3", head: "Subheader placeholder", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  ];
  cols.forEach((c, i) => {
    const x = [0.694, 4.833, 8.972][i]; // columns at 100, 696, 1292 px, 527 px wide
    s.addText(c.num, { // plain numerals, never 01/02/03. Green numerals on light: #009A50 (green rule)
      x, y: 2.528, w: 3.66, h: 0.486,
      fontFace: FONT, fontSize: 25, bold: true, color: C.green, lineSpacing: 35, valign: "top", margin: 0,
    });
    s.addText(c.head, {
      x, y: 3.132, w: 3.66, h: 0.389,
      fontFace: FONT, fontSize: 20, bold: true, color: C.midnight, lineSpacing: 28, valign: "top", margin: 0,
    });
    s.addText(c.body, {
      x, y: 3.715, w: 3.66, h: 1.222,
      fontFace: FONT, fontSize: 17, color: C.darkIndigo, lineSpacing: 22.1, charSpacing: -0.17, valign: "top", margin: 0,
    });
  });

  addFooter(s); // Footer Bar 1
}
```

- Body: about 20 words (4 lines). For two columns with icons, use Icon columns (recipe 9).

---

## 13. Big number

**Figma:** Big number A `1:1065`, B `1:1071`.

One huge figure with a one-line quote under it, on a large card. **A**: cyan → lemon gradient card, Midnight text. **B**: Midnight card, Groovy Green figure, date label.

```javascript
{
  const VARIANT = "A"; // A: gradient card (Figma 1:1065) · B: Midnight card + date label (Figma 1:1071)
  const isDark = VARIANT === "B";
  const s = pres.addSlide();
  s.background = { color: C.white };

  const x = 0.91, y = 0.653, w = 11.514, h = 5.493; // 1658×791px card at 131,94px
  if (isDark) addCard(s, x, y, w, h, { fill: C.midnight, line: null, r: 0.069 });
  else s.addImage({ path: ASSETS.largeCardGradient, x, y, w, h }); // Large Card Gradient 1 (aspect-locked)

  s.addText(isDark ? "$40,000,000" : "$25 billion", {
    x, y: 2.438, w, h: 1.389,
    fontFace: FONT, fontSize: 80, bold: true, color: isDark ? C.groovyGreen : C.midnight,
    align: "center", valign: "middle", margin: 0,
  });
  if (isDark) {
    s.addText("December 2023".toUpperCase(), {
      x, y: 4.285, w, h: 0.208,
      fontFace: FONT, fontSize: 12, bold: true, color: C.groovyGreen, charSpacing: 0.36, align: "center", margin: 0,
    });
  }
  s.addText("“We are aiming to exit 2024 with repeatable $3M quarters.”", {
    x: 1.514, y: isDark ? 4.674 : 4.188, w: 10.313, h: 0.347,
    fontFace: FONT_MEDIUM, fontSize: 20, color: isDark ? C.white : C.darkIndigo, align: "center", valign: "top", margin: 0,
  });

  addFooter(s); // Figma: Footer Bar 1
}
```

- The figure is 80 pt; about 11 characters fit ("$40,000,000"). For longer figures, shorten ("$40M") rather than shrink.
- Quote: one line, about 60 characters.

---

## 14. Chart (bar)

**Figma:** Chart (bar) `1:1411`.

Light mode, laid out exactly like Chart (line): title and subhead top left, supporting points in the left column, the column chart on the right with its legend above. Categories × series, bars side by side, a value label above each bar. Series colours follow `C.chart`: N series use the first N.

**Two builds, chosen by app (Cameron, 2026-10-19):**

- **Default: native shapes** (`drawBarChart`). Gridlines, bars and labels are separate shapes, placed from the data. Looks the same in Google Slides, PowerPoint and Keynote. To change the numbers, rebuild the slide.
- **`POWERPOINT = true`: a native PowerPoint chart** (`addChart`). Only when the user explicitly says the deck is for PowerPoint. Editable there (right-click › Edit Data); Google Slides turns it into a fixed picture and Keynote drops it.

```javascript
{
  const POWERPOINT = false; // true only when the user explicitly says PowerPoint (see SKILL.md "Charts")
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Bar Graph", {
    x: 0.694, y: 0.646, w: 11.479, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight,
    lineSpacing: 35.5, valign: "top", margin: 0,
  });
  s.addText("Subhead", {
    x: 0.701, y: 1.278, w: 5.861, h: 0.347,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight,
    lineSpacing: 25, valign: "top", margin: 0,
  });

  // Supporting points: 30 px body, 24 px sub-point, 30 px between items
  s.addText([
    { text: "Light text can go here.", options: { bullet: { indent: 12 }, breakLine: true } },
    { text: "Light text can go here.", options: { bullet: { indent: 12 }, breakLine: true } },
    { text: "Light text can go here.", options: { bullet: { indent: 12 }, indentLevel: 1, fontSize: 12, lineSpacing: 15 } },
  ], {
    x: 1.069, y: 2.153, w: 5.6, h: 2.2,
    fontFace: FONT_MEDIUM, fontSize: 15, color: C.darkIndigo,
    lineSpacing: 18.75, paraSpaceAfter: 15, valign: "top", margin: 0,
  });

  // Figma's bars: three pairs, $25/$33, $42/$57, $78/$103
  const labels = ["000", "000", "000"];
  const series = [
    { name: "Key Item", values: [25, 42, 78] },
    { name: "Key Item", values: [33, 57, 103] },
  ];
  const colors = C.chart.slice(0, series.length);

  // Legend, top right: 22 px swatch + label, 37 px apart
  series.forEach((sr, i) => {
    const y = 1.153 + i * 0.257;
    s.addShape("rect", { x: 10.931, y, w: 0.153, h: 0.153, fill: { color: colors[i] }, line: { type: "none" } });
    s.addText(sr.name, {
      x: 11.201, y: y - 0.01, w: 1.9, h: 0.174,
      fontFace: FONT, fontSize: 10, color: C.darkIndigo, valign: "middle", margin: 0,
    });
  });

  // Value axis: a round max and step that fit the data (here $0–$120 in steps of $20)
  const { max, step } = niceAxis(Math.max(...series.flatMap(sr => sr.values)));

  if (!POWERPOINT) {
    // Plot area = Figma's gridlines, 1095–1814 × 316–862 px. Labels and axis title sit outside it.
    drawBarChart(s, {
      x: 7.604, y: 2.194, w: 4.993, h: 3.792,
      labels, series, colors, max, step,
      format: v => `$${v}`, axisTitle: "ARR ($MM)",
    });
  } else {
    // Same chart box and plot-area layout as Chart (line)'s PowerPoint build.
    s.addChart(pres.charts.BAR, series.map(sr => ({ name: sr.name, labels, values: sr.values })), {
      x: 6.597, y: 2.014, w: 6.181, h: 4.41,
      layout: { x: 0.1629, y: 0.0409, w: 0.8079, h: 0.8598 },
      barDir: "col", barGapWidthPct: 110,
      chartColors: colors,
      valAxisMinVal: 0, valAxisMaxVal: max, valAxisMajorUnit: step, valAxisLabelFormatCode: "$0",
      valAxisLabelColor: C.soft, valAxisLabelFontFace: FONT_MEDIUM, valAxisLabelFontSize: 10,
      valAxisLineShow: false, valAxisMajorTickMark: "none",
      showValAxisTitle: true, valAxisTitle: "ARR ($MM)",
      valAxisTitleColor: C.darkIndigo, valAxisTitleFontFace: FONT_SEMI, valAxisTitleFontSize: 12,
      valGridLine: { color: C.gray800, size: 0.5 },
      catAxisLabelColor: C.soft, catAxisLabelFontFace: FONT_SEMI, catAxisLabelFontSize: 10,
      catAxisLineShow: true, catAxisLineColor: C.midnight, catAxisLineSize: 1, catAxisMajorTickMark: "none",
      catGridLine: { style: "none" },
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "$0",
      dataLabelColor: C.midnight, dataLabelFontFace: FONT_SEMI, dataLabelFontSize: 12,
      showLegend: false,
    });
  }

  addFooter(s); // Footer Bar 1
}
```

- Figma's bar slide is Intense Cyan + Groovy Green. The recipe uses `C.chart` order (Groovy Green, then Midnight), like Chart (line) and the donut, because DECISIONS §5 says the chart recipes take `C.chart`. To match the Figma slide exactly, set `colors = [C.intenseCyan, C.groovyGreen]`.
- Figma puts one `000` label under each bar; the recipe puts one label under each pair (a category), as a chart would.
- A control or baseline series keeps its `C.chart` colour (Midnight next to Groovy Green); there's no muted grey for it (Cameron, 2026-10-20).

---

## 15. Chart (line)

**Figma:** Chart (line) `58:874`.

Light mode, laid out like Chart (bar). Title and subhead top left, supporting points in the left column, and the line chart on the right with its legend above. Series colours follow `C.chart`: N series use the first N. There are no data labels; the gridlines carry the values.

**Two builds, chosen by app (Cameron, 2026-10-19):**

- **Default: native shapes** (`drawLineChart`). Gridlines, lines, markers and labels are separate shapes, placed from the data. The chart looks the same in Google Slides, PowerPoint and Keynote. To change the numbers, rebuild the slide.
- **`POWERPOINT = true`: a native PowerPoint chart** (`addChart`). Use this only when the user explicitly says the deck is for PowerPoint, not Google Slides or Keynote. It's editable in PowerPoint (right-click › Edit Data). Google Slides turns it into a fixed, low-resolution picture, and Keynote doesn't show it at all.

```javascript
{
  const POWERPOINT = false; // true only when the user explicitly says PowerPoint (see SKILL.md "Charts")
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Line Graph", {
    x: 0.694, y: 0.646, w: 11.479, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight,
    lineSpacing: 35.5, valign: "top", margin: 0,
  });
  s.addText("Subhead", {
    x: 0.701, y: 1.278, w: 5.861, h: 0.347,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight,
    lineSpacing: 25, valign: "top", margin: 0,
  });

  // Supporting points: 30 px body, 24 px sub-point, 30 px between items
  s.addText([
    { text: "Light text can go here.", options: { bullet: { indent: 12 }, breakLine: true } },
    { text: "Light text can go here.", options: { bullet: { indent: 12 }, breakLine: true } },
    { text: "Light text can go here.", options: { bullet: { indent: 12 }, indentLevel: 1, fontSize: 12, lineSpacing: 15 } },
  ], {
    x: 1.069, y: 2.153, w: 5.6, h: 2.2,
    fontFace: FONT_MEDIUM, fontSize: 15, color: C.darkIndigo,
    lineSpacing: 18.75, paraSpaceAfter: 15, valign: "top", margin: 0,
  });

  const labels = ["000", "000", "000", "000", "000", "000"];
  const series = [
    { name: "Key Item", values: [25, 33, 42, 57, 78, 103] },
    { name: "Key Item", values: [15, 19, 26, 31, 37, 45] },
  ];
  const colors = C.chart.slice(0, series.length);

  // Legend, top right: 22 px swatch + label, 37 px apart
  series.forEach((sr, i) => {
    const y = 1.153 + i * 0.257;
    s.addShape("rect", { x: 10.931, y, w: 0.153, h: 0.153, fill: { color: colors[i] }, line: { type: "none" } });
    s.addText(sr.name, {
      x: 11.201, y: y - 0.01, w: 1.9, h: 0.174,
      fontFace: FONT, fontSize: 10, color: C.darkIndigo, valign: "middle", margin: 0,
    });
  });

  // Value axis: a round max and step that fit the data (here $0–$120 in steps of $20)
  const { max, step } = niceAxis(Math.max(...series.flatMap(sr => sr.values)));

  if (!POWERPOINT) {
    // Plot area = Figma's gridlines, 1095–1814 × 316–862 px. Labels and axis title sit outside it.
    drawLineChart(s, {
      x: 7.604, y: 2.194, w: 4.993, h: 3.792,
      labels, series, colors, max, step,
      format: v => `$${v}`, axisTitle: "ARR ($MM)",
    });
  } else {
    // Chart box 950,290 → 1840,925 px holds the axis labels and axis title.
    // layout = the plot area, matched to Figma's gridlines (1095–1814 × 316–862 px).
    s.addChart(pres.charts.LINE, series.map(sr => ({ name: sr.name, labels, values: sr.values })), {
      x: 6.597, y: 2.014, w: 6.181, h: 4.41,
      layout: { x: 0.1629, y: 0.0409, w: 0.8079, h: 0.8598 },
      chartColors: colors,
      lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 9,
      valAxisMinVal: 0, valAxisMaxVal: max, valAxisMajorUnit: step, valAxisLabelFormatCode: "$0",
      valAxisLabelColor: C.soft, valAxisLabelFontFace: FONT_MEDIUM, valAxisLabelFontSize: 10,
      valAxisLineShow: false, valAxisMajorTickMark: "none",
      showValAxisTitle: true, valAxisTitle: "ARR ($MM)",
      valAxisTitleColor: C.darkIndigo, valAxisTitleFontFace: FONT_SEMI, valAxisTitleFontSize: 12,
      valGridLine: { color: C.gray800, size: 0.5 },
      catAxisLabelColor: C.soft, catAxisLabelFontFace: FONT_SEMI, catAxisLabelFontSize: 10,
      catAxisLineShow: true, catAxisLineColor: C.midnight, catAxisLineSize: 1, catAxisMajorTickMark: "none",
      catGridLine: { style: "none" },
      showLegend: false,
    });
  }

  addFooter(s); // Footer Bar 1
}
```

---

## 16. Chart (pie / donut)

**Figma:** Chart (pie / donut) A `1:174`, B `1:1349`.

Light mode. A donut ring built from native arc shapes, one per slice (inner radius 75%), in `C.chart` order. **A**: percentage labels outside the ring on leader lines, legend top right. **B**: a stat in the centre of the ring. `1:1349` is Figma's colour-reference sheet (8 donuts); B takes its centre-stat donut and scales it to A's 630 px ring.

**Always tell the user** when you deliver a deck with this slide: the donut is drawn from shapes, not a chart, so the easiest way to change the numbers is to ask Claude to rebuild the slide with the new values. (Why shapes: Keynote drops pptxgenjs charts entirely; arc shapes show in Google Slides, PowerPoint and Keynote. Tested 2026-10-19.)

```javascript
{
  const VARIANT = "A"; // A: labels outside + legend (Figma 1:174) · B: centre stat (Figma 1:1349)
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Pie chart", {
    x: 0.69, y: 0.65, w: 11.48, h: 0.55,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0, valign: "top",
  });
  s.addText("Subhead", {
    x: 0.7, y: 1.28, w: 5.86, h: 0.35,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight, margin: 0, valign: "top",
  });

  // One entry per slice, biggest first. Colours follow C.chart: N slices use the first N.
  const slices = VARIANT === "A"
    ? [31, 15, 23, 11, 8, 5, 7].map(value => ({ label: "Key item", value }))
    : [75, 25].map(value => ({ label: "Key item", value }));
  const total = slices.reduce((sum, sl) => sum + sl.value, 0);
  const colors = C.chart.slice(0, slices.length);
  const startAng = VARIANT === "A" ? 30 : 90; // first slice starts here (degrees clockwise from 12 o'clock), as in Figma

  // Ring: 630px at 645,225; inner radius 75% of outer
  const d = 4.375, cx = 4.479 + d / 2, cy = 1.563 + d / 2;
  // One native arc shape per slice, clockwise from startAng. Not a chart object:
  // to change values, rebuild the slide (tell the user, see above).
  const norm = a => ((a % 360) + 360) % 360;
  let from = 0;
  slices.forEach((sl, i) => {
    const a0 = startAng + from / total * 360;
    const a1 = sl.value >= total ? a0 + 359.99 : startAng + (from + sl.value) / total * 360;
    from += sl.value;
    s.addShape("blockArc", {
      x: cx - d / 2, y: cy - d / 2, w: d, h: d,
      angleRange: [norm(a0 - 90), norm(a1 - 90)], // blockArc angles start at 3 o'clock
      arcThicknessRatio: 0.25,                    // ring = outer 25% of the radius (Figma innerRadius 0.75)
      fill: { color: colors[i] }, line: { type: "none" },
    });
  });

  if (VARIANT === "A") {
    // Leader line: dot on the ring → elbow → short horizontal → label
    const seg = (a, b) => s.addShape("line", {
      x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y),
      flipV: (b.x - a.x) * (b.y - a.y) < 0, line: { color: C.gray700, width: 1 },
    });
    let acc = 0;
    slices.forEach(sl => {
      const a = (startAng / 360 + (acc + sl.value / 2) / total) * 2 * Math.PI; // clockwise from 12 o'clock
      acc += sl.value;
      const sin = Math.sin(a), cos = Math.cos(a), right = sin >= 0;
      const p1 = { x: cx + d * 0.4375 * sin, y: cy - d * 0.4375 * cos };       // middle of the ring
      const p2 = { x: cx + (d / 2 + 0.22) * sin, y: cy - (d / 2 + 0.22) * cos };
      const p3 = { x: p2.x + (right ? 0.45 : -0.45), y: p2.y };
      seg(p1, p2);
      seg(p2, p3);
      s.addShape("ellipse", { x: p1.x - 0.028, y: p1.y - 0.028, w: 0.056, h: 0.056, fill: { color: C.gray700 }, line: { type: "none" } });
      s.addText(`${Math.round(sl.value / total * 100)}%`, {
        x: right ? p3.x + 0.08 : p3.x - 1.18, y: p3.y - 0.18, w: 1.1, h: 0.36,
        fontFace: FONT, fontSize: 20, bold: true, color: C.midnight,
        align: right ? "left" : "right", valign: "middle", margin: 0,
      });
    });
  } else {
    // Centre stat: 1:1349's first donut scaled ×2.21 (285px → 630px ring)
    s.addText(`${Math.round(slices[0].value / total * 100)}%`, {
      x: cx - 1.4, y: 2.93, w: 2.8, h: 0.8,
      fontFace: FONT, fontSize: 50, bold: true, color: C.midnight, align: "center", valign: "top", margin: 0,
    });
    s.addText("Subhead goes here".toUpperCase(), {
      x: cx - 1.4, y: 3.76, w: 2.8, h: 0.21,
      fontFace: FONT, fontSize: 12, bold: true, color: C.midnight, charSpacing: 0.36, align: "center", margin: 0,
    });
    s.addText("One short supporting sentence, two lines at most.", {
      x: cx - 1.15, y: 4.14, w: 2.3, h: 0.5,
      fontFace: FONT, fontSize: 10, color: C.midnight, lineSpacing: 13, align: "center", valign: "top", margin: 0,
    });
  }

  // Legend: always on A; on B only when there are more than two slices
  if (VARIANT === "A" || slices.length > 2) {
    slices.forEach((sl, i) => {
      const y = 1.153 + i * 0.2625;
      s.addShape("rect", { x: 10.931, y, w: 0.153, h: 0.153, fill: { color: colors[i] }, line: { type: "none" } });
      s.addText(sl.label, {
        x: 11.201, y: y - 0.01, w: 1.9, h: 0.174,
        fontFace: FONT, fontSize: 10, color: C.darkIndigo, charSpacing: 0.1, valign: "middle", margin: 0,
      });
    });
  }

  addFooter(s); // Figma: Footer Bar 1
}
```

- The red "Will create editable GSlides" badge on both Figma slides is a designer note. Leave it out.
- Up to 8 slices (the length of `C.chart`). Above 6, labels on the left can crowd; merge small slices into "Other".
- Figma draws the `XX%` labels in Soleil; the recipe uses Figtree (Soleil is forbidden).

---

## 17. Table

**Figma:** Table A `1:923`, B `1:860`.

Light mode. A native PowerPoint table: Midnight rule under the header row, Gray-950 shading on even rows, and one highlighted row on a gradient outline. **A**: up to 4 rows, 0.86 in tall. **B**: 5–6 rows, 0.64 in tall. The row count picks the row height and the outline image. Columns of numbers are right-aligned (header too); a cell that spans columns is left-aligned. Optional: an assumptions strip above the table and a footnote under it.

```javascript
{
  const VARIANT = "A"; // A: up to 4 rows (Figma 1:923) · B: 5–6 rows (Figma 1:860)
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Sample table", {
    x: 0.69, y: 0.65, w: 11.48, h: 0.55,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0, valign: "top",
  });
  s.addText("Subhead", {
    x: 0.7, y: 1.28, w: 5.86, h: 0.35,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, margin: 0, valign: "top",
  });

  // Cells are the user's text, as given (header case included). A cell can be { text, colspan: 4 } to span columns.
  const header = ["", "Title 1", "Title 2", "Title 3", "Title 4"];
  const body = Array.from({ length: VARIANT === "A" ? 4 : 6 }, (_, i) =>
    [`Row ${i + 1} title`, "Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"]);
  const highlight = VARIANT === "A" ? 3 : 1; // index into body; -1 for no highlighted row
  // Optional assumptions strip above the table: { label: "Base case assumptions", items: ["…", "…"] }.
  // An item can be text runs, to keep the user's bold figures: [{ text: "12.4", options: { bold: true } }, { text: " checkouts / day" }]
  const assumptions = null;
  const footnote = "";                        // optional line under the table, as given

  const x = 0.694;                                   // 100px
  let y = 2.014;                                     // 290px
  if (assumptions) { // Gray-950 band: caps label, then the items in equal columns
    const bh = 0.6, lw = 1.35, iw = (11.944 - lw - 0.3) / assumptions.items.length;
    addCard(s, x, y, 11.944, bh, { fill: C.gray950, line: C.gray800, lineW: 1, r: 0.104 });
    s.addText(assumptions.label.toUpperCase(), { x: x + 0.2, y, w: lw - 0.2, h: bh, fontFace: FONT, fontSize: 9.5, bold: true, color: C.midnight, charSpacing: 0.28, valign: "middle", margin: 0 });
    assumptions.items.forEach((it, i) => s.addText(it, {
      x: x + lw + 0.1 + i * iw, y, w: iw - 0.15, h: bh,
      fontFace: FONT, fontSize: 11, color: C.midnight, valign: "middle", margin: 0,
    }));
    y += bh + 0.25;
  }
  const colW = [2.41, 2.384, 2.384, 2.384, 2.384];   // 347px label column + 4 × 343px = 1720px
  const headH = 0.472;                               // 68px
  const rowH = body.length <= 4 ? 0.861 : 0.639;     // 124px or 92px

  // Number columns (every filled body cell a figure: "97K", "$2.4M", "3.5%", "1 in 41") are right-aligned.
  const cellText = c => (c && typeof c === "object" ? c.text : c) ?? "";
  const isNum = t => /^[~≈+\-−]?[$€£]?\d[\d.,]*\s*(%|[KMB]|x|\+|bn|m|k)?$/i.test(String(t).trim());
  const numCol = header.map((_, ci) => ci > 0 && body.every(r => r.length !== header.length || cellText(r[ci]) === "" || isNum(cellText(r[ci]))));

  // Gradient outline behind the highlighted row. Image (incl. its shadow), aspect-locked:
  // one asset per row height. The outline is 1781px wide, centred on the 1720px table.
  if (highlight >= 0) {
    const tall = rowH > 0.7;
    const outH = tall ? 0.847 : 0.736;               // 122px / 106px outline
    let oy = y + headH + highlight * rowH + (rowH - outH) / 2;
    if (highlight === 0) oy = Math.max(oy, y + headH + 0.04); // first row: keep the outline off the header rule
    s.addImage({
      path: tall ? ASSETS.tableHighlightRow1 : ASSETS.tableHighlightRow2, // Table Highlight Row 1 / 2
      x: x - 0.379, y: oy - 0.069, w: 12.701, h: outH + 0.333,           // + shadow: 24px sides, 10px top, 38px bottom
    });
  }

  const NONE = { type: "none" };
  const headRow = header.map((text, ci) => ({ text, options: {
    fontFace: FONT_SEMI, color: C.midnight, align: ci === 0 ? "left" : numCol[ci] ? "right" : "center",
    border: [NONE, NONE, { pt: 1.5, color: C.midnight }, NONE],
  } }));
  const bodyRows = body.map((row, ri) => {
    let ci = 0;
    return row.map(cell => {
      const hi = ri === highlight, span = typeof cell === "object" && cell ? cell.colspan || 1 : 1;
      const col = ci; ci += span;
      return { text: cellText(cell), options: {
        ...(span > 1 ? { colspan: span } : {}),
        fontFace: hi ? FONT : (col === 0 ? FONT_SEMI : FONT),
        bold: hi,
        color: hi ? C.midnight : C.darkIndigo,
        align: col === 0 || span > 1 ? "left" : numCol[col] ? "right" : "center",
        // Shade even rows; odd rows and the highlight stay unfilled so the outline's shadow shows
        fill: !hi && ri % 2 === 1 ? { color: C.gray950 } : undefined,
        border: [NONE, NONE, NONE, NONE],
      } };
    });
  });

  s.addTable([headRow, ...bodyRows], {
    x, y, w: 11.944, colW, rowH: [headH, ...body.map(() => rowH)],
    fontFace: FONT, fontSize: 12, valign: "middle", margin: [0, 0.104, 0, 0.104],
  });
  if (footnote) s.addText(footnote, {
    x: x + 0.104, y: y + headH + body.length * rowH + 0.15, w: 11.7, h: 0.22,
    fontFace: FONT, fontSize: 10, color: C.soft, valign: "top", margin: 0,
  });

  addFooter(s, { bar: 3 }); // Footer Bar 3
}
```

- Five columns as designed (label + 4). For fewer columns, keep the 2.41 in label column and share the remaining 9.534 in equally.
- Up to 3 rows with an assumptions strip and a footnote in A; B's 6 rows leave no room for the strip.
- A column counts as numbers when every filled body cell in it is a figure; rows with a spanning cell don't count. Spanning cells are left-aligned so a long sentence reads normally.
- The strip label is set in caps (it's a section label); every item stays as given.
- `1:923`'s header reads "Title 1, Title 1, Title 2, Title 3"; the recipe numbers them 1–4.

---

## 18. Before / after comparison

**Figma:** Before / after comparison A `1:797` (two checklists) and B `1:1173` (two cards).

**A**: light mode, two columns under a heavy Midnight rule: green check marks for the Ordergroove way on the left, red crosses for the alternative on the right, one row highlighted on a gradient outline. Footer Bar 3. **B**: Gray-975, a plain card ("before") and a gradient-outline card ("after") joined by a plus sign, each with a heading and a one-line description underneath. The cards hold a screenshot or illustration (placeholders).

```javascript
{
  const VARIANT = "A"; // A: check / cross lists (Figma 1:797) · B: two cards (Figma 1:1173)
  const s = pres.addSlide();
  s.background = { color: VARIANT === "A" ? C.white : C.gray975 };

  if (VARIANT === "A") {
    s.addText("Sample comparison slide", {
      x: 0.692, y: 0.649, w: 11.479, h: 0.493,
      fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
    });
    s.addText("Subhead", {
      x: 0.703, y: 1.281, w: 5.861, h: 0.347,
      fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, lineSpacing: 25, valign: "top", margin: 0,
    });

    const heads = ["Integrated checkout", "Separate checkout"];
    const rows = [
      ["Full checkout process on your site for a seamless customer experience", "Customers go to a different webpage to complete checkout, increasing risk of drop-off"],
      ["Clear conversion tracking and reporting to understand the ROI of various channels", "Loss of conversion tracking and complete reporting prevents understanding of channel performance"],
      ["Singular product catalog and discount codes to maintain", "Duplicative maintenance of product catalogs and discount codes"],
      ["Less support tickets, operational inefficiency, and development work", "More support tickets, backend inefficiency, and development work to address errors"],
    ];
    const highlight = 2;                          // row index on the gradient outline; -1 for none
    const colX = [0.692, 6.946], colW = 5.693;    // columns at 100 and 1000 px, 820 px wide
    const rowTop = 2.479, rowH = 0.833;           // 120 px rows from 357 px

    heads.forEach((h, c) => s.addText(h, {
      x: [0.847, 7.174][c], y: 2.028, w: 5.0, h: 0.264,
      fontFace: FONT_SEMI, fontSize: 15, color: C.midnight, lineSpacing: 18.75, valign: "top", margin: 0,
    }));
    s.addShape("line", { x: 0.75, y: 2.417, w: 11.889, h: 0, line: { color: C.midnight, width: 2.5 } }); // Divider Dark 1: 5 px

    // Row rules (Divider Light 1: 2 px Gray-800) under each row
    rows.forEach((_, i) => colX.forEach(x => s.addShape("line", {
      x, y: rowTop + (i + 1) * rowH - 0.003, w: colW, h: 0, line: { color: C.gray800, width: 1 },
    })));
    // Highlighted row: Gradient Outline Card 1 (846×122 px), over the rules
    if (highlight >= 0) addGradientShape(s, "gradientOutlineCard1", 0.604, rowTop + highlight * rowH - 0.02, 5.875, 0.847);

    rows.forEach((pair, i) => {
      const cy = rowTop + i * rowH + rowH / 2;
      pair.forEach((text, c) => {
        addIcon(s, c === 0 ? "check_circle" : "cancel", [0.833, 7.181][c], cy - 0.139, 0.278, c === 0 ? C.green : C.radiantRadish); // 40 px icons; green icons on light are #009A50
        s.addText(text, {
          x: [1.328, 7.647][c], y: cy - rowH / 2, w: 4.894, h: rowH, // 705 px: one-line rows stay on one line
          fontFace: FONT, fontSize: 12, color: C.darkIndigo, lineSpacing: 15.6, charSpacing: -0.12, valign: "middle", margin: 0,
        });
      });
    });
    addFooter(s, { bar: 3 }); // Footer Bar 3
  } else {
    s.addText("The relationship commerce movement", {
      x: 0.694, y: 0.646, w: 11.479, h: 0.493,
      fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
    });
    // Before: plain card, 654×492 px at 104,253, with a screenshot inside
    addCard(s, 0.722, 1.757, 4.542, 3.417, { fill: C.white, line: C.gray800, lineW: 1, r: 0.222, shadow: figmaShadow(80.6, 32.2, 0.2, C.midnight) }); // Figma: 0,32 blur 81, #0A0922 at 45%; 20% looks the same in slides
    addPlaceholder(s, "image", 1.111, 2.146, 3.118, 2.319, { shape: "round", r: 0.08 /* , path: screenshotPath */ });
    // After: Gradient Outline Card 3, 959×492 px at 857,253, with an illustration inside
    addGradientShape(s, "gradientOutlineCard3", 5.951, 1.757, 6.66, 3.417);
    addPlaceholder(s, "image", 6.389, 2.014, 5.972, 3.083 /* , { path: illustrationPath } */);
    addIcon(s, "add", 5.373, 3.205, 0.319, C.midnight); // Icon Plus 1: 27 px at 797,485

    // Labels: a grey pill over the before card, the Ordergroove logo over the after card
    addPill(s, "eCommerce Platform", 2.313, 5.306, 1.361, 0.243, { fill: C.gray800, color: C.midnight, fontSize: 7.7, bold: true });
    addLogo(s, false, { x: 8.576, y: 5.326, w: 1.41 }); // 203 px wide at 1235,767
    const cols = [
      { head: "Traditional commerce", sub: "One-and-dones via shopping carts.", x: 1.354, w: 3.285 },
      { head: "Relationship commerce", sub: "Frictionless experiences. Seamlessly integrated.", x: 6.917, w: 4.736 },
    ];
    cols.forEach(c => {
      s.addText(c.head, {
        x: c.x, y: 5.632, w: c.w, h: 0.389,
        fontFace: FONT, fontSize: 22, bold: true, color: C.midnight, lineSpacing: 28, align: "center", valign: "top", margin: 0,
      });
      s.addText(c.sub, {
        x: c.x - 0.6, y: 6.063, w: c.w + 1.2, h: 0.333,
        fontFace: FONT, fontSize: 12, color: C.midnight, lineSpacing: 24, align: "center", valign: "top", margin: 0,
      });
    });
    addFooter(s); // Footer Bar 1
  }
}
```

- A: 4 rows of up to two lines (about 90 characters). Up to 5 rows fit above Footer Bar 3. Icons are Green `#009A50` and Radiant Radish.
- B: the Ordergroove logo over the "after" card is a label, so this slide has two logos in Figma (the footer's and this one). Keep it, or replace it with a pill like the left one.

---

## 19. Process timeline

**Figma:** Process timeline A `1:358` (numbered steps on a line), B `1:1764` (milestones above and below an arrow), C `1:1831` (titled periods with arrows) and D `1:998` (a copy of B).

Light mode, white. **A**: 3–5 numbered steps on a Groovy Green line, each with a subheader and body, under a headline and lead; Footer Bar 1. **B / D**: up to 6 milestones on a Midnight arrow, alternating above and below, each with a coloured dot, stem, label pill and a short line of text, and the date on the other side of the arrow; Footer Bar 3. **C**: up to 5 periods, each a title box, a year with an arrow, and a body; Footer Bar 3.

```javascript
{
  const VARIANT = "A"; // A: numbered steps (Figma 1:358) · B: milestones on an arrow (Figma 1:1764) · C: titled periods (Figma 1:1831) · D: same as B (Figma 1:998 is a copy of 1:1764)
  const s = pres.addSlide();
  s.background = { color: C.white };

  const title = { x: 0.692, y: 0.649, w: 11.479, h: 0.493, fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0 };
  const subhead = { x: 0.703, y: 1.281, w: 5.861, h: 0.347, fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, lineSpacing: 25, valign: "top", margin: 0 };

  if (VARIANT === "A") {
    s.addText("3 columns headline for slide goes here", { ...title, x: 0.694, y: 0.646 });
    s.addText("The only platform to seamlessly operate with commerce solution, across any channel to deliver the most robust and personalized experiences for your customers. Plus, we guarantee growth!", {
      x: 0.701, y: 1.278, w: 11.938, h: 0.694,
      fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, lineSpacing: 25, charSpacing: -0.2, valign: "top", margin: 0,
    }); // Box 2.4% wider than Figma's 11.653" so Google Slides, which drops the -1% tracking, keeps 2 lines
    const steps = Array.from({ length: 4 }, () => ({
      head: "Subheader placeholder",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    }));
    const x0 = 0.694, pitch = 3.106, d = 0.403;   // first circle at 100 px; 447 px apart; 58 px circles
    // Timeline Line Green 1: 3 px Groovy Green from the first circle to the right margin (1821 px)
    s.addShape("line", { x: x0 + d / 2, y: 2.979, w: 12.646 - x0 - d / 2, h: 0, line: { color: C.groovyGreen, width: 1.5 } });
    steps.forEach((st, i) => {
      const x = x0 + i * pitch;
      s.addImage({ path: ASSETS.numberCircleGradient, x, y: 2.778, w: d, h: d }); // Number Circle Gradient 1
      s.addText(String(i + 1), { // plain numerals
        x, y: 2.778, w: d, h: d,
        fontFace: FONT, fontSize: 18, bold: true, color: C.midnight, align: "center", valign: "middle", margin: 0,
      });
      s.addText(st.head, {
        x, y: 3.576, w: 2.618, h: 0.292,
        fontFace: FONT, fontSize: 15, bold: true, color: C.midnight, lineSpacing: 21, valign: "top", margin: 0,
      });
      s.addText(st.body, {
        x, y: 4.063, w: 2.618, h: 1.25,
        fontFace: FONT, fontSize: 14, color: C.darkIndigo, lineSpacing: 18.2, charSpacing: -0.14, valign: "top", margin: 0,
      });
    });
    addFooter(s); // Footer Bar 1
  } else if (VARIANT === "B" || VARIANT === "D") {
    s.addText("Sample timeline", title);
    s.addText("Subhead", subhead);
    // NAMES: "pill" = Figma's caps tag pill, for short tags you write yourself.
    //        "heading" = the milestone name as given, Bold, keeping its case: use it for the user's milestone names.
    const NAMES = "pill";
    // Milestones alternate: even ones above the arrow, odd ones below. Colours in this order, as designed.
    const DOTS = [C.groovyGreen, C.intenseCyan, C.laserLemon, C.neonCarrot, C.piercingPitaya, C.electricEggplant];
    // name: pill or heading · note: up to 4 lines · current: true marks the step you're at (a ring, no words)
    // flag: optional words from the user's content shown after the heading in Green ("← We are here")
    const events = [
      { date: "Today", name: "Subhead", note: "Lorem ipsum" },
      { date: "2024", name: "Subhead", note: "Lorem ipsum" },
      { date: "2025", name: "Subhead", note: "Lorem ipsum" },
      { date: "2026", name: "Subhead", note: "Lorem ipsum" },
      { date: "2027", name: "Subhead", note: "Lorem ipsum" },
      { date: "2028", name: "Subhead", note: "Lorem ipsum" },
    ];
    const ay = 3.889;                              // arrow at 560 px
    const cx0 = 1.108, pitch = 1.979;              // first dot centre at 159.5 px; 285 px apart
    const noteFont = { fontSize: 12, charSpacing: -0.12 }, lineH = 0.2167; // 15.6 pt lines
    // Arrow 1: 4 px Midnight, 157–1820 px, open arrowhead
    s.addShape("line", { x: 1.092, y: ay, w: 11.547, h: 0, line: { color: C.midnight, width: 2, endArrowType: "arrow" } });
    events.forEach((ev, i) => {
      const cx = cx0 + i * pitch, up = i % 2 === 0, color = DOTS[i % DOTS.length];
      // Block 30 px right of the stem. Figma's text box is 247 px (1.715 in); real copy may run to 3.4 in, which still clears
      // the stem two milestones on (blocks alternate above and below). The last block stops at the 12.64 in margin.
      const bx = cx + 0.2, bw = Math.min(3.4, 12.64 - bx);
      const noteLines = Math.min(4, wrapLines(ev.note, bw, noteFont));
      const headH = NAMES === "pill" ? 0.181 : 0.24 * Math.min(2, wrapLines(ev.name + (ev.flag ? "  " + ev.flag : ""), bw, { fontSize: 13, bold: true }));
      const blockH = headH + 0.104 + noteLines * lineH;
      // Above: Figma's top (306 px), raised for a long note so it ends clear of the dates (3.15 in).
      // Below: Figma's top (744 px); a 4-line note still ends 0.35 in above Footer Bar 3.
      const py = up ? Math.min(2.125, 3.15 - blockH) : 5.167;
      // Stem: 4 px from the arrow to the block's far end (Figma: 254 px)
      if (up) s.addShape("line", { x: cx, y: py, w: 0, h: ay - py, line: { color, width: 2 } });
      else s.addShape("line", { x: cx, y: ay, w: 0, h: Math.max(1.764, py + blockH - ay), line: { color, width: 2 } });
      // Dot: 39 px in the milestone colour with a 19 px white centre (Timeline Dot). Current step: a ring around a solid dot.
      if (ev.current) s.addShape("ellipse", { x: cx - 0.215, y: ay - 0.215, w: 0.43, h: 0.43, fill: { color, transparency: 70 }, line: { type: "none" } });
      s.addShape("ellipse", { x: cx - 0.135, y: ay - 0.135, w: 0.271, h: 0.271, fill: { color }, line: { type: "none" } });
      if (!ev.current) s.addShape("ellipse", { x: cx - 0.066, y: ay - 0.066, w: 0.132, h: 0.132, fill: { color: C.white }, line: { type: "none" } });
      if (NAMES === "pill") { // pill sized to its label
        const label = ev.name.toUpperCase();
        const pw = Math.min(bw, textWidth(label, { fontSize: 6.5, bold: true, charSpacing: 0.8 }) + 0.187); // Figma: 108 px for "SUBBHEAD"
        addPill(s, label, bx, py, pw, 0.181, {
          fill: color, color: color === C.electricEggplant ? C.white : C.midnight, fontSize: 6.5, charSpacing: 0.8,
        });
      } else {
        s.addText([
          { text: ev.name, options: { color: C.midnight } },
          ...(ev.flag ? [{ text: "  " + ev.flag, options: { color: C.green } }] : []),
        ], { x: bx, y: py - 0.02, w: bw, h: headH, fontFace: FONT, fontSize: 13, bold: true, lineSpacing: 17.3, valign: "top", margin: 0 });
      }
      s.addText(ev.note, {
        x: bx, y: py + headH + 0.104, w: bw, h: noteLines * lineH,
        fontFace: FONT, ...noteFont, color: C.darkIndigo, lineSpacing: 15.6, valign: "top", margin: 0,
      });
      // Date on the other side of the arrow, centred on the dot (caps as designed with pills; as given with headings)
      s.addText(NAMES === "pill" ? ev.date.toUpperCase() : ev.date, {
        x: cx - 0.607, y: up ? 4.252 : 3.224, w: 1.213, h: 0.264,
        fontFace: FONT, fontSize: 15, bold: true, color: C.darkIndigo, lineSpacing: 18.75, charSpacing: -0.15, align: "center", valign: "top", margin: 0,
      });
    });
    addFooter(s, { bar: 3 }); // Footer Bar 3
  } else {
    s.addText("Sample timeline", title);
    s.addText("Subhead", subhead);
    const periods = ["2010", "2012", "2014", "2016", "2018"].map(year => ({
      year, head: "Title placeholder",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    }));
    const x0 = 0.692, pitch = 2.438;               // columns at 99.6 px, 351 px apart
    periods.forEach((p, i) => {
      const x = x0 + i * pitch;
      // Title box: Gradient Outline Card 4 (320×73 px, Gray-975 fill, no shadow)
      s.addImage({ path: ASSETS.gradientOutlineCard4, x: x - 0.06, y: 2.618, w: 2.222, h: 0.507 });
      s.addText(p.head, {
        x: x + 0.128, y: 2.736, w: 1.944, h: 0.264,
        fontFace: FONT, fontSize: 15, bold: true, color: C.midnight, lineSpacing: 18.75, charSpacing: -0.15, valign: "top", margin: 0,
      });
      s.addText(p.year, {
        x, y: 3.503, w: 1.213, h: 0.264,
        fontFace: FONT, fontSize: 15, bold: true, color: C.darkIndigo, lineSpacing: 18.75, charSpacing: -0.15, valign: "top", margin: 0,
      });
      // Arrow 2: 2 px Midnight, 212 px long
      s.addShape("line", { x: x + 0.603, y: 3.635, w: 1.472, h: 0, line: { color: C.midnight, width: 1, endArrowType: "arrow" } });
      s.addText(p.body, {
        x, y: 4.016, w: 2.16, h: 0.778,
        fontFace: FONT, fontSize: 10, color: C.darkIndigo, lineSpacing: 14, charSpacing: -0.1, valign: "top", margin: 0,
      });
    });
    addFooter(s, { bar: 3 }); // Footer Bar 3
  }
}
```

- A: 4 steps; for 3 or 5 set `pitch` to 9.32 / (steps − 1) in so the last column ends at the right margin.
- B / D: 6 milestones at most; fewer leave the arrow's right end empty. Notes wrap to 4 lines in a box up to 3.4 in wide (about 180 characters); a note above the arrow moves up as it grows, so it never reaches the dates. Pills fit their label. The last block stops at the 12.64 in margin.
- B / D with the user's milestone names (Proposal, Pilot Go-Live…): `NAMES = "heading"`. The name stays as given, in Bold, and so does the date. Pills put their text in caps, which changes the user's wording.
- B / D current step: `current: true` on one event draws a ring around a solid dot. Words such as "← We are here" appear only if they're in the user's content (`flag:`).
- C: 5 periods; the body is 10 pt, about 20 words.
- The pill label reads "SUBBHEAD" in Figma (a typo); the recipe uses "Subhead".

---

## 20. Roadmap

**Figma:** Roadmap `1:1874`.

Light mode Gantt. Month columns between hairlines, a coloured bar per project and grey bars per task. Fits two projects and five task rows; split longer roadmaps across slides.

```javascript
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Roadmap", {
    x: 0.69, y: 0.65, w: 11.48, h: 0.55,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0, valign: "top",
  });
  s.addText("Subhead", {
    x: 0.7, y: 1.28, w: 5.86, h: 0.35,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight, margin: 0, valign: "top",
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  // start / end are in months: 0 = start of the first month, months.length = end of the last
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.";
  const projects = [
    { name: "Project 1", start: 0.06, end: 4.5, tasks: [
      { text: lorem, start: 0.06, end: 3.06 },
      { text: lorem, start: 2, end: 4.5 },
    ] },
    { name: "Project 2", start: 1.56, end: 7, tasks: [
      { text: lorem, start: 1.56, end: 5 },
      { text: lorem, start: 3, end: 5.53 },
      { text: lorem, start: 5, end: 7 },
    ] },
  ];
  // Project label / bar colours. Figma defines these two pairs only. Labels are text on white, so the
  // green one is #009A50 (green rule); the bars are fills and keep Groovy Green.
  const PAIRS = [
    { label: C.green, bar: C.groovyGreen },
    { label: C.cyan300, bar: C.intenseCyan },
  ];

  const gx = 3.34, gw = 8.944, colW = gw / months.length; // grid 481–1769px
  const gridTop = 2.076, rowsTop = 2.417;                 // 299px, 348px
  const rowH = 0.5, gap = 0.146, barH = 0.201, barDy = 0.035;
  const rowCount = projects.reduce((n, p) => n + 1 + p.tasks.length, 0);
  const gridBottom = rowsTop + rowCount * rowH + (projects.length - 1) * gap - 0.01;

  months.forEach((m, i) => s.addText(m.toUpperCase(), {
    x: gx + i * colW, y: 1.931, w: colW, h: 0.208,
    fontFace: FONT, fontSize: 12, bold: true, color: C.muted, charSpacing: 0.36, align: "center", margin: 0,
  }));
  for (let i = 0; i <= months.length; i++) {
    s.addShape("line", { x: gx + i * colW, y: gridTop, w: 0, h: gridBottom - gridTop, line: { color: C.gray700, width: 0.5 } });
  }

  const bar = (start, end, y, color) => s.addShape("roundRect", {
    x: gx + start * colW, y: y + barDy, w: (end - start) * colW, h: barH,
    fill: { color }, line: { type: "none" }, rectRadius: barH / 2,
  });

  let y = rowsTop;
  projects.forEach((p, pi) => {
    const pair = PAIRS[pi % PAIRS.length];
    s.addText(p.name, {
      x: 0.701, y, w: 2.417, h: 0.264,
      fontFace: FONT, fontSize: 15, bold: true, color: pair.label, margin: 0, valign: "top",
    });
    bar(p.start, p.end, y, pair.bar);
    y += rowH;
    p.tasks.forEach(t => {
      s.addText(t.text, {
        x: 0.701, y, w: 2.417, h: 0.347,
        fontFace: FONT_MEDIUM, fontSize: 10, color: C.muted, lineSpacing: 12.5, margin: 0, valign: "top",
      });
      bar(t.start, t.end, y, C.gray800);
      y += rowH;
    });
    y += gap;
  });

  addFooter(s); // Figma: Footer Bar 1
}
```

---

## 21. Testimonial with gradient cards

**Figma:** Testimonial with gradient cards A `1:602` (light, initials) and B `1:630` (dark, client logos).

Two quote cards with a soft shadow, a small gradient quote mark top right, and the speaker underneath. **A**: Gray-975 slide, Gray-800 card outline, a gradient initials disc beside the name. **B**: Midnight slide, Groovy Green card outline, the client's logo and a Groovy Green rule beside the name. Quotes are 14.75 pt SemiBold; keep each to about 220 characters (6 lines). One quote gets a single wide card at 20 pt. An anonymous speaker ("CEO, $2B+ retailer") gets `attribution:`, one line as given, with no disc, logo or rule.

```javascript
{
  const VARIANT = "A"; // A: light, initials (Figma 1:602) · B: dark, client logos (Figma 1:630)
  const isDark = VARIANT === "B";
  const s = pres.addSlide();
  s.background = { color: isDark ? C.midnight : C.gray975 };

  s.addText("Sample quotes w/ logos", {
    x: 0.694, y: 0.646, w: 11.479, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: isDark ? C.white : C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
  });

  // 1 or 2 quotes. Each: text, then name + role (+ initials on A, logo on B), or attribution: one line as given
  // ("CEO, $2B+ retailer"), which drops the disc, logo and rule. Never split an attribution into name and role.
  const quotes = [
    { text: "The Summer Groove amplifies our team with agents that never sleep. It gives a fast-growing brand like ours the leverage we need to better support our community and elevate the entire customer experience.",
      name: "Victor Castro", role: isDark ? "General Manager · Casper" : "General Manager · Happy Viking Superfood", initials: "VC",
      logo: null /* B: the client's logo, e.g. customerLogo(slug) or a file path; null draws a placeholder */ },
    { text: "Moving off our homegrown tech to Ordergroove immediately recovered lost payments and elevated our subscriber experience. Their new agents release makes things even more effortless for our customers and our business.",
      name: "Victor Castro", role: isDark ? "General Manager · Glossier." : "General Manager · Happy Viking Superfood", initials: "VC",
      logo: null },
  ];
  const single = quotes.length === 1;
  const cw = single ? 11.889 : 5.632;            // Quote Card Light 1 / Dark 1: 811×492 px at y 303; one quote spans both
  const qLines = single ? wrapLines(quotes[0].text, cw - 1.147, { fontSize: 20, fontFace: FONT_SEMI }) : 0;
  const ch = single ? Math.max(2.4, 0.387 + qLines * 0.389 + 1.3) : 3.418; // one quote: the card fits its lines
  const cy = single ? 2.104 + (3.418 - ch) / 2 : 2.104;

  quotes.forEach((q, i) => {
    const x = single ? 0.722 : [0.722, 6.979][i]; // 104 and 1005 px
    addCard(s, x, cy, cw, ch, {
      fill: C.white, line: isDark ? C.groovyGreen : C.gray800, lineW: 1, r: 0.224,
      shadow: figmaShadow(80.6, 32.2, 0.2, C.midnight), // Figma: 0,32 blur 81, #0A0922 at 45%; 20% looks the same in slides
    });
    s.addImage({ path: ASSETS.quotationMark, x: x + cw - 0.546, y: cy + 0.264, w: 0.198, h: 0.174 }); // Quotation Mark 1
    s.addText(q.text, {
      x: x + 0.387, y: cy + 0.387, w: cw - 1.147, h: single ? qLines * 0.389 : 1.98,
      fontFace: FONT_SEMI, fontSize: single ? 20 : 14.75, color: C.midnight, lineSpacing: single ? 28 : 22.9, valign: "top", margin: 0,
    });

    // Caption, anchored to the card's bottom (Figma's position for a 6-line quote)
    const ny = cy + ch - 0.815;
    if (q.attribution) { // anonymous: the line as given, no disc / logo / rule
      s.addText(q.attribution, {
        x: x + 0.387, y: ny + 0.1, w: cw - 0.774, h: 0.235,
        fontFace: FONT, fontSize: 10.75, bold: true, color: C.midnight, lineSpacing: 16.9, valign: "top", margin: 0,
      });
      return;
    }
    let nx;
    if (!isDark) {
      s.addImage({ path: ASSETS.avatarInitialsGradient, x: x + 0.387, y: ny - 0.008, w: 0.448, h: 0.448 }); // Avatar Initials Gradient 1
      s.addText(q.initials, {
        x: x + 0.387, y: ny - 0.008, w: 0.448, h: 0.448,
        fontFace: FONT, fontSize: 9.4, bold: true, color: C.midnight, align: "center", valign: "middle", margin: 0,
      });
      nx = x + 0.983;
    } else {
      const lb = addLogoFit(s, q.logo, x + 0.387, ny + 0.216, { maxW: 1.2, maxH: 0.333, align: "left" }); // logo, ~170×48 px
      const dx = lb.x + lb.w + 0.146;
      s.addShape("rect", { x: dx, y: ny + 0.035, w: 0.028, h: 0.361, fill: { color: C.groovyGreen }, line: { type: "none" } }); // 4×52 px rule
      nx = dx + 0.177;
    }
    s.addText(q.name, {
      x: nx, y: ny, w: 3.0, h: 0.235,
      fontFace: FONT, fontSize: 10.75, bold: true, color: C.midnight, lineSpacing: 16.9, valign: "top", margin: 0,
    });
    s.addText(q.role, {
      x: nx, y: ny + 0.255, w: 3.6, h: 0.18,
      fontFace: FONT, fontSize: 9.4, color: C.soft, lineSpacing: 12.7, valign: "top", margin: 0,
    });
  });

  addFooter(s); // Footer Bar 1
}
```

- One or two quotes per slide. Figma's quote and role colours (`#0A0922`, `#6B7280`) have no token; the recipe uses Midnight and Gray-400, the nearest tokens.
- The caption sits where Figma puts it under a 6-line quote. A 5-line quote leaves a line of space above it (Figma moves the caption up instead).
- B's customer logos (Casper and Glossier in Figma) aren't bundled: pass the client's logo, or the recipe draws a "Logo" placeholder.

---

## 22. Case study one-pager

**Figma:** Case study one-pager `1:1078` (Dollar Shave Club).

Light mode. Left: the client's logo beside its name, a one-line summary, then Challenge and Solution paragraphs. Right: a product photo with a block in the client's colour under it, and a white panel of three stats over both. The stat figures and the block take the client's brand colours (Dollar Shave Club's orange and navy here); swap them for the client's own.

```javascript
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  const CLIENT = { name: "Dollar Shave Club", logo: customerLogo("dollar-shave-club"), accent: C.neonCarrot, block: "182B5B" }; // block: the client's dark colour (DSC navy)

  // Right column: photo (868×868 px at 1052,-135, shown down to 733 px) and the client-colour block under it
  addPlaceholder(s, "image", 7.306, 0, 6.028, 5.09 /* , { path: productPhotoPath } */);
  s.addShape("rect", { x: 7.306, y: 5.09, w: 6.028, h: 1.66, fill: { color: CLIENT.block }, line: { type: "none" } });

  // Header: client logo | client name
  addLogoFit(s, CLIENT.logo, 0.694, 0.889, { maxW: 1.201, maxH: 0.681, align: "left" }); // 173×98 px at 100,79
  s.addShape("line", { x: 2.281, y: 0.507, w: 0, h: 0.819, line: { color: C.gray900, width: 1 } }); // Divider Light 3
  s.addText(CLIENT.name, {
    x: 2.576, y: 0.646, w: 4.6, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
  });

  s.addText("How Dollar Shave Club's move off homegrown lowered costs and unlocked innovation", {
    x: 0.694, y: 1.646, w: 5.45, h: 0.625,
    fontFace: FONT_MEDIUM, fontSize: 18, color: C.midnight, lineSpacing: 22.5, charSpacing: -0.18, valign: "top", margin: 0,
  }); // 4% wider than Figma's 5.222": Google Slides drops the -1% tracking, and "Import slides" into a 10" deck rounds 18 pt up to 14 pt at 75%; either would wrap it to 3 lines, into "CHALLENGE"
  const blocks = [
    { label: "Challenge", y: 2.571, h: 1.25,
      body: "Dollar Shave Club made waves in 2011 when they launched with a subscription-first model and clever advertising. They discovered the formula to drive profitable growth by generating recurring revenue with an innovative subscription experience built on a homegrown tech stack, but eventually that stack began stifling innovation and limiting growth." },
    { label: "Solution", y: 4.48, h: 1.5,
      body: "After deciding to make the switch to a new tech stack that would reduce costs and allow them to innovate faster, Dollar Shave Club thoroughly looked at the options and determined Ordergroove the only option that could handle their scale. What sealed the deal was Ordergroove's roadmap and potential to grow Dollar Shave Club in the future. After migrating, they've redeployed resources and improved their speed to market." },
  ];
  blocks.forEach(b => {
    s.addText(b.label.toUpperCase(), {
      x: 0.694, y: b.y, w: 3.0, h: 0.194,
      fontFace: FONT, fontSize: 11, bold: true, color: C.midnight, lineSpacing: 13.75, charSpacing: 0.33, valign: "top", margin: 0,
    });
    s.addText(b.body, {
      x: 0.694, y: b.y + 0.313, w: 6.395, h: b.h,
      fontFace: FONT, fontSize: 13, color: C.midnight, lineSpacing: 18.2, charSpacing: -0.13, valign: "top", margin: 0,
    }); // 1.9% wider than Figma's 6.276" so Google Slides, which drops the tracking, keeps Figma's line breaks (6.385–6.40" keeps them everywhere)
  });

  // Stats panel: Stat Panel Light 1, 745×277 px at 1115,645
  addCard(s, 7.743, 4.479, 5.174, 1.924, { fill: C.white, line: C.gray800, lineW: 0.5, r: 0.139 });
  const stats = [
    { num: "Millions", label: "of subscribers migrated" },
    { num: "99.99%", label: "migration success rate" },
    { num: "100%", label: "uptime" },
  ];
  stats.forEach((st, i) => {
    const x = 8.076 + i * 1.639;                 // columns at 1163, 1399, 1635 px, 178 px wide
    s.addText(st.num, {
      x, y: 5.056, w: 1.236, h: 0.278,
      fontFace: FONT, fontSize: 18, bold: true, color: CLIENT.accent, lineSpacing: 19.8, charSpacing: -0.18, align: "center", valign: "top", margin: 0,
    });
    s.addText(st.label, {
      x, y: 5.389, w: 1.236, h: 0.431,
      fontFace: FONT, fontSize: 12, color: C.midnight, lineSpacing: 15.6, charSpacing: -0.12, align: "center", valign: "top", margin: 0,
    });
    if (i > 0) s.addShape("line", { x: x - 0.2, y: 4.889, w: 0, h: 1.104, line: { color: C.gray700, width: 0.5 } }); // Divider Gray 1
  });

  addFooter(s); // Footer Bar 1
}
```

- Challenge: about 55 words; Solution: about 70. Longer copy runs into the footer.
- The navy `182B5B` is Dollar Shave Club's colour, not a brand token. For a client without one, use `C.midnight`.

---

## 23. Logo grid

**Figma:** Logo grid `60:853`.

Light mode. Title and subhead, then a grid of customer logos on native white cards (the 3 Cards slide's card: 4 px Gray-800 border, 22 px corners). It is adjustable: pass 1–12 logos and the grid sets the columns, card size and logo size. Figma shows 8 logos in 4 columns × 2 rows. Logos come from `assets/logos/` (exported from the Figma Logo Archive, page `40:842`), in their original colours. A logo file that isn't bundled becomes a placeholder box.

| Logos | Columns × rows | Card (px) |
|---|---|---|
| 1–3 | 1–3 in one row, centred | up to 547×260 |
| 4 | 4 × 1 | 400×260 |
| 5–6 | 3 × 2 | 547×260 |
| 7–8 | 4 × 2 | 400×260 |
| 9 | 3 × 3 | 547×173 |
| 10–12 | 4 × 3 | 400×173 (logos scale down to match) |

**Two labelled groups** ("Pet brands…" / "…enterprises"): put each in `groups` with its `label`. They sit side by side, 3 columns each, up to 9 logos per group. **Stat strip:** `strip` adds up to 4 figures under the logos (`addStatStrip`), so a credentials slide stays one slide. Bundled slugs: `olly`, `loreal`, `petsmart`, `dollar-shave-club`, `pg`, `keurig`, `gnc`, `nestle`.

```javascript
{
  const s = pres.addSlide();
  s.background = { color: C.gray975 }; // #F6F7FB, as on 3 Cards 1:402

  s.addText("Trusted by leading brands", {
    x: 0.694, y: 0.646, w: 11.479, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight,
    lineSpacing: 35.5, valign: "top", margin: 0,
  });
  s.addText("Subhead", {
    x: 0.701, y: 1.278, w: 5.861, h: 0.347,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight,
    lineSpacing: 25, valign: "top", margin: 0,
  });

  // One group of 1–12 logos, or two labelled groups of up to 9. maxW (Figma px) shrinks a heavy wordmark; the default is 240.
  // label: the user's words, as given (a string, or text runs to keep their bold). "" for no label.
  const groups = [
    { label: "", logos: [
      { name: "OLLY",              path: customerLogo("olly") },              // Logo Archive / olly (41:357)
      { name: "L'Oréal",           path: customerLogo("loreal") },            // Logo Archive / loreal-logo (41:153)
      { name: "PetSmart",          path: customerLogo("petsmart") },          // Logo Archive / petsmart-logo (41:765)
      { name: "Dollar Shave Club", path: customerLogo("dollar-shave-club") }, // Logo Archive / dollar-shave-club-logo (41:230)
      { name: "P&G",               path: customerLogo("pg") },                // Logo Archive / P&G (41:260)
      { name: "Keurig",            path: customerLogo("keurig"), maxW: 220 }, // Logo Archive / keurig (41:476)
      { name: "GNC",               path: customerLogo("gnc"), maxW: 200 },    // Logo Archive / GNC (41:315)
      { name: "Nestlé",            path: customerLogo("nestle") },            // Logo Archive / nestle-logo (41:587)
    ] },
  ];
  const strip = null;      // optional: [{ num: "500+", text: "Enterprise brands partner with Ordergroove" }, …] (up to 4)
  const stripLabel = "";   // optional caps label above the strip ("By the numbers")

  // Grid area 100,300 → 1820,900 px; 40 px gaps (20 px with two groups). A strip takes the bottom 1.2 in (+ its label).
  const areaX = 0.694, areaW = 11.944, top = 2.083;
  const stripH = 0.85, stripTop = 6.4 - stripH - (stripLabel ? 0.36 : 0);
  const bottom = strip ? stripTop - 0.3 : 6.25;
  const two = groups.length === 2, gGap = 0.5, gap = two ? 0.139 : 0.278;
  const gW = two ? (areaW - gGap) / 2 : areaW;

  groups.forEach((g, gi) => {
    const gx = areaX + gi * (gW + gGap);
    let gy = top;
    if (g.label) {
      s.addText(g.label, { x: gx, y: gy, w: gW, h: 0.3, fontFace: FONT_SEMI, fontSize: 14, color: C.midnight, valign: "top", margin: 0 });
      gy += 0.42;
    }
    const n = g.logos.length;
    const cols = two ? Math.min(3, n) : n <= 4 ? n : n <= 6 || n === 9 ? 3 : 4;
    const rows = Math.ceil(n / cols);
    const cardW = Math.min(3.796, (gW - gap * (cols - 1)) / cols);           // 547 px max
    const cardH = Math.min(1.806, (bottom - gy - gap * (rows - 1)) / rows);  // 260 px max
    const short = cardH < 1.2;                                               // short cards: logos may use more of the height
    g.logos.forEach((logo, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const inRow = Math.min(cols, n - r * cols);                            // centre a short last row
      const x = gx + (gW - (inRow * cardW + (inRow - 1) * gap)) / 2 + c * (cardW + gap);
      const y = gy + r * (cardH + gap);
      addCard(s, x, y, cardW, cardH);                                        // white, Gray-800 2 pt, 0.153 in corners
      addLogoFit(s, logo.path, x + cardW / 2, y + cardH / 2, {               // Figma: 240×100 px logo box in a 400×260 card
        maxW: cardW * 0.6 * (logo.maxW || 240) / 240,
        maxH: cardH * (short ? 0.55 : 0.385),
        area: cardW * cardH * 0.125 * (short ? 1.6 : 1),                     // 13,000 px² in the Figma card
      });
    });
  });
  if (strip) addStatStrip(s, strip, areaX, stripTop, areaW, stripH, { label: stripLabel });

  addFooter(s); // Footer Bar 1
}
```

- More than 12 logos in one group, or more than 9 in each of two: in a deck you're rebuilding, keep the slide whole and ask the user which logos to show; in a new deck, use two slides.
- Two groups: the cards are smaller, so pass the sharpest logo files you have (a 1.5 in logo needs about 450 px).
- Figures in the strip are Green `#009A50`; captions are the user's words, as given.

---

## 24. Team

**Figma:** Team A `1:1615` (dark), B `1:1538` (light).

Three people: round headshot, name card overlapping its lower right. **A** dark: gradient ring. **B** light: Gray-950 ring. Headshots are placeholders; pass `path:` for real photos. `ACCENT` swaps the ring for Intense Cyan, Flamingo Pink or Groovy Green.

```javascript
{
  const VARIANT = "A"; // A: dark, gradient ring (Figma 1:1615) · B: light, Gray-950 ring (Figma 1:1538)
  const ACCENT = null; // ring around each photo: null keeps A's gradient / B's Gray-950 · "cyan" · "pink" · "green" (photo accents)
  const isDark = VARIANT === "A";
  const s = pres.addSlide();
  s.background = { color: isDark ? C.midnight : C.white };

  s.addText("Meet the team", {
    x: 0.69, y: 0.65, w: 12.54, h: 0.55,
    fontFace: FONT, fontSize: 32, bold: true, color: isDark ? C.white : C.midnight, margin: 0, valign: "top",
  });

  const people = [
    { name: "Ethan Brooks", role: "Vice President of Customer Success" },
    { name: "Sophia Bennett", role: "Senior Product Marketing Manager" },
    { name: "Daniel Carter", role: "Director of Subscription Strategy" },
  ];
  const d = 2.632, ring = 0.077;              // 379px circle, 11px ring
  const x0 = 1.646, y0 = 2.229, pitch = 3.611; // first circle at 237,321px; 520px apart

  people.forEach((p, i) => {
    const x = x0 + i * pitch;
    if (isDark && !ACCENT) {
      s.addImage({ path: ASSETS.avatarFrameGradient, x, y: y0, w: d, h: d }); // Avatar Frame Gradient 1
    } else { // B, and A with an accent (the gradient's edge would show around the accent ring)
      s.addShape("ellipse", { x, y: y0, w: d, h: d, fill: { color: C.gray950 }, line: { type: "none" } });
    }
    addPlaceholder(s, "photo", x + ring, y0 + ring, d - 2 * ring, d - 2 * ring, { shape: "ellipse" /* , path: p.photo */ });
    addPhotoRing(s, x, y0, d, ACCENT, { ring }); // only the ring takes the accent; the disc behind the photo stays as is

    // Name card: 258×143px, 190px right of the circle's left edge
    const nx = x + 1.319, ny = 4.299, nw = 1.792, nh = 0.993;
    addCard(s, nx, ny, nw, nh, { fill: C.white, line: C.gray800, lineW: 1.3, r: 0.097, squareTR: true });
    s.addText(p.name, {
      x: nx + 0.194, y: ny + 0.153, w: nw - 0.194, h: 0.236,
      fontFace: FONT, fontSize: 12, bold: true, color: C.midnight, margin: 0, valign: "top",
    });
    s.addText(p.role, {
      x: nx + 0.194, y: ny + 0.41, w: nw - 0.194, h: 0.403,
      fontFace: FONT, fontSize: 11, color: C.midnight, lineSpacing: 14.3, margin: 0, valign: "top",
    });
  });

  addFooter(s, { bar: 3 }); // Footer Bar 3. Figma's Team slides drop the confidentiality line; the skill adds it on internal decks (Cameron 2026-10-19), and external decks have none
}
```

- Three people per slide. Roles wrap to two lines at most; keep them under ~36 characters.
- Figma spaces the circles 502 px then 538 px apart; the recipe uses an even 520 px.
- `ACCENT` (Cameron, 2026-10-20): `"cyan"`, `"pink"` or `"green"` recolours only the 11 px ring, never the area behind the photo: most people's headshots keep their own background. On A it replaces the gradient ring, with a Gray-950 disc behind the photo as on B. Leave it `null` unless the user asks for colour; use the same accent on every people slide in the deck (see SKILL.md "Photo accents"). Figma: "Accent options, picked" rows `163:1351` (A) and `163:1675` (B).

---

## 25. Org chart

**Figma:** Org chart `1:1456`.

Light mode leadership grid: up to 10 people, 5 per row. Square headshots with the brand card shape (top-right corner square) on a hard Gray-950 offset shadow. Figma draws no reporting lines; this is a grid. `ACCENT` colours the offset tile in full: Intense Cyan, Flamingo Pink or Groovy Green.

```javascript
{
  const ACCENT = null; // offset tile behind each photo: null keeps Gray-950 · "cyan" · "pink" · "green" (photo accents)
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Sample org chart", {
    x: 0.69, y: 0.65, w: 11.48, h: 0.55,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0, valign: "top",
  });
  s.addText("Subhead", {
    x: 0.7, y: 1.28, w: 5.86, h: 0.35,
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.midnight, margin: 0, valign: "top",
  });

  const people = Array.from({ length: 9 }, () => ({ name: "First Last", role: "Job title" }));
  const cols = 5;
  const tw = 1.722, th = 1.708, r = 0.16;       // 248×246px tile, 23px corners
  const x0 = 1.215, y0 = 1.764;                 // 175,254px
  const pitchX = 2.295, pitchY = 2.535;         // 330.5px, 365px
  const shadow = 0.073;                         // 10.5px hard offset

  people.forEach((p, i) => {
    const x = x0 + (i % cols) * pitchX;
    const y = y0 + Math.floor(i / cols) * pitchY;
    addCard(s, x + shadow, y + shadow, tw, th, { fill: photoAccent(ACCENT) || C.gray950, line: null, r, squareTR: true }); // Gray-950 per Cameron 2026-10-19
    addPlaceholder(s, "photo", x, y, tw, th, { shape: "card", r /* , path: p.photo */ });
    s.addText(p.name, {
      x: x + 0.042, y: y + 1.868, w: 2.2, h: 0.229,
      fontFace: FONT, fontSize: 11.5, bold: true, color: C.darkIndigo, margin: 0, valign: "top",
    });
    s.addText(p.role, {
      x: x + 0.042, y: y + 2.118, w: 2.2, h: 0.188,
      fontFace: FONT, fontSize: 9.5, color: C.soft, margin: 0, valign: "top",
    });
  });

  addFooter(s, { bar: 3 }); // Footer Bar 3
}
```

- A real headshot placed with `path:` is a plain rectangle: pptxgenjs can't crop an image to the card shape. Pre-crop headshots to the card shape as PNGs if the square corner matters.
- In Figma the second-row job titles are nudged left of their tiles; the recipe left-aligns every caption with its tile.
- `ACCENT` (Cameron, 2026-10-20): `"cyan"`, `"pink"` or `"green"` fills the offset tile in that colour, full solid; the 10.5 px offset doesn't change. This recipe only. Leave it `null` unless the user asks for colour (SKILL.md "Photo accents"). Figma: "Accent options, picked" row `163:2043`.

---

## 26. Closing / thank you (simple)

**Figma:** Closing / thank you (simple) `60:968`.

Dark mode, no contact details. The left-aligned twin of Title / cover (dark): same glow background, logo position and text column. "Thank you!" sits where the title sits, with a one- or two-line note below. An optional customer quote goes on a Gray-200 card under it, in the same column, so a closing with a quote stays one slide (about 200 characters fit).

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgGlowDark }; // Background Glow Dark 2

  addLogo(s, true); // large logo, 435×75 px at 97,190

  s.addText("Thank you!", {
    x: 1.069, y: 2.701, w: 4.729, h: 0.764,
    fontFace: FONT, fontSize: 50, bold: true, color: C.white,
    lineSpacing: 55, valign: "top", margin: 0,
  });
  const note = "We’d love to hear your questions, feedback, and thoughts."; // "" when there's no note: leave the slot out
  // Optional closing quote, the user's words as given: { text: "“…”", attribution: "Chief Marketing Officer at Pet Valu" }
  const quote = null;

  let y = 3.854;
  if (note) {
    s.addText(note, {
      x: 1.069, y, w: 4.729, h: 0.694,
      fontFace: FONT, fontSize: 20, color: C.white,
      lineSpacing: 25, valign: "top", margin: 0,
    });
    y += 0.694 + 0.25;
  }
  if (quote) { // Gray-200 card in the text column, with the gradient quote mark
    const qx = 1.069, qw = 4.729, tw = qw - 0.9;
    const lines = wrapLines(quote.text, tw, { fontSize: 14, fontFace: FONT_MEDIUM });
    const qh = 0.3 + lines * 0.233 + 0.12 + 0.235 + 0.3;
    addCard(s, qx, y, qw, qh, { fill: C.darkIndigo, line: null, r: 0.153 });
    s.addImage({ path: ASSETS.quotationMark, x: qx + 0.3, y: y + 0.34, w: 0.198, h: 0.174 }); // Quotation Mark 1
    s.addText(quote.text, {
      x: qx + 0.6, y: y + 0.3, w: tw, h: lines * 0.233,
      fontFace: FONT_MEDIUM, fontSize: 14, color: C.white, lineSpacing: 16.8, valign: "top", margin: 0,
    });
    s.addText(quote.attribution, {
      x: qx + 0.6, y: y + 0.3 + lines * 0.233 + 0.12, w: tw, h: 0.235,
      fontFace: FONT, fontSize: 10.5, bold: true, color: C.white, lineSpacing: 14.7, valign: "top", margin: 0,
    });
  }

  addFooterText(s, true); // Footer Text White 1
}
```

---

## 27. Closing / thank you (with contact)

**Figma:** Closing / thank you (with contact) A `1:1713` (gradient panel + headshot), B `1:1402` (full gradient, centred) and C `1:1754` (white glow, centred).

"Thank you!", the presenter's name, email and phone. **A**: left-aligned on a gradient panel that runs off the left edge, with a round headshot on the right; Footer Bar 1. **B**: centred on the full gradient, under the all-Midnight logo. **C**: centred on the white glow background, under the dark logo. B and C use the text-only footer.

```javascript
{
  const VARIANT = "A"; // A: gradient panel + headshot (Figma 1:1713) · B: full gradient, centred (Figma 1:1402) · C: white glow, centred (Figma 1:1754)
  const s = pres.addSlide();
  const contact = { name: "First Last Name", email: "email@email.com", phone: "(212) 123-4567" };

  if (VARIANT === "A") {
    s.background = { color: C.white };
    s.addImage({ path: ASSETS.gradientAccent3, x: 0, y: 1.139, w: 6.667, h: 5.063 }); // Gradient Accent 3: 960×729 px at 0,164
    addPlaceholder(s, "photo", 7.91, 1.563, 3.597, 3.597, { shape: "ellipse" /* , path: headshotPath */ }); // 518 px headshot at 1139,225
  } else {
    s.background = { path: VARIANT === "B" ? ASSETS.bgGradient1 : ASSETS.bgGlowLight2 }; // Background Gradient 1 / Glow Light 2
    addLogo(s, false, { x: 5.569, y: 1.694, w: 2.194, mono: VARIANT === "B" }); // 316×54 px, centred, at 802,244
  }

  const centred = VARIANT !== "A";
  const tx = centred ? 3.66 : 1.5, tw = 6.01;    // A: left at 216 px · B/C: centred on the slide
  const dy = centred ? 0.167 : 0;                // B/C sit 24 px lower than A
  const al = centred ? "center" : "left";
  s.addText("Thank you!", {
    x: tx, y: 2.479 + dy, w: tw, h: 0.875,
    fontFace: FONT, fontSize: 55, bold: true, color: C.midnight, lineSpacing: 63.25, charSpacing: -0.55, align: al, valign: "top", margin: 0,
  }); // 110 px
  s.addText(contact.name, {
    x: tx, y: 3.719 + dy, w: tw, h: 0.347,
    fontFace: FONT_SEMI, fontSize: 20, color: C.midnight, lineSpacing: 25, charSpacing: -0.2, align: al, valign: "top", margin: 0,
  });
  [contact.email, contact.phone].forEach((t, i) => s.addText(t, {
    x: tx, y: 4.249 + i * 0.341 + dy, w: tw, h: 0.264,
    fontFace: FONT_MEDIUM, fontSize: 15, color: C.midnight, lineSpacing: 18.75, charSpacing: -0.15, align: al, valign: "top", margin: 0,
  }));

  if (VARIANT === "A") addFooter(s);    // Footer Bar 1 (no large logo on A, so the bar carries it)
  else addFooterText(s, false);          // Footer Text Dark 1
}
```

- For several presenters, use one slide each, or Team (recipe 24) before a closing (simple) slide.

---

## 28. Content + dark side panel

**Figma:** Content + dark side panel A `123:949`, B `124:965`, C `125:1019`, D `156:1212`, E `156:1288`, F `156:1371` (designed 2026-10-20, approved by Cameron; B's metrics redesigned and D–F added the same day).

Light mode, white. Title and subhead, a main block on the left two-thirds and a Midnight panel on the right third. The panel holds the slide's second message. **A**: a label and a numbered list of up to 6 items. **B, D, E, F**: a label and 1–4 metrics (figure, name, caption), in four styles: **B** figure first (White figure on a Gradient Highlight, name beside it, caption under; the default), **D** ledger (name and caption left, Groovy Green figure right, dividers), **E** stat cards (Dark Indigo cards with an icon tile), **F** hero (the first metric on a gradient card, the rest as compact rows). **C**: a customer quote and its attribution. The main block is chosen separately with `MAIN`: `"milestones"` (A's default), `"cards"` (the metrics variants' default, with optional labelled groups), `"options"` (C's: option cards + rows) or `"chart"` (a bar chart on a card). Any variant takes any main block, so a dense source slide with a dark panel stays one slide. Footer Bar 1.

```javascript
{
  const VARIANT = "A"; // A: label + numbered list (Figma 123:949) · B: metrics, figure first (124:965) · C: quote (125:1019) · D: metrics, ledger (156:1212) · E: metrics, stat cards (156:1288) · F: metrics, hero card (156:1371)
  const MAIN = VARIANT === "A" ? "milestones" : VARIANT === "C" ? "options" : "cards"; // or "chart"; any variant takes any main block
  const s = pres.addSlide();
  s.background = { color: C.white };

  // All text below is the user's, as given. Empty strings leave a slot out.
  const title = "Sample title goes here";
  const subhead = "Subhead goes here"; // "" to leave it out (the blocks move up 0.49 in); text runs keep the user's bold
  s.addText(title, {
    x: 0.694, y: 0.646, w: 11.479, h: 0.493,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, lineSpacing: 35.5, valign: "top", margin: 0,
  });
  if (subhead) s.addText(subhead, {
    x: 0.701, y: 1.278, w: 11.938, h: 0.347 * Math.max(1, subhead.length ? wrapLines(typeof subhead === "string" ? subhead : subhead.map(r => r.text).join(""), 11.938, { fontSize: 20, fontFace: FONT_MEDIUM }) : 1),
    fontFace: FONT_MEDIUM, fontSize: 20, color: C.darkIndigo, lineSpacing: 25, valign: "top", margin: 0,
  });

  const subText = typeof subhead === "string" ? subhead : subhead.map(r => r.text).join("");
  const subLines = subText ? wrapLines(subText, 11.938, { fontSize: 20, fontFace: FONT_MEDIUM }) : 0;
  // Figma: 290–900 px. A 2-line subhead pushes both blocks down. DENSE uses the room down to the footer clearance (6.4 in)
  // for a main block with a lot of text; both blocks keep the same bottom. Cards switch it on themselves for 2 groups or 7+ cards.
  const DENSE = false;
  const top = subText ? Math.max(2.014, 1.278 + subLines * 0.347 + 0.3) : 1.528;
  const bottom = DENSE ? 6.4 : 6.25;
  const M = { x: 0.694, y: top, w: 7.375, h: bottom - top };  // main block: 100–1162 px
  const P = { x: 8.486, y: top, w: 4.153, h: bottom - top };  // panel: 1222–1820 px
  const lines = (t, w, o) => wrapLines(t, w, o);
  let section = 0; // icon colours: each section with icons takes the next colour (tileColor); the panel comes last

  // ---------------- Main block ----------------
  if (MAIN === "milestones") {
    // Vertical milestones. current: true fills the dot. flag: the user's own words after the name, in Green ("← We are here").
    const events = [
      { date: "OCT 19", name: "Milestone name", note: "One line that says what happens at this step.", current: true },
      { date: "NOV 13", name: "Milestone name", note: "One line that says what happens at this step." },
      { date: "NOV 20", name: "Milestone name", note: "One line that says what happens at this step." },
      { date: "JAN 15", name: "Milestone name", note: "One line that says what happens at this step." },
      { date: "MAR 15", name: "Milestone name", note: "One line that says what happens at this step." },
    ];
    const n = events.length, pitch = Math.min(0.847, (M.h - 0.62) / (n - 1)); // 122 px apart as designed; up to 6 fit
    const tx = M.x + 1.597, tw = M.w - 1.597;                                // names at 230 px
    s.addShape("line", { x: M.x + 0.125, y: M.y + 0.125, w: 0, h: pitch * (n - 1), line: { color: C.gray800, width: 2 } }); // 4 px track
    events.forEach((ev, i) => {
      const y = M.y + i * pitch;
      if (ev.current) { // 36 px dot, filled, white centre
        s.addShape("ellipse", { x: M.x, y, w: 0.25, h: 0.25, fill: { color: C.green }, line: { type: "none" } });
        s.addShape("ellipse", { x: M.x + 0.083, y: y + 0.083, w: 0.083, h: 0.083, fill: { color: C.white }, line: { type: "none" } });
      } else {
        s.addShape("ellipse", { x: M.x + 0.014, y: y + 0.014, w: 0.222, h: 0.222, fill: { color: C.white }, line: { color: C.green, width: 2 } });
      }
      s.addText(ev.date, { // 20 px Bold Green, 3% tracking
        x: M.x + 0.5, y: y + 0.035, w: 0.98, h: 0.174,
        fontFace: FONT, fontSize: 10, bold: true, color: C.green, charSpacing: 0.3, valign: "top", margin: 0,
      });
      s.addText([
        { text: ev.name, options: { color: C.midnight } },
        ...(ev.flag ? [{ text: "  " + ev.flag, options: { color: C.green } }] : []),
      ], { x: tx, y: y - 0.014, w: tw, h: 0.26, fontFace: FONT, fontSize: 15, bold: true, lineSpacing: 18.75, valign: "top", margin: 0 });
      s.addText(ev.note, {
        x: tx, y: y + 0.278, w: tw, h: lines(ev.note, tw, { fontSize: 12 }) * 0.2167,
        fontFace: FONT, fontSize: 12, color: C.darkIndigo, lineSpacing: 15.6, valign: "top", margin: 0,
      });
    });
  } else if (MAIN === "cards") {
    // 1 or 2 groups of cards, 3 across. label: a section label ("" for none). num: plain numeral, top right (01 → 1).
    // Each card: icon (icon-index.md), num, title, body; any of them "" to leave it out.
    const groups = [
      { label: "", cards: Array.from({ length: 6 }, () => ({ icon: "credit_card", num: "", title: "Card title", body: "Short description of the item, up to three lines." })) },
    ];
    const dense = groups.length > 1 || groups.reduce((n, g) => n + g.cards.length, 0) > 6;
    if (dense) M.h = P.h = 6.4 - M.y;                                    // use the room to the footer clearance
    const cols = 3, gap = 0.208, vgap = dense ? 0.15 : gap, labelH = dense ? 0.28 : 0.3, groupGap = dense ? 0.12 : 0.15;
    const cw = (M.w - gap * (cols - 1)) / cols;                          // 334 px
    const rowsAll = groups.reduce((a, g) => a + Math.ceil(g.cards.length / cols), 0);
    const ch = Math.min(2.014, (M.h - groups.filter(g => g.label).length * labelH - (groups.length - 1) * groupGap - (rowsAll - groups.length) * vgap) / rowsAll);
    const compact = ch < 1.7;                                            // short cards: tile and title share a row
    // One body size for every card: 11 pt as designed (10.5 compact), smaller only so the longest body fits its card
    const pad = compact ? 0.13 : 0.222, d = compact ? 0.3 : 0.444;     // Figma: 64 px Tinted Brand Green tile at 32,32
    const tSize = compact ? 12 : 13, tLineH = tSize * (compact ? 1.15 : 1.2) / 72;
    const bLine = compact ? 1.2 : 1.3;                                // body line height, × font size
    // Title box per card: beside the tile when compact (up to 2 lines), under it otherwise
    const titleBox = c => {
      const tx = compact && c.icon ? pad + d + 0.12 : pad, tw = cw - pad - (c.num ? 0.45 : 0) - tx;
      const h = Math.max(1, Math.min(2, c.title ? wrapLines(c.title, tw, { fontSize: tSize, bold: true }) : 1)) * tLineH;
      return { tx, tw, h, ty: compact ? pad + Math.max(0, (d - h) / 2) : 0.861 };
    };
    const bodyTop = c => { const t = titleBox(c); return compact ? Math.max(pad + d, t.ty + t.h) + 0.06 : 1.153 + Math.max(0, t.h - tLineH); };
    // One body size for every card: 11 pt as designed (10.5 compact), down to 9.5 pt (the type scale's smallest) so the longest body fits
    const bodyW = cw - 2 * pad;
    const fits = size => groups.every(g => g.cards.every(c => !c.body || wrapLines(c.body, bodyW, { fontSize: size }) * size * bLine / 72 <= ch - pad - bodyTop(c)));
    let bodySize = compact ? 10.5 : 11;
    while (bodySize > 9.5 && !fits(bodySize)) bodySize -= 0.5;
    if (!fits(bodySize)) console.warn("Recipe 28: card text doesn't fit at 9.5 pt. Try DENSE = true; if it still doesn't fit, ask the user (SKILL.md).");
    let gy = M.y;
    groups.forEach(g => {
      const sec = g.cards.some(c => c.icon) ? section++ : 0;   // a group with icons is a section: green, then pink, then teal
      if (g.label) { sectionLabel(s, g.label, M.x, gy - 0.04, accentColor(false)); gy += labelH; }
      g.cards.forEach((c, i) => {
        const x = M.x + (i % cols) * (cw + gap), y = gy + Math.floor(i / cols) * (ch + vgap);
        addCard(s, x, y, cw, ch, { fill: C.white, line: C.gray800, lineW: 2, r: 0.153 });
        if (c.icon) addSectionTile(s, c.icon, x + pad, y + pad, { section: sec, d }); // Tinted tile in the section's colour
        if (c.num) s.addText(String(c.num), {
          x: x + cw - pad - 0.4, y: y + pad, w: 0.4, h: d, fontFace: FONT, fontSize: 11, bold: true, color: C.green, align: "right", valign: "middle", margin: 0,
        });
        const t = titleBox(c);
        if (c.title) s.addText(c.title, {
          x: x + t.tx, y: y + t.ty, w: t.tw, h: t.h, fontFace: FONT, fontSize: tSize, bold: true, color: C.midnight, lineSpacing: tLineH * 72, valign: "top", margin: 0,
        });
        const by = y + bodyTop(c);
        if (c.body) s.addText(c.body, {
          x: x + pad, y: by, w: cw - 2 * pad, h: y + ch - pad - by,
          fontFace: FONT, fontSize: bodySize, color: C.darkIndigo, lineSpacing: bodySize * bLine, valign: "top", margin: 0,
        });
      });
      gy += Math.ceil(g.cards.length / cols) * (ch + vgap) - vgap + groupGap;
    });
  } else if (MAIN === "options") {
    // 1–3 option cards (label, figure in Green, optional unit beside it, text), then up to 3 rows (icon, title, text).
    const options = [
      { label: "OPTION 1", figure: "X.X%", unit: "", text: "Short description of this option" },
      { label: "OPTION 2", figure: "X.X%", unit: "", text: "Short description of this option" },
    ];
    const rows = Array.from({ length: 3 }, () => ({ icon: "credit_card", title: "Row title", text: "One or two lines that describe this row." }));
    const gap = 0.208, oh = rows.length ? 1.819 : M.h;                    // 262 px option cards
    const ow = (M.w - gap * (options.length - 1)) / options.length;
    options.forEach((o, i) => {
      const x = M.x + i * (ow + gap), inner = ow - 0.556;
      addCard(s, x, M.y, ow, oh, { fill: C.white, line: C.gray800, lineW: 2, r: 0.153 });
      s.addText(o.label, { x: x + 0.278, y: M.y + 0.25, w: inner, h: 0.17, fontFace: FONT, fontSize: 10, bold: true, color: C.midnight, charSpacing: 0.3, valign: "top", margin: 0 });
      const unitW = o.unit ? textWidth(o.unit, { fontSize: 13, bold: true }) + 0.1 : 0;
      const size = fitFontSize(o.figure, inner - unitW, { max: 44, min: 24, bold: true });
      const figW = textWidth(o.figure, { fontSize: size, bold: true });
      s.addText(o.figure, { // 88 px Bold, Green #009A50 (numerals on light)
        x: x + 0.278, y: M.y + 0.42, w: figW + 0.1, h: 0.75, fontFace: FONT, fontSize: size, bold: true, color: C.green, valign: "bottom", margin: 0,
      });
      if (o.unit) s.addText(o.unit, {
        x: x + 0.278 + figW + 0.08, y: M.y + 0.5, w: unitW, h: 0.6, fontFace: FONT, fontSize: 13, bold: true, color: C.midnight, valign: "bottom", margin: 0,
      });
      s.addText(o.text, { x: x + 0.278, y: M.y + 1.319, w: inner, h: oh - 1.36, fontFace: FONT, fontSize: 12, color: C.darkIndigo, lineSpacing: 15.6, valign: "top", margin: 0 });
    });
    const rh = Math.min(0.667, (M.h - oh - gap - 0.104 * (rows.length - 1)) / rows.length); // 96 px rows, 15 px apart
    const sec = rows.some(r => r.icon) ? section++ : 0;
    rows.forEach((r, i) => {
      const y = M.y + oh + gap + i * (rh + 0.104);
      addCard(s, M.x, y, M.w, rh, { fill: C.white, line: C.gray800, lineW: 2, r: 0.153 });
      if (r.icon) addSectionTile(s, r.icon, M.x + 0.222, y + (rh - 0.389) / 2, { section: sec, d: 0.389 }); // 56 px tile
      s.addText(r.title, { x: M.x + 0.778, y, w: 1.9, h: rh, fontFace: FONT, fontSize: 13, bold: true, color: C.midnight, valign: "middle", margin: 0 });
      s.addText(r.text, { x: M.x + 2.778, y, w: M.w - 2.95, h: rh, fontFace: FONT, fontSize: 11, color: C.darkIndigo, lineSpacing: 14.3, valign: "middle", margin: 0 });
    });
  } else { // MAIN === "chart": a column chart on a white card (shapes, as Chart (bar))
    const chart = {
      title: "Chart title", note: "",                 // header line: title left, a short note right
      label: "",                                      // caps label above the plot
      labels: ["Category", "Category", "Category"],
      series: [{ name: "Key item", values: [25, 42, 78] }, { name: "Key item", values: [33, 57, 103] }],
      format: v => `$${v}`,
      lifts: [],                                      // optional per-category text above each group ("+110%"), as given
      footnote: "",
      greenSeries: 0,                                 // the series that takes Groovy Green; the others keep C.chart order (Midnight next)
    };
    const colors = C.chart.slice(0, chart.series.length);
    if (chart.greenSeries) [colors[0], colors[chart.greenSeries]] = [colors[chart.greenSeries], colors[0]];
    addCard(s, M.x, M.y, M.w, M.h, { fill: C.white, line: C.gray800, lineW: 2, r: 0.153 });
    const cx = M.x + 0.25, cw = M.w - 0.5;
    let y = M.y + 0.2;
    if (chart.title || chart.note) {
      s.addText(chart.title, { x: cx, y, w: cw * 0.65, h: 0.25, fontFace: FONT, fontSize: 12, bold: true, color: C.midnight, valign: "middle", margin: 0 });
      if (chart.note) s.addText(chart.note, { x: cx + cw * 0.5, y, w: cw * 0.5, h: 0.25, fontFace: FONT, fontSize: 9.5, color: C.soft, align: "right", valign: "middle", margin: 0 });
      s.addShape("line", { x: cx, y: y + 0.36, w: cw, h: 0, line: { color: C.gray800, width: 0.75 } });
      y += 0.5;
    }
    if (chart.label) s.addText(chart.label.toUpperCase(), { x: cx, y, w: cw * 0.55, h: 0.2, fontFace: FONT, fontSize: 9.5, bold: true, color: C.midnight, charSpacing: 0.28, valign: "middle", margin: 0 });
    chart.series.forEach((sr, i) => { // legend, right, in one row
      const lx = cx + cw - (chart.series.length - i) * 1.35;
      s.addShape("rect", { x: lx, y: y + 0.03, w: 0.14, h: 0.14, fill: { color: colors[i] }, line: { type: "none" } });
      s.addText(sr.name, { x: lx + 0.2, y, w: 1.12, h: 0.2, fontFace: FONT, fontSize: 9.5, color: C.darkIndigo, valign: "middle", margin: 0 });
    });
    const liftRoom = chart.lifts.length ? 0.35 : 0;                        // room above the plot so lift labels clear the legend
    const plot = { x: cx + 0.75, y: y + 0.55 + liftRoom, w: cw - 0.8, h: M.y + M.h - (chart.footnote ? 0.75 : 0.55) - (y + 0.55 + liftRoom) };
    const { max, step } = niceAxis(Math.max(...chart.series.flatMap(sr => sr.values))); // the axis follows the data only
    drawBarChart(s, { ...plot, labels: chart.labels, series: chart.series, colors, max, step, format: chart.format });
    chart.lifts.forEach((t, j) => { // tinted pill above each category's tallest bar
      if (!t) return;
      const slot = plot.w / chart.labels.length, barTop = plot.y + plot.h - (Math.max(...chart.series.map(sr => sr.values[j])) / max) * plot.h;
      s.addText(t, {
        shape: "roundRect", rectRadius: 0.05, x: plot.x + slot * j + slot / 2 - 0.33, y: barTop - 0.52, w: 0.66, h: 0.24, // above the value label
        fill: { color: C.groovyGreen, transparency: 80 }, line: { type: "none" },
        fontFace: FONT, fontSize: 10, bold: true, color: C.green, align: "center", valign: "middle", margin: 0,
      });
    });
    if (chart.footnote) s.addText(chart.footnote, { x: cx, y: M.y + M.h - 0.35, w: cw, h: 0.2, fontFace: FONT, fontSize: 9.5, color: C.soft, valign: "middle", margin: 0 });
  }

  // ---------------- Dark side panel ----------------
  addCard(s, P.x, P.y, P.w, P.h, { fill: C.midnight, line: null, r: 0.153 }); // 22 px corners
  const px = P.x + 0.333, pw = P.w - 0.667;                                  // 48 px padding
  // Vertical spacing: 50 px (0.347 in) above and below the content, as in Figma. Items share the rest as equal gaps
  // (between a minimum and a maximum, 0.6 in unless the style says less); if room is still left, the label and items are centred together.
  const pad = 0.347;
  const spread = (heights, labelH, minGap, maxGap = 0.6) => {
    const n = heights.length, used = heights.reduce((a, b) => a + b, 0), room = P.h - 2 * pad - labelH;
    const gap = n > 1 ? Math.min(maxGap, Math.max(minGap, (room - used) / (n - 1))) : 0;
    const groupH = labelH + used + gap * (n - 1);
    return { gap, top: P.y + pad + Math.max(0, (P.h - 2 * pad - groupH) / 2) }; // top = where the label's (or first item's) text starts
  };
  if (VARIANT === "A") {
    const label = "Section label"; // "" for none
    const NUMBERED = true;         // false when the user's list has no numbers
    // Items: strings, or { text, icon } for a small Groovy Green tile before the number.
    const items = ["List item goes here", "List item goes here, up to two lines of text in the panel", "List item goes here", "List item goes here", "List item goes here", "List item goes here"];
    const labelH = label ? 0.431 : 0;                                          // label text top → first item: 62 px
    const hasIcon = items.some(it => it && it.icon);
    const nx = px + (hasIcon ? 0.45 : 0), tx = nx + (NUMBERED ? 0.347 : 0), tw = P.x + P.w - 0.333 - tx;
    let size = 13, hs = [];
    for (; size >= 10.5; size -= 0.5) { // 26 px Medium as designed; smaller only if the list wouldn't fit with 36 px gaps
      hs = items.map(it => lines(typeof it === "string" ? it : it.text, tw, { fontSize: size, fontFace: FONT_MEDIUM }) * size * 1.25 / 72);
      if (hs.reduce((a, b) => a + b, 0) + 0.25 * (items.length - 1) <= P.h - 2 * pad - labelH) break;
    }
    const { gap, top } = spread(hs, labelH, 0.25);
    if (label) sectionLabel(s, label, px, top - 0.06, C.groovyGreen);           // 22 px Bold caps
    let y = top + labelH;
    items.forEach((it, i) => {
      const text = typeof it === "string" ? it : it.text;
      if (i) s.addShape("line", { x: px, y: y - gap / 2, w: pw, h: 0, line: { color: C.darkIndigo, width: 1 } }); // 2 px Gray-200 divider, centred in the gap
      if (it && it.icon) addSectionTile(s, it.icon, px, y - 0.03, { section, isDark: true, d: 0.333 }); // Solid tile, next section's colour
      if (NUMBERED) s.addText(String(i + 1), { x: nx, y, w: 0.3, h: size * 1.25 / 72, fontFace: FONT, fontSize: size, bold: true, color: C.groovyGreen, valign: "top", margin: 0 });
      s.addText(text, { x: tx, y, w: tw, h: hs[i], fontFace: FONT_MEDIUM, fontSize: size, color: C.white, lineSpacing: size * 1.25, valign: "top", margin: 0 });
      y += hs[i] + gap;
    });
  } else if (VARIANT === "C") {
    // A quote and one attribution line, both as given ("CEO, $2B+ retailer" stays one line).
    const quote = "“Quote goes here, in the speaker's own words, kept exactly as given. Up to six lines fit in the panel.”";
    const attribution = "Name, Title, Company";
    s.addImage({ path: ASSETS.quotationMark, x: px, y: P.y + 0.29, w: 0.29, h: 0.259 }); // Quotation Mark 1, at Figma's 1.5× size
    const qTop = P.y + 1.042, qBottom = P.y + P.h - 0.914;                                // quote at 150 px; divider 110 px from the bottom
    let size = 16;                                                                         // 32 px Medium White; smaller only to fit
    while (size > 12 && lines(quote, pw, { fontSize: size, fontFace: FONT_MEDIUM }) * size * 1.3 / 72 > qBottom - qTop) size -= 0.5;
    s.addText(quote, { x: px, y: qTop, w: pw, h: qBottom - qTop, fontFace: FONT_MEDIUM, fontSize: size, color: C.white, lineSpacing: size * 1.3, valign: "top", margin: 0 });
    s.addShape("line", { x: px, y: P.y + P.h - 0.764, w: pw, h: 0, line: { color: C.darkIndigo, width: 1 } });
    s.addText(attribution, { x: px, y: P.y + P.h - 0.569, w: pw, h: 0.25, fontFace: FONT, fontSize: 12, bold: true, color: C.white, valign: "top", margin: 0 });
  } else { // B, D, E, F: a label and 1–4 metrics, in the variant's style
    const label = "Section label"; // "" for none
    // Figure, name and caption, each as given. icon: E's tile (icon-index.md); the other styles don't draw it.
    const metrics = [
      { icon: "credit_card", figure: "XX%", name: "Metric name", caption: "What the figure measures, in one or two lines of panel text" },
      { icon: "credit_card", figure: "X.Xx", name: "Longer metric name here", caption: "What the figure measures" },
      { icon: "credit_card", figure: "XX+", name: "Metric name", caption: "What the figure measures, in one or two lines of panel text" },
    ];
    const labelH = label ? 0.403 : 0;                                          // label text top → first metric: 58 px
    const room = P.h - 2 * pad - labelH;
    const fw = (t, size) => textWidth(t, { fontSize: size, bold: true }) * 1.02; // figure width, 2% headroom (Google Slides)
    const nameLines = (t, w, size) => lines(t, w, { fontSize: size, bold: true });
    const txt = (t, x, y, w, h, size, o = {}) => s.addText(t, { x, y, w, h, fontFace: FONT, fontSize: size, color: C.white, valign: "top", margin: 0, ...o });
    // Each style is a list of sizes, as designed first; the recipe takes the first that fits. A plan is
    // { ok, hs: block heights, draw: one function per block, minGap, maxGap, divFrom: first block with a divider above it, or null }.
    const styles = {
      // B, figure first (Figma 124:965): 56 px White figure, the Gradient Highlight behind its foot, the name beside it, caption under
      B: [28, 26, 24, 22, 20].map(F => () => {
        const fh = F / 72, hs = [], draw = [];
        let ok = true;
        for (const m of metrics) {
          const w = fw(m.figure, F), nx = w + 0.125, nw = pw - nx;             // name 18 px after the figure
          const nl = nameLines(m.name, nw, 11);
          if (nl > 2) ok = false;                                              // a wide figure leaves too little room: next size
          const ny = fh * 0.85 - 0.149 - (nl - 1) * 0.191, up = Math.max(0, -ny); // the name's last line on the figure's baseline
          const cy = fh + 0.097, cl = lines(m.caption, pw, { fontSize: 10 });   // caption 14 px under the highlight
          hs.push(up + cy + cl * 0.181);
          draw.push(y => {
            y += up;
            // Three-stat callout's highlight at its full depth: 0.28 × the figure size tall, from 0.72 to 1.0 of it, behind the
            // figure, so the figure's foot sits in the bar (Cameron, 2026-10-20, knowing White blends into Laser Lemon there)
            addGradientHighlight(s, px - 0.007, y + fh * 0.72, w * 1.05, fh * 0.28);
            txt(m.figure, px, y, w + 0.05, fh, F, { bold: true, lineSpacing: F });
            txt(m.name, px + nx, y + ny, nw, nl * 0.191, 11, { bold: true, lineSpacing: 13.75 });
            txt(m.caption, px, y + cy, pw, cl * 0.181, 10, { lineSpacing: 13 });
          });
        }
        return { ok, hs, draw, minGap: 0.167, maxGap: 0.6, divFrom: null };
      }),
      // D, ledger (Figma 156:1212): name and caption left, 52 px Groovy Green figure right-aligned, dividers
      D: [26, 24, 22, 20].map(F => () => {
        const fh = F / 72, colW = Math.max(...metrics.map(m => fw(m.figure, F))); // one figure column for every row
        const tw = pw - colW - 0.194, hs = [], draw = [];                      // text column, 28 px clear of the figures
        for (const m of metrics) {
          const nl = nameLines(m.name, tw, 11), cl = lines(m.caption, tw, { fontSize: 10 });
          const th = nl * 0.191 + 0.028 + cl * 0.181, h = Math.max(fh, th);  // caption 4 px under the name
          hs.push(h);
          draw.push(y => {
            const ty = y + (h - th) / 2;
            txt(m.name, px, ty, tw, nl * 0.191, 11, { bold: true, lineSpacing: 13.75 });
            txt(m.caption, px, ty + nl * 0.191 + 0.028, tw, cl * 0.181, 10, { lineSpacing: 13 });
            txt(m.figure, px + pw - colW, y + (h - fh) / 2, colW, fh, F, { bold: true, color: C.groovyGreen, align: "right", lineSpacing: F });
          });
        }
        return { ok: colW <= pw * 0.45, hs, draw, minGap: 0.25, maxGap: 0.6, divFrom: 1 };
      }),
      // E, stat cards (Figma 156:1288): Gray-200 cards, 48 px Solid tile, 44 px White figure with the name beside it, caption under
      E: [[22, 0.125, 0.333], [20, 0.111, 0.306], [18, 0.097, 0.278]].map(([F, pv, t]) => () => {
        const fh = F / 72, ph = 0.167, icons = metrics.some(m => m.icon);
        const rx = icons ? ph + t + 0.139 : ph, rw = pw - rx - ph, hs = [], draw = []; // text 20 px right of the tile
        let ok = true;
        for (const m of metrics) {
          const w = fw(m.figure, F), nx = rx + w + 0.097, nw = pw - ph - nx;   // name 14 px after the figure
          const nl = nameLines(m.name, nw, 10);
          if (nl > 2) ok = false;
          const ny = pv + fh * 0.85 - 0.135 - (nl - 1) * 0.174;
          const cy = pv + fh + 0.056, cl = lines(m.caption, rw, { fontSize: 9.5 }); // caption 8 px under the figure
          const h = Math.max(pv + t, cy + cl * 0.172) + pv;
          hs.push(h);
          draw.push(y => {
            addCard(s, px, y, pw, h, { fill: C.darkIndigo, line: null, r: 0.111 }); // 16 px corners
            if (m.icon) addSectionTile(s, m.icon, px + ph, y + pv, { section, isDark: true, d: t }); // Solid tile, the panel's section colour
            txt(m.figure, px + rx, y + pv, w + 0.05, fh, F, { bold: true, lineSpacing: F });
            txt(m.name, px + nx, y + ny, nw, nl * 0.174, 10, { bold: true, lineSpacing: 12.5 });
            txt(m.caption, px + rx, y + cy, rw, cl * 0.172, 9.5, { lineSpacing: 12.35 });
          });
        }
        return { ok, hs, draw, minGap: 0.083, maxGap: 0.208, divFrom: null };
      }),
      // F, hero (Figma 156:1371): the first metric on Stat Card Gradient 2 in Midnight (as Stat card + image), the rest as
      // compact rows with a 40 px Groovy Green figure, dividers between the rows
      F: [[32, 0.167, 0.167], [28, 0.139, 0.139], [24, 0.125, 0.125]].map(([F, pv, minGap]) => () => {
        const fh = F / 72, ph = 0.194, hs = [], draw = [];
        const [hero, ...rest] = metrics;
        const w = fw(hero.figure, F), nx = ph + w + 0.125, nw = pw - ph - nx;
        const nl = nameLines(hero.name, nw, 11);
        const ny = pv + fh * 0.85 - 0.149 - (nl - 1) * 0.191;
        const cy = pv + fh + 0.069, cl = lines(hero.caption, pw - 2 * ph, { fontSize: 10 }); // caption 10 px under the figure
        hs.push(cy + cl * 0.181 + pv);
        draw.push(y => {
          addStatCardGradient(s, px, y, pw, hs[0]);
          txt(hero.figure, px + ph, y + pv, w + 0.05, fh, F, { bold: true, color: C.midnight, lineSpacing: F });
          txt(hero.name, px + nx, y + ny, nw, nl * 0.191, 11, { bold: true, color: C.midnight, lineSpacing: 13.75 });
          txt(hero.caption, px + ph, y + cy, pw - 2 * ph, cl * 0.181, 10, { color: C.midnight, lineSpacing: 13 });
        });
        let rf = 20;                                                           // 40 px; smaller only for a very wide figure
        while (rf > 14 && rest.some(m => fw(m.figure, rf) > pw * 0.4)) rf -= 1;
        const rh = rf / 72, colW = rest.length ? Math.max(...rest.map(m => fw(m.figure, rf))) : 0;
        const tx = colW + 0.167, tw = pw - tx;                                 // text 24 px after the figure column
        for (const m of rest) {
          const rnl = nameLines(m.name, tw, 10), rcl = lines(m.caption, tw, { fontSize: 9.5 });
          const th = rnl * 0.174 + 0.014 + rcl * 0.172, h = Math.max(rh, th);
          hs.push(h);
          draw.push(y => {
            const ty = y + (h - th) / 2;
            txt(m.figure, px, y + (h - rh) / 2, colW, rh, rf, { bold: true, color: C.groovyGreen, lineSpacing: rf });
            txt(m.name, px + tx, ty, tw, rnl * 0.174, 10, { bold: true, lineSpacing: 12.5 });
            txt(m.caption, px + tx, ty + rnl * 0.174 + 0.014, tw, rcl * 0.172, 9.5, { lineSpacing: 12.35 });
          });
        }
        return { ok: nl <= 2, hs, draw, minGap, maxGap: 0.347, divFrom: 2 };
      }),
    };
    const plans = styles[VARIANT].map(plan => plan());
    const fits = p => p.ok && p.hs.reduce((a, b) => a + b, 0) + p.minGap * (p.hs.length - 1) <= room;
    const plan = plans.find(fits) || plans[plans.length - 1];
    if (!fits(plan)) console.warn(`Recipe 28 ${VARIANT}: the metrics don't fit the panel at the smallest size. Try DENSE = true` +
      (VARIANT === "D" ? "" : `, or VARIANT "D" (the ledger holds 4 metrics with 2-line captions)`) + "; if it still doesn't fit, ask the user (SKILL.md).");
    const { gap, top } = spread(plan.hs, labelH, plan.minGap, plan.maxGap);
    if (label) sectionLabel(s, label, px, top - 0.06, C.groovyGreen);           // 22 px Bold caps
    let y = top + labelH;
    plan.draw.forEach((draw, i) => {
      if (plan.divFrom !== null && i >= plan.divFrom) s.addShape("line", { x: px, y: y - gap / 2, w: pw, h: 0, line: { color: C.darkIndigo, width: 1 } }); // 2 px Gray-200, centred in the gap
      draw(y);
      y += plan.hs[i] + gap;
    });
  }

  addFooter(s); // Footer Bar 1
}
```

- **When to use it:** a slide whose source has a main block and a dark panel beside it (a chart + "questions we look to answer", a timeline + "what we need from you", included features + success metrics, commercial terms + a quote). Build it here instead of splitting the slide.
- **Main block, real copy:** milestones take up to 6 (notes of 1–2 lines); cards take up to 9 in one or two labelled groups (shorter cards put the tile beside the title; body text shrinks to 9.5 pt at most, and two groups or more than 6 cards use `DENSE` room automatically); options take 1–3 cards and up to 3 rows; the chart takes up to 6 categories × 2–3 series, and lift labels get their own room so the axis stays at the data's round maximum. Text that still doesn't fit at 9.5 pt: the recipe warns; ask the user, don't cut it.
- **Chart colours:** `C.chart` order, so two series are Groovy Green and Midnight. Give Groovy Green to the series the slide is about with `greenSeries` (a control group then takes Midnight).
- **Panel spacing:** the content keeps Figma's 50 px above and below. A list or metrics share the remaining height as equal gaps, with each divider centred in its gap. A taller panel (a 2-line subhead, or `DENSE`) therefore spreads out instead of leaving an empty band at the bottom. Short content (3 items) is centred once the gaps reach 0.6 in (E's cards 0.21 in, F's 0.35 in).
- **Metrics styles (Cameron, 2026-10-20):** B, D, E and F take the same `metrics` list, so switching style is a one-letter change. **B** (figure first) is the default. Pick **D** (ledger) for 4 metrics with 2-line captions or long names, **E** (stat cards) when each metric has an icon, and **F** (hero) when the first metric is the headline; F's gradient card is drawn at any size by `addStatCardGradient()`. The order is the user's: F leads with their first metric, never a reordered one. The figure, name and caption are drawn as given, with nothing shortened.
- **Metrics, real copy** (figures like "$20M+", "2–4x", "Billions", names up to 4 words, captions up to 2 lines; a 1-line subhead): B holds 2–3, or 4 when most captions are 1 line. D holds 4 with 2-line captions. E holds 3, or 4 with 1-line captions. F holds a hero and up to 3 rows. Each style steps its figures down (B 28 → 20 pt, D 26 → 20, E 22 → 18, F's hero 32 → 24) until the panel fits; a wide figure also steps B, E and F down so the name beside it stays within 2 lines. If the smallest size still overflows, the recipe warns: try `DENSE`, then D, and ask the user before cutting anything.
- **Panel, real copy:** the list shrinks from 13 pt to 10.5 pt before it would overflow; the quote shrinks from 16 pt to 12 pt.
- **Green:** green text on the white main block is `#009A50`; on the Midnight panel it's Groovy Green (green rule). All other panel text is White (`C.white`, #FFFFFF), captions included; never a light gray. F's hero card is the one exception: its text is Midnight on the gradient, as on Stat card + image. The panel's only gray is the Gray-200 divider lines and E's card fill, which are shapes, not text.
- **Icon colours by section:** each section with icons takes the next colour: a card group, the option rows, then the panel. On the white main block the tiles are Tinted (green, pink, teal, Midnight); on the panel they are Solid with a Midnight glyph (Groovy Green, pink, Intense Cyan, Neon Carrot). Slide 6 of the proposal: Platform green, Hands-on services pink, the metrics panel cyan. Labels, numbers and text keep the green rule.
- **Numbers:** plain numerals, 1, 2, 3. A source list numbered 01–06 becomes 1–6.
