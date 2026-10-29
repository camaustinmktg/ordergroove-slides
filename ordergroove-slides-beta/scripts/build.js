// Ordergroove Slides 2.0 — shared build helpers
//
// Every layout recipe in references/layout-recipes.md runs against this file.
// It centralizes the brand constants, asset paths, and helpers that enforce
// the brand rules teammates would otherwise get wrong (most notably the
// Green vs Groovy Green contrast rule).
//
// Usage from a build script (run `npm install` in the skill folder first):
//   const { C, FONT, FONT_MEDIUM, FONT_SEMI, FONT_EXTRA, W, H, ASSETS, SAFE,
//           accentColor, addFooter, addFooterText, addLogo, sectionLabel,
//           addCard, addPill, addIcon, addIconTile, addPlaceholder,
//           addLogoCard, addGradientShape, figmaShadow,
//           newPresentation, saveTo } = require("./build");
//   const pres = newPresentation({ title: "My deck", audience: "external" }); // or "internal"
//   ... paste recipes ...
//   await saveTo(pres, "/abs/path/OG-topic-2026-10-20.pptx");

const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");

// Optional: renders icon SVGs to PNG at build time (Keynote shows embedded SVGs as broken images).
// Without it, addIcon() falls back to embedding the SVG and warns once.
let Resvg = null;
try { ({ Resvg } = require("@resvg/resvg-js")); } catch (e) { Resvg = null; }

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

const W = 13.333;
const H = 7.5;

// Safe areas, in inches. Keep text inside them so it never runs into a background image.
// Figma slides are 1920×1080 px: inches = px / 144.
const SAFE = {
  // bgGlowDark / bgGlowLight: the glow fills the right of the slide and reaches x≈5.3" near the
  // bottom. This is the text column of Title / cover (dark): right edge 5.8".
  glow: { x: 0.69, y: 0.6, w: 5.11, h: 5.9 },
  // Plain backgrounds: 0.69" side margins, 0.35" clear above the 0.75" footer bar (bottom 6.4").
  content: { x: 0.69, y: 0.6, w: 11.95, h: 5.8 },
};

// ---------------------------------------------------------------------------
// Color palette — Figma variables in "Slide Skill 2.0" (checked 2026-10-19)
// ---------------------------------------------------------------------------

const C = {
  // Primary
  midnight:     "17132F",
  darkIndigo:   "2E2A47",  // Figma: Gray-200
  green:        "009A50",  // accent on LIGHT backgrounds (brand value; Figma Green-300 reads 009950)
  groovyGreen:  "00FF85",  // accent on DARK backgrounds
  intenseCyan:  "00FAFF",
  neonCarrot:   "FF8500",
  laserLemon:   "EAFF00",
  white:        "FFFFFF",
  gray900:      "EBEAF0",  // lines and dividers only: text on Midnight is White (Cameron, 2026-10-20)
  gray800:      "D8D7DF",  // borders, dividers

  // Secondary
  green400:         "00CC6A",  // Figma variable; never text or icons (green rule 2026-10-20), not an icon tile colour
  cyan300:          "009699",  // icon tiles on DARK backgrounds
  cyan400:          "00BEC0",  // icon tiles on LIGHT backgrounds only (not yet a Figma variable)
  piercingPitaya:   "FF61D3",
  electricEggplant: "8500FF",
  radiantRadish:    "D32E55",
  gray700:          "ABA9BA",
  gray950:          "F5F5F8",
  gray975:          "F6F7FB",  // light slide background (Figma library style "#F6F7FB"; named Gray-975 2026-10-19)

  // Secondary text
  muted:      "4F4A6A",  // Figma: Gray-300 — secondary body on light
  soft:       "666279",  // Figma: Gray-400 — tertiary/caption on light

  // Convenience aliases
  bodyDark:   "17132F",
  bodyLight:  "FFFFFF",
  offWhite:   "F5F5F8",  // Figma: Gray-950
};

// Chart series order from Figma's "Pie chart colors" slide; N series use the first N.
// On dark slides, swap index 1 (Midnight) for White.
C.chart = [C.groovyGreen, C.midnight, C.intenseCyan, C.laserLemon, C.piercingPitaya, C.electricEggplant, C.gray800, C.neonCarrot];

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

const FONT = "Figtree";
const FONT_MEDIUM = "Figtree Medium"; // Figma "Medium" weight: subheads, card body
const FONT_SEMI = "Figtree SemiBold";
const FONT_EXTRA = "Figtree ExtraBold";

// ---------------------------------------------------------------------------
// Asset paths (absolute, relative to the skill root)
// ---------------------------------------------------------------------------

const SKILL_ROOT = path.resolve(__dirname, "..");
const BRAND_DIR  = path.join(SKILL_ROOT, "assets", "brand");
const ICON_DIR   = path.join(SKILL_ROOT, "assets", "icons");  // Material Symbols Rounded SVGs (see references/icon-index.md)
const LOGO_DIR   = path.join(SKILL_ROOT, "assets", "logos");  // customer logos from the Figma Logo Archive (page 40:842)

const ASSETS = {
  // Backgrounds (full bleed, 1920×1080 at 2x)
  bgGlowDark:      path.join(BRAND_DIR, "bg-glow-dark.png"),   // Midnight + green/cyan glow (Figma 58:821 background)
  bgGlowLight:     path.join(BRAND_DIR, "bg-glow-light.png"),  // white + glow (Figma Background Glow Light 1, 10:709)
  bgLogoWallDark:  path.join(BRAND_DIR, "background-logo-wall-dark-2.png"), // 62 customer logos on Midnight (81:911)
  testimonialDark: path.join(BRAND_DIR, "testimonial-bg-dark.png"),  // v2.1, not used by any recipe
  testimonialLight:path.join(BRAND_DIR, "testimonial-bg-light.png"), // v2.1, not used by any recipe

  bgGradient1:     path.join(BRAND_DIR, "bg-gradient-1.png"),  // full-bleed Intense Cyan → Laser Lemon (Background Gradient 1, 10:708)
  bgGlowLight2:    path.join(BRAND_DIR, "bg-glow-light-2.png"),// white + glow along the bottom (Background Glow Light 2, 10:711)

  // Footer + logos
  footer:    path.join(BRAND_DIR, "Footer.png"),      // Footer Bar 1 (10:854), 1920×108 at 2x
  footerExternal: path.join(BRAND_DIR, "footer-bar-1-external.png"), // Footer Bar 1 External (120:912): no confidentiality line
  footerBar3: path.join(BRAND_DIR, "footer-bar-3.png"), // Footer Bar 3: 92 px bar + logo, no text (from 1:1457), 1920×92 at 2x
  logoDark:  path.join(BRAND_DIR, "logo-dark.png"),   // white ink, for DARK backgrounds (Logo White 1, 10:788)
  logoWhite: path.join(BRAND_DIR, "logo-white.png"),  // dark ink, for LIGHT backgrounds (Logo Dark 1, 10:774)
  logoDarkMono: path.join(BRAND_DIR, "logo-dark-mono.png"), // all Midnight, for gradient backgrounds (Logo Dark Mono 1, 10:802)

  // Gradient elements (images, aspect-locked: pptxgenjs can't draw gradients)
  gradientAccent1:     path.join(BRAND_DIR, "gradient-accent-1.png"),      // 841×729, flush right (1:2595)
  gradientAccent2:     path.join(BRAND_DIR, "gradient-accent-2.png"),      // 1211×729, runs off the right edge (10:719)
  gradientAccent3:     path.join(BRAND_DIR, "gradient-accent-3.png"),      // 960×729, flush left, rounded right (1:2600)
  statCardGradient1:   path.join(BRAND_DIR, "stat-card-gradient-1.png"),   // 357×274 card + drop shadow (10:721)
  statCardGradient2:   path.join(BRAND_DIR, "stat-card-gradient-2.png"),   // 553×286 card (10:722)
  contentPanelGradient:path.join(BRAND_DIR, "content-panel-gradient-1.png"),// 1719×549 panel, gradient at 10% (10:723)
  gradientHighlight:   path.join(BRAND_DIR, "gradient-highlight-1.png"),   // 234×28 bar under a figure (10:724)
  gradientOutlineCard1:path.join(BRAND_DIR, "gradient-outline-card-1.png"),// 846×122 white card, gradient outline + shadow (10:725)
  gradientOutlineCard2:path.join(BRAND_DIR, "gradient-outline-card-2.png"),// 616×200 (10:726)
  gradientOutlineCard3:path.join(BRAND_DIR, "gradient-outline-card-3.png"),// 959×492 (10:727)
  gradientOutlineCard4:path.join(BRAND_DIR, "gradient-outline-card-4.png"),// 320×73 Gray-975 box, no shadow (10:728)
  numberCircleGradient:path.join(BRAND_DIR, "number-circle-gradient-1.png"),// 58 px disc (10:908)
  avatarInitialsGradient: path.join(BRAND_DIR, "avatar-initials-gradient-1.png"), // 64 px disc for initials (10:915)
  quotationMark:       path.join(BRAND_DIR, "quotation-mark-1.png"),       // 28×25 px quote glyph, green → teal at 80% (10:933)
  largeCardGradient:   path.join(BRAND_DIR, "large-card-gradient-1.png"),  // 1658×791 (10:720)
  avatarFrameGradient: path.join(BRAND_DIR, "avatar-frame-gradient-1.png"),// 379×377 ring (10:935)
  numberBadgeGradient: path.join(BRAND_DIR, "number-badge-gradient-1.png"),// 105×105 disc + white ring (76:917)
  tableHighlightRow1:  path.join(BRAND_DIR, "table-highlight-row-1.png"),  // 1829×170 incl. shadow (76:919)
  tableHighlightRow2:  path.join(BRAND_DIR, "table-highlight-row-2.png"),  // 1829×154 incl. shadow (76:920)
  gradientCard1: path.join(BRAND_DIR, "gradient-callout-1.png"),  // v2.1 card + gradient shadow, 539×620
  gradientCard2: path.join(BRAND_DIR, "gradient-callout-2.png"),
  gradientCard3: path.join(BRAND_DIR, "gradient-callout-3.png"),
  gradientCard4: path.join(BRAND_DIR, "gradient-callout-4.png"),
  quotation:     path.join(BRAND_DIR, "quotation.png"),           // testimonial slides only
  logoBox:       path.join(BRAND_DIR, "logo-box.png"),            // v2.1 frame, not used by any 2.0 recipe

  // Fonts
  fontRegular:   path.join(BRAND_DIR, "fonts", "Figtree-Regular.ttf"),
  fontMedium:    path.join(BRAND_DIR, "fonts", "Figtree-Medium.ttf"),
  fontSemiBold:  path.join(BRAND_DIR, "fonts", "Figtree-SemiBold.ttf"),
  fontBold:      path.join(BRAND_DIR, "fonts", "Figtree-Bold.ttf"),
  fontExtraBold: path.join(BRAND_DIR, "fonts", "Figtree-ExtraBold.ttf"),
};

// ---------------------------------------------------------------------------
// Colour and text helpers
// ---------------------------------------------------------------------------

/**
 * Return the correct accent hex for a slide's background.
 * true = dark/Midnight → Groovy Green; false = light/white → Green.
 */
function accentColor(isDark) {
  return isDark ? C.groovyGreen : C.green;
}

/**
 * Return the correct subtitle/muted text color for a slide's background.
 * Dark: White. Text on Midnight is never light gray (Cameron, 2026-10-20).
 */
function subtitleColor(isDark) {
  return isDark ? C.white : C.darkIndigo;
}

/**
 * ALL-CAPS tracked section label above an H1. Tracking 0.33 pt = 3% at 11 pt, as the recipes' own
 * ALL CAPS labels (0.24–0.8 pt). The 0.3 in box centres its line, so the text spans y + 0.06 to y + 0.24.
 */
function sectionLabel(slide, text, x, y, color) {
  slide.addText(String(text).toUpperCase(), {
    x, y, w: 6.0, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true,
    color: color || C.green,
    charSpacing: 0.33, margin: 0,
  });
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/**
 * Pixel size of a PNG or JPEG file, read from its header.
 * pptxgenjs can't read an image's size, so the helpers below use this to keep aspect ratios.
 */
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; // PNG
  for (let i = 2; i < b.length - 9; ) { // JPEG: walk the segments to the SOF marker
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`Can't read image size: ${file}`);
}

// ---------------------------------------------------------------------------
// Footer and logo (DECISIONS §6: never two logos on one slide)
// ---------------------------------------------------------------------------

// Footer by audience (DECISIONS "Answered 2026-10-20" #1). Internal decks keep "Confidential and
// proprietary. Do not distribute."; external decks (customers, prospects, partners) get the same
// footer without it. Set once per deck: newPresentation({ audience: "external" }).
const AUDIENCES = ["internal", "external"];

/** True when this slide's deck is internal. A slide made outside newPresentation() counts as internal. */
function isInternal(slide, internal) {
  if (typeof internal === "boolean") return internal; // per-slide override (rarely needed)
  return (slide && slide._ogAudience) !== "external";
}

/**
 * Footer bar, flush with the bottom edge. Every slide except title and closing slides, which use
 * addFooterText() instead. Pick the bar the Figma frame uses (each recipe says which):
 *   bar: 1  Footer Bar 1 (10:854): 108 px Midnight bar, small logo, confidentiality line. The default.
 *   bar: 2  Footer Bar 2 (10:856): Bar 1 plus the slide number at the right (native, so it counts).
 *   bar: 3  Footer Bar 3 (10:873): 92 px bar, smaller logo, the line in Bold (tables, timelines, team).
 * The deck's audience picks the version: external decks use the no-line copies (Figma 120:911).
 */
function addFooter(slide, { bar = 1, internal } = {}) {
  const withLine = isInternal(slide, internal);
  if (bar === 3) {
    slide.addImage({ path: ASSETS.footerBar3, x: 0, y: H - 0.639, w: W, h: 0.639 });
    if (withLine) slide.addText("Confidential and proprietary. Do not distribute.", { // Bold 15 px white, centred, 36 px below the bar top
      x: 0, y: 7.111, w: W, h: 0.132,
      fontFace: FONT, fontSize: 7.5, bold: true, color: C.white, align: "center", valign: "top", margin: 0,
    });
    return;
  }
  slide.addImage({
    path: withLine ? ASSETS.footer : ASSETS.footerExternal,
    x: 0, y: H - 0.75, w: W, h: 0.75,
  });
  if (bar === 2) { // "#" at 1813,1009 px: Regular 25 px white
    slide.slideNumber = { x: 12.59, y: 7.007, w: 0.5, h: 0.215, fontFace: FONT, fontSize: 12.5, color: C.white, margin: 0 };
  }
}

/**
 * Text-only footer for title and closing slides (Figma: Footer Text White 1 / Footer Text Dark 1).
 * External decks: the no-line version (Footer Text … External, 120:961 / 120:966) is empty, so it
 * draws nothing.
 */
function addFooterText(slide, onDark, { internal } = {}) {
  if (!isInternal(slide, internal)) return;
  slide.addText("Confidential and proprietary. Do not distribute.", {
    x: 0, y: 7.056, w: W, h: 0.132,
    fontFace: FONT, fontSize: 7.5, color: onDark ? C.white : C.midnight,
    align: "center", valign: "top", margin: 0,
  });
}

/**
 * Large Ordergroove logo for title and closing slides only (Figma: 435×75 px at 97,190).
 * Pass y: 0.882 for Figma's 127 px position (light title, client-logo title).
 * Height follows the file's own aspect ratio.
 */
function addLogo(slide, onDark, { x = 0.674, y = 1.319, w = 3.021, mono = false } = {}) {
  // mono: the all-Midnight logo, for gradient backgrounds (Closing B). Centred logos: x = (W - w) / 2.
  const file = mono ? ASSETS.logoDarkMono : onDark ? ASSETS.logoDark : ASSETS.logoWhite;
  const px = imageSize(file);
  slide.addImage({ path: file, x, y, w, h: w * px.h / px.w });
}

/** Customer logo exported from the Figma Logo Archive (page 40:842): assets/logos/<slug>.png. */
function customerLogo(slug) {
  return path.join(LOGO_DIR, `${slug}.png`);
}

/**
 * Logo centred on (cx, cy) at its own aspect ratio: as large as fits in maxW × maxH,
 * capped at `area` square inches so stacked or square logos don't outweigh wide wordmarks.
 * pptxgenjs `sizing: contain` can't do this: it takes the image size from the w/h you pass,
 * not from the file, so a logo whose shape differs from the box is stretched.
 * Missing file → addPlaceholder("logo").
 */
function addLogoFit(slide, file, cx, cy, { maxW, maxH, area = Infinity, align = "center" } = {}) {
  // align: "left" makes cx the left edge instead of the centre (logo beside a caption).
  // Returns the box the logo (or its placeholder) used.
  const left = align === "left";
  if (!file || !fs.existsSync(file)) {
    const box = { x: left ? cx : cx - maxW / 2, y: cy - maxH / 2, w: maxW, h: maxH };
    addPlaceholder(slide, "logo", box.x, box.y, box.w, box.h);
    return box;
  }
  const px = imageSize(file);
  const ratio = px.w / px.h;
  const w = Math.min(maxW, maxH * ratio, Math.sqrt(area * ratio));
  const h = w / ratio;
  const box = { x: left ? cx : cx - w / 2, y: cy - h / 2, w, h };
  slide.addImage({ path: file, ...box });
  return box;
}

/**
 * White client-logo card with a soft shadow (Figma "Logo Box", 392×181 px) and the logo centred in it.
 * Title with client logo + image, Content: heading + bullets B. transparency: 10 for B/C's 90% white.
 */
function addLogoCard(slide, file, x, y, w = 2.722, h = 1.254, { transparency } = {}) {
  slide.addShape("rect", {
    x, y, w, h, fill: { color: C.white, ...(transparency ? { transparency } : {}) }, line: { type: "none" },
    shadow: { type: "outer", color: C.midnight, opacity: 0.15, blur: 10, offset: 3, angle: 90 },
  });
  addLogoFit(slide, file, x + w / 2, y + h / 2, { maxW: w * 0.592, maxH: h * 0.478, area: 0.5 });
}

// ---------------------------------------------------------------------------
// Cards, pills, placeholders (native shapes, DECISIONS §4)
// ---------------------------------------------------------------------------

/**
 * Native card. Default: rounded rectangle.
 * squareTR: true draws the brand card shape (three rounded corners, top-right square)
 * as custom geometry, still a native, editable shape.
 * r in inches (Figma px / 144). lineW in points (Figma px / 2). line: null for no outline.
 */
function addCard(slide, x, y, w, h, { fill = C.white, line = C.gray800, lineW = 2, r = 0.153, squareTR = false, radii, dash, shadow, transparency } = {}) {
  // radii: [topLeft, topRight, bottomRight, bottomLeft] in inches, for cards with mixed corners
  // (e.g. [0.333, 0, 0, 0.333] = rounded left, square right). shadow: a pptxgenjs shadow object.
  const ln = line ? { color: line, width: lineW, ...(dash ? { dashType: dash } : {}) } : { type: "none" };
  const fl = { color: fill, ...(transparency ? { transparency } : {}) };
  const extra = shadow ? { shadow } : {};
  if (!squareTR && !radii) {
    slide.addShape(r ? "roundRect" : "rect", { x, y, w, h, fill: fl, line: ln, rectRadius: r, ...extra });
    return;
  }
  slide.addShape("custGeom", { x, y, w, h, fill: fl, line: ln, points: cardPoints(w, h, radii || [r, 0, r, r]), ...extra });
}

/** custGeom outline of a w × h rectangle with its own radius per corner [tl, tr, br, bl], clockwise from top left. */
function cardPoints(w, h, [tl, tr, br, bl]) {
  const arc = (rr, stAng) => ({ x: 0, y: 0, curve: { type: "arc", hR: rr, wR: rr, stAng, swAng: 90 } });
  const pts = [{ x: tl, y: 0, moveTo: true }, { x: w - tr, y: 0 }];
  if (tr) pts.push(arc(tr, 270));
  pts.push({ x: w, y: h - br });
  if (br) pts.push(arc(br, 0));
  pts.push({ x: bl, y: h });
  if (bl) pts.push(arc(bl, 90));
  pts.push({ x: 0, y: tl });
  if (tl) pts.push(arc(tl, 180));
  pts.push({ close: true });
  return pts;
}

/**
 * Soft drop shadow for native cards, from a Figma DROP_SHADOW (px): blur and y offset are halved
 * into points, opacity is the shadow colour's alpha. pptxgenjs shadows have no spread.
 */
function figmaShadow(blurPx, offsetYPx, opacity, color = "000000") {
  return { type: "outer", color, opacity, blur: blurPx / 2, offset: offsetYPx / 2, angle: 90 };
}

// Gradient images whose PNG includes a drop shadow: [left, top, right, bottom] shadow margin and the
// shape's own size, in Figma px. addGradientShape() uses them to put the shape itself where you ask.
const SHAPE_PADS = {
  statCardGradient1:    { pad: [24, 0, 24, 48], w: 357, h: 274 },
  gradientOutlineCard1: { pad: [24, 10, 24, 38], w: 846, h: 122 },
  gradientOutlineCard2: { pad: [24, 10, 24, 38], w: 616, h: 200 },
  gradientOutlineCard3: { pad: [24, 10, 24, 38], w: 959, h: 492 },
};

/**
 * Gradient element (an ASSETS key) placed so that the shape, not its shadow, fills x, y, w, h.
 * Aspect-locked: the shape is fitted inside w × h from its top-left corner. Returns the box it used.
 */
function addGradientShape(slide, key, x, y, w, h) {
  const file = ASSETS[key];
  if (!file) throw new Error(`addGradientShape: unknown ASSETS key "${key}"`);
  const px = imageSize(file); // 2x file
  const meta = SHAPE_PADS[key] || { pad: [0, 0, 0, 0], w: px.w / 2, h: px.h / 2 };
  const k = Math.min(w / meta.w, h / meta.h);           // inches per Figma px
  const [l, t] = meta.pad;
  slide.addImage({ path: file, x: x - l * k, y: y - t * k, w: (px.w / 2) * k, h: (px.h / 2) * k });
  return { x, y, w: meta.w * k, h: meta.h * k };
}

/**
 * Native pill (fully rounded) with its label, as one editable shape.
 */
function addPill(slide, text, x, y, w, h, { fill = C.midnight, line = null, lineW = 2, color = C.white, fontFace = FONT, fontSize = 12, bold = true, charSpacing = 0 } = {}) {
  slide.addText(text, {
    shape: "roundRect", x, y, w, h, rectRadius: h / 2,
    fill: { color: fill }, line: line ? { color: line, width: lineW } : { type: "none" },
    fontFace, fontSize, bold, color, charSpacing, align: "center", valign: "middle", margin: 0,
  });
}

/**
 * Placeholder for a customer logo, headshot or illustration the skill doesn't bundle.
 * kind: "logo" | "photo" | "image". shape: "rect" | "ellipse" | "card" (brand card shape).
 * Pass path: to place the real file instead (logos: assets/logos/ or the Figma Logo Archive).
 * fit: "cover" fills the box and crops the overflow (photos; the default for "photo" / "image").
 *      "contain" shows the whole image at its own ratio, centred (logos, and cut-outs such as product
 *      shots or phone mock-ups on a transparent PNG). With a file it returns the box the image fills.
 */
function addPlaceholder(slide, kind, x, y, w, h, { shape = "rect", r = 0.153, radii, onDark = false, path: file, fit } = {}) {
  // shape "round": rounded rectangle with radius r, or per-corner radii [tl, tr, br, bl].
  if (file) {
    // pptxgenjs can't read an image's size, so fit by the file's own aspect ratio.
    const px = imageSize(file);
    const ratio = px.w / px.h;
    if ((fit || (kind === "logo" ? "contain" : "cover")) === "contain") { // whole image inside the box, centred
      const iw = Math.min(w, h * ratio), ih = iw / ratio;
      const box = { x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih };
      slide.addImage({ path: file, ...box });
      return box;
    }
    const iw = Math.max(w, h * ratio), ih = iw / ratio; // cover: fill the box, crop the overflow
    slide.addImage({ path: file, x, y, w: iw, h: ih, rounding: shape === "ellipse", sizing: { type: "cover", w, h } });
    return { x, y, w, h };
  }
  const fill = onDark ? C.darkIndigo : C.gray950;
  const line = { color: C.gray700, width: 1, dashType: "dash" };
  if (shape === "card") addCard(slide, x, y, w, h, { fill, line: C.gray700, lineW: 1, r, squareTR: true, dash: "dash" });
  else if (shape === "round") addCard(slide, x, y, w, h, { fill, line: C.gray700, lineW: 1, r, radii, dash: "dash" });
  else slide.addShape(shape === "ellipse" ? "ellipse" : "rect", { x, y, w, h, fill: { color: fill }, line });
  slide.addText(kind === "logo" ? "Logo" : kind === "photo" ? "Photo" : "Image", {
    x, y, w, h, fontFace: FONT, fontSize: 10, color: onDark ? C.gray700 : C.soft,
    align: "center", valign: "middle", margin: 0,
  });
}

// ---------------------------------------------------------------------------
// Icons (Material Symbols Rounded, assets/icons/; pick names from references/icon-index.md)
// ---------------------------------------------------------------------------

let warnedNoResvg = false;

/**
 * Material Symbols Rounded icon from assets/icons/<name>.svg (Figma Icon Library 18:782),
 * recoloured, at size × size inches. Embedded as a PNG rendered at build time, because
 * Keynote shows pptxgenjs's SVGs as broken images. Falls back to SVG without @resvg/resvg-js.
 */
let iconPack = null;
function addIcon(slide, name, x, y, size, color = C.midnight) {
  // Icons ship packed in assets/icons/icons.json (one file keeps the package under claude.ai's file limit).
  if (!iconPack) { const pf = path.join(ICON_DIR, "icons.json"); iconPack = fs.existsSync(pf) ? JSON.parse(fs.readFileSync(pf, "utf8")) : {}; }
  const file = path.join(ICON_DIR, `${name}.svg`);
  const raw = iconPack[name] || (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null);
  if (!raw) throw new Error(`Unknown icon "${name}": pick a name from references/icon-index.md`);
  const svg = raw
    .replace(/\sfill="[^"]*"/g, "")
    .replace(/<path\b/g, `<path fill="#${color}"`);
  if (Resvg) {
    const png = new Resvg(svg, { fitTo: { mode: "width", value: Math.round(size * 576) } }).render().asPng(); // 4× at 144 dpi
    slide.addImage({ data: "image/png;base64," + png.toString("base64"), x, y, w: size, h: size });
    return;
  }
  if (!warnedNoResvg) {
    console.warn("addIcon: @resvg/resvg-js isn't installed, so icons are embedded as SVG (they won't show in Keynote). Run npm install in the skill folder.");
    warnedNoResvg = true;
  }
  slide.addImage({ data: "image/svg+xml;base64," + Buffer.from(svg).toString("base64"), x, y, w: size, h: size });
}

/**
 * Icon tile from Figma: 76px circle in the tint colour at 12% opacity, 46px glyph centred.
 * d is the tile diameter in inches (76px = 0.528).
 * solid: true is Figma's Solid style: the circle filled in the tint colour (glyph Midnight by default).
 */
function addIconTile(slide, name, x, y, { tint, color, d = 0.528, solid = false } = {}) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: solid ? { color: tint } : { color: tint, transparency: 88 }, line: { type: "none" } });
  const g = d * 46 / 76;
  addIcon(slide, name, x + (d - g) / 2, y + (d - g) / 2, g, color || (solid ? C.midnight : tint));
}

// Icon tile colours by section (Cameron, 2026-10-20). The n-th section with icons on a slide takes
// colour n: a labelled group of items, or a separate block such as a dark side panel. One section:
// every icon is the first colour. Light backgrounds use Figma's Tinted tiles (Icon Tile 27:846);
// dark backgrounds use its Solid tiles with a Midnight glyph (Icon Tile Dark 32:857).
const TILE_COLORS = {
  light: [C.green, C.piercingPitaya, C.cyan400, C.midnight],            // Brand Green, Flamingo Pink, Tile Teal, Midnight
  dark:  [C.groovyGreen, C.piercingPitaya, C.intenseCyan, C.neonCarrot], // Groovy Green, Flamingo Pink, Intense Cyan, Neon Carrot
};

/** Tile colour for the section'th section with icons (0-based) on a light or dark background. */
function tileColor(section = 0, isDark = false) {
  const seq = isDark ? TILE_COLORS.dark : TILE_COLORS.light;
  return seq[((section % seq.length) + seq.length) % seq.length];
}

/**
 * Icon tile coloured by section: Tinted on light (glyph in the colour), Solid on dark (Midnight glyph).
 * isDark is what the tile sits on (a white card on a dark slide is light).
 */
function addSectionTile(slide, name, x, y, { section = 0, isDark = false, d = 0.528 } = {}) {
  const color = tileColor(section, isDark);
  if (isDark) addIconTile(slide, name, x, y, { tint: color, color: C.midnight, d, solid: true });
  else addIconTile(slide, name, x, y, { tint: color, color, d });
}

// ---------------------------------------------------------------------------
// Photo accents (Cameron, 2026-10-20): an optional colour for the shapes around people's photos.
// null keeps the recipe's Figma look. Team's round headshots get a ring only, never a colour behind
// the photo; Org chart's offset tile takes the colour in full.
// ---------------------------------------------------------------------------

const PHOTO_ACCENTS = { cyan: C.intenseCyan, pink: C.piercingPitaya, green: C.groovyGreen };

/** Hex for a photo accent name ("cyan" | "pink" | "green"); null / undefined → null (the recipe's default). */
function photoAccent(accent) {
  if (accent == null) return null;
  const hex = PHOTO_ACCENTS[accent];
  if (!hex) throw new Error(`Unknown photo accent "${accent}": use "cyan", "pink", "green" or null`);
  return hex;
}

/**
 * Ring in a photo accent around a round headshot whose outer box is x, y, d × d. Drawn on top of the
 * photo and inside its edge, as Figma's inside stroke (11 px = 0.077"), so the area behind the photo
 * keeps its own colour. Draws nothing when accent is null.
 */
function addPhotoRing(slide, x, y, d, accent, { ring = 0.077 } = {}) {
  const color = photoAccent(accent);
  if (!color) return;
  slide.addShape("ellipse", {
    x: x + ring / 2, y: y + ring / 2, w: d - ring, h: d - ring,
    fill: { type: "none" }, line: { color, width: ring * 72 },
  });
}

// ---------------------------------------------------------------------------
// Measuring text (for real copy: pills sized to their label, figures that must fit a card)
// ---------------------------------------------------------------------------

// Advance widths read from the bundled Figtree files (cmap + hmtx). Kerning is ignored, so widths run
// up to about 1% long, which errs on the safe side. Google Slides drops letter spacing; PowerPoint
// keeps it, so charSpacing is added.
const fontMetricsCache = {};
function fontMetrics(file) {
  if (fontMetricsCache[file]) return fontMetricsCache[file];
  const b = fs.readFileSync(file);
  const tables = {};
  for (let i = 0; i < b.readUInt16BE(4); i++) {
    const o = 12 + 16 * i;
    tables[b.toString("ascii", o, o + 4)] = b.readUInt32BE(o + 8);
  }
  const upem = b.readUInt16BE(tables.head + 18);
  const nH = b.readUInt16BE(tables.hhea + 34);
  const adv = gid => b.readUInt16BE(tables.hmtx + 4 * Math.min(gid, nH - 1));
  const cm = tables.cmap;
  let sub = null;
  for (let i = 0; i < b.readUInt16BE(cm + 2); i++) {
    const pid = b.readUInt16BE(cm + 4 + 8 * i), eid = b.readUInt16BE(cm + 6 + 8 * i), off = cm + b.readUInt32BE(cm + 8 + 8 * i);
    const fmt = b.readUInt16BE(off);
    if ((pid === 3 && (eid === 1 || eid === 10)) || pid === 0) if (fmt === 12 || (fmt === 4 && !(sub && sub.fmt === 12))) sub = { fmt, off };
  }
  const glyph = ch => {
    const c = ch.codePointAt(0);
    if (sub.fmt === 12) {
      for (let g = 0, n = b.readUInt32BE(sub.off + 12); g < n; g++) {
        const o = sub.off + 16 + 12 * g, s = b.readUInt32BE(o), e = b.readUInt32BE(o + 4);
        if (c >= s && c <= e) return b.readUInt32BE(o + 8) + c - s;
      }
      return 0;
    }
    const segX2 = b.readUInt16BE(sub.off + 6), ends = sub.off + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
    for (let i = 0; i < segX2; i += 2) {
      if (c > b.readUInt16BE(ends + i)) continue;
      const s = b.readUInt16BE(starts + i);
      if (c < s) return 0;
      const ro = b.readUInt16BE(ranges + i), delta = b.readUInt16BE(deltas + i);
      if (!ro) return (c + delta) & 0xffff;
      const g = b.readUInt16BE(ranges + i + ro + 2 * (c - s));
      return g ? (g + delta) & 0xffff : 0;
    }
    return 0;
  };
  return (fontMetricsCache[file] = { upem, width: ch => adv(glyph(ch)) });
}

/** Font file for a text option set: fontFace FONT / FONT_MEDIUM / FONT_SEMI / FONT_EXTRA, plus bold. */
function fontFileFor({ fontFace = FONT, bold = false } = {}) {
  if (fontFace === FONT_EXTRA) return ASSETS.fontExtraBold;
  if (fontFace === FONT_SEMI) return ASSETS.fontSemiBold;
  if (fontFace === FONT_MEDIUM) return ASSETS.fontMedium;
  return bold ? ASSETS.fontBold : ASSETS.fontRegular;
}

/** Width of one line of text in inches, at fontSize (pt) with charSpacing (pt), in Figtree. */
function textWidth(text, { fontSize = 18, charSpacing = 0, fontFace = FONT, bold = false } = {}) {
  const m = fontMetrics(fontFileFor({ fontFace, bold }));
  const chars = [...String(text)];
  const units = chars.reduce((sum, ch) => sum + m.width(ch), 0);
  return (units / m.upem * fontSize + charSpacing * chars.length) / 72;
}

/** Largest font size from max down to min (0.5 pt steps) at which every line of text fits in w inches. */
function fitFontSize(text, w, { max, min = 8, ...opts } = {}) {
  const lines = String(text).split("\n");
  for (let size = max; size > min; size -= 0.5) {
    if (lines.every(l => textWidth(l, { ...opts, fontSize: size, charSpacing: (opts.charSpacing || 0) * size / max }) <= w)) return size;
  }
  return min;
}

/** Number of lines text wraps to in a w-inch box (greedy, at spaces; hard breaks kept). */
function wrapLines(text, w, opts = {}) {
  return String(text).split("\n").reduce((total, para) => {
    let lines = 1, line = "";
    for (const word of para.split(" ")) {
      const next = line ? line + " " + word : word;
      if (line && textWidth(next, opts) > w) { lines++; line = word; } else line = next;
    }
    return total + lines;
  }, 0);
}

/**
 * Gradient Highlight 1 (Figma 10:724: 234×28 px, Intense Cyan → Laser Lemon) at any width, the way
 * Figma resizes it: the gradient is rendered for the new box, not stretched. Put it under a big
 * figure at the figure's width (textWidth). Falls back to the 234 px PNG without @resvg/resvg-js.
 */
function addGradientHighlight(slide, x, y, w, h = 0.194) {
  // Gradient vector from Figma's gradientTransform, in box units. At 234 px it matches
  // gradient-highlight-1.png to a mean of 5 / 255 per channel (max 14).
  if (!Resvg) { slide.addImage({ path: ASSETS.gradientHighlight, x, y, w: 1.625, h: 0.194 }); return; }
  const pw = Math.round(w * 288), ph = Math.round(h * 288); // 2x at 144 px per inch
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><defs>` +
    `<linearGradient id="g" gradientUnits="objectBoundingBox" x1="0.9456" y1="0.2766" x2="0.0986" y2="0.6991">` +
    `<stop offset="0" stop-color="#00FAFF"/><stop offset="1" stop-color="#EAFF00"/></linearGradient></defs>` +
    `<rect width="${pw}" height="${ph}" fill="url(#g)"/></svg>`;
  const png = new Resvg(svg).render().asPng();
  slide.addImage({ data: "image/png;base64," + png.toString("base64"), x, y, w, h });
}

/**
 * Stat Card Gradient 2 (Figma 10:722: Intense Cyan → Laser Lemon, rounded corners) at any size, the way
 * Figma resizes it: the gradient is rendered for the new box, not stretched. Recipe 28 F's hero card.
 * r is the corner radius in inches (18.5 px as designed). Falls back to the 553×286 PNG, cropped to
 * the box, without @resvg/resvg-js.
 */
function addStatCardGradient(slide, x, y, w, h, { r = 0.129 } = {}) {
  if (!Resvg) { slide.addImage({ path: ASSETS.statCardGradient2, x, y, w, h, sizing: { type: "cover", w, h } }); return; }
  const pw = Math.round(w * 288), ph = Math.round(h * 288), pr = Math.round(r * 288); // 2x at 144 px per inch
  // Figma's gradientTransform for 10:722, inverted: gradient space (stops along x) → the box's unit square
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><defs>` +
    `<linearGradient id="g" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" ` +
    `gradientTransform="matrix(-0.74494 1.73907 -0.56085 -2.42689 1.24510 1.15824)">` +
    `<stop offset="0" stop-color="#00FAFF"/><stop offset="1" stop-color="#EAFF00"/></linearGradient></defs>` +
    `<rect width="${pw}" height="${ph}" rx="${pr}" ry="${pr}" fill="url(#g)"/></svg>`;
  const png = new Resvg(svg).render().asPng();
  slide.addImage({ data: "image/png;base64," + png.toString("base64"), x, y, w, h });
}

/**
 * Stat strip: up to 4 figures side by side in a Gray-950 band (Midnight on dark slides), each with a
 * short caption to its right and a thin divider between cells. A part for building one slide from the
 * skill's pieces (a logo grid with numbers under it, say). Figures are Green #009A50 on light and
 * Groovy Green on dark (green rule), shrunk to fit their cell. Text is the user's, as given.
 * stats: [{ num: "500+", text: "Enterprise brands partner with Ordergroove" }]. label: optional caps label above.
 */
function addStatStrip(slide, stats, x, y, w, h = 0.9, { isDark = false, label } = {}) {
  if (label) {
    sectionLabel(slide, label, x + 0.167, y, accentColor(isDark));
    y += 0.36;
  }
  addCard(slide, x, y, w, h, { fill: isDark ? C.darkIndigo : C.gray950, line: null, r: 0.069 });
  const cellW = w / stats.length, pad = 0.2;
  stats.forEach((st, i) => {
    const cx = x + i * cellW;
    if (i) slide.addShape("line", { x: cx, y: y + 0.18, w: 0, h: h - 0.36, line: { color: isDark ? C.soft : C.gray800, width: 1 } });
    const numW = Math.min(cellW * 0.45, textWidth(st.num, { fontSize: 22, bold: true }) + 0.05);
    const size = fitFontSize(st.num, numW, { max: 22, min: 14, bold: true });
    slide.addText(st.num, {
      x: cx + pad, y, w: numW, h, fontFace: FONT, fontSize: size, bold: true, color: accentColor(isDark), valign: "middle", margin: 0,
    });
    slide.addText(st.text, {
      x: cx + pad + numW + 0.12, y, w: cellW - 2 * pad - numW - 0.12, h,
      fontFace: FONT, fontSize: 10, color: isDark ? C.white : C.darkIndigo, lineSpacing: 13, valign: "middle", margin: 0,
    });
  });
  return { x, y, w, h };
}

// ---------------------------------------------------------------------------
// Charts as native shapes (default build; see SKILL.md "Charts")
// ---------------------------------------------------------------------------

/**
 * Round value-axis scale for a 0-based chart: the smallest "nice" step (1, 2, 2.5, 5 × 10^n)
 * that fits maxValue in at most maxTicks steps, and the max it rounds up to. 103 → { max: 120, step: 20 }.
 */
function niceAxis(maxValue, maxTicks = 6) {
  const raw = maxValue / maxTicks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(st => st >= raw);
  return { max: Math.ceil(maxValue / step) * step, step };
}

/**
 * Gridlines, value labels, rotated axis title and category labels for a shape chart
 * (Figma "Chart (bar)" 1:1411 / "Chart (line)" 58:874). x, y, w, h = the plot area.
 * The axis line itself is drawn by the caller, so it can sit above or below the series.
 */
function chartAxes(slide, { x, y, w, h, labels, max, step, format = String, axisTitle }) {
  const yOf = v => y + h - (v / max) * h;
  const slot = w / labels.length;
  const xOf = i => x + slot * (i + 0.5);

  // Gridlines (1 px Gray-800) and value labels (20 px Medium Gray-400, right edge 20 px left of the plot)
  for (let v = step; v <= max + 1e-9; v += step) {
    slide.addShape("line", { x, y: yOf(v), w, h: 0, line: { color: C.gray800, width: 0.5 } });
  }
  for (let v = 0; v <= max + 1e-9; v += step) {
    slide.addText(format(v), {
      x: x - 0.695, y: yOf(v) - 0.097, w: 0.556, h: 0.194,
      fontFace: FONT_MEDIUM, fontSize: 10, color: C.soft, align: "right", valign: "middle", margin: 0,
    });
  }
  // Axis title (24 px SemiBold Gray-200), rotated, centred on the plot
  if (axisTitle) {
    slide.addText(axisTitle, {
      x: x - 0.778 - h / 2, y: y + h / 2 - 0.146, w: h, h: 0.292, rotate: 270,
      fontFace: FONT_SEMI, fontSize: 12, color: C.darkIndigo, align: "center", valign: "middle", margin: 0,
    });
  }
  // Category labels (20 px SemiBold Gray-400), 12 px below the axis
  labels.forEach((label, i) => slide.addText(label, {
    x: xOf(i) - slot / 2, y: y + h + 0.083, w: slot, h: 0.257,
    fontFace: FONT_SEMI, fontSize: 10, color: C.soft, align: "center", valign: "top", margin: 0,
  }));
  return { yOf, xOf, slot };
}

/**
 * Line chart drawn as native shapes (Figma "Chart (line)" 58:874), so it looks the same in
 * Google Slides, PowerPoint and Keynote. x, y, w, h = the plot area (the gridlines), in inches.
 * Value labels go left of it, category labels below, the axis title further left, rotated.
 * series: [{ name, values }], one colour per series. Each series is one editable polyline
 * plus a dot per point. Points sit in the middle of equal slots, as in a PowerPoint chart.
 */
function drawLineChart(slide, { x, y, w, h, labels, series, colors, max, step, format = String, axisTitle }) {
  const { yOf, xOf } = chartAxes(slide, { x, y, w, h, labels, max, step, format, axisTitle });
  // Axis line (2 px Midnight)
  slide.addShape("line", { x, y: y + h, w, h: 0, line: { color: C.midnight, width: 1 } });

  // Series, last first so series 1 sits on top: 5 px line, 18 px dots
  series.map((sr, i) => [sr, i]).reverse().forEach(([sr, i]) => {
    const pts = sr.values.map((v, j) => ({ px: xOf(j), py: yOf(v) }));
    const left = Math.min(...pts.map(p => p.px)), top = Math.min(...pts.map(p => p.py));
    const right = Math.max(...pts.map(p => p.px)), bottom = Math.max(...pts.map(p => p.py));
    slide.addShape("custGeom", {
      x: left, y: top, w: Math.max(right - left, 0.01), h: Math.max(bottom - top, 0.01),
      points: pts.map((p, j) => ({ x: p.px - left, y: p.py - top, ...(j === 0 ? { moveTo: true } : {}) })),
      line: { color: colors[i], width: 2.5 },
    });
    pts.forEach(p => slide.addShape("ellipse", {
      x: p.px - 0.0625, y: p.py - 0.0625, w: 0.125, h: 0.125,
      fill: { color: colors[i] }, line: { type: "none" },
    }));
  });
}

/**
 * Column chart drawn as native shapes (Figma "Chart (bar)" 1:1411). Same frame and axes as
 * drawLineChart. Each category gets an equal slot holding one bar per series, side by side
 * (Figma: 79 px bars, 15 px apart, in a 240 px slot). Value labels sit just above each bar
 * (12 pt SemiBold Midnight). Bars are plain rectangles: to change the numbers, rebuild the slide.
 */
function drawBarChart(slide, { x, y, w, h, labels, series, colors, max, step, format = String, axisTitle, valueLabels = true }) {
  const { yOf, slot } = chartAxes(slide, { x, y, w, h, labels, max, step, format, axisTitle });
  const n = series.length;
  const barW = Math.min(slot * 0.33, (slot * 0.8) / n);
  const gap = n > 1 ? Math.min(slot * 0.063, (slot * 0.9 - n * barW) / (n - 1)) : 0;
  const groupW = n * barW + (n - 1) * gap;

  series.forEach((sr, si) => sr.values.forEach((v, j) => {
    const bx = x + slot * j + (slot - groupW) / 2 + si * (barW + gap);
    const top = yOf(v);
    slide.addShape("rect", {
      x: bx, y: top, w: barW, h: Math.max(y + h - top, 0.001),
      fill: { color: colors[si] }, line: { type: "none" },
    });
    if (valueLabels) slide.addText(format(v), {
      x: bx - 0.25, y: top - 0.26, w: barW + 0.5, h: 0.22,
      fontFace: FONT_SEMI, fontSize: 12, color: C.midnight, align: "center", valign: "bottom", margin: 0,
    });
  }));
  // Axis line (2 px Midnight), drawn over the bar bottoms
  slide.addShape("line", { x, y: y + h, w, h: 0, line: { color: C.midnight, width: 1 } });
}

// ---------------------------------------------------------------------------
// v2.1 helpers kept for the recipes that still use them
// ---------------------------------------------------------------------------

/**
 * Gradient callout card (gradient-callout-N.png: white card + gradient shadow, 539×620 px).
 * Draws only the PNG, at its own 0.87:1 aspect ratio, fitted inside w × h from (x, y).
 * Returns the text box inside the white card (0.25" padding).
 * cardIndex: 1-4 selects the PNG (2 and 4 are the same file).
 */
function addGradientCard(slide, x, y, w, h, cardIndex) {
  const gradientAssets = [
    ASSETS.gradientCard1, ASSETS.gradientCard2,
    ASSETS.gradientCard3, ASSETS.gradientCard4,
  ];
  const asset = gradientAssets[(cardIndex - 1) % 4];
  const ratio = 539 / 620;
  const iw = Math.min(w, h * ratio), ih = iw / ratio;
  slide.addImage({ path: asset, x, y, w: iw, h: ih });
  // The white card spans px 4–513 × 4–595 of the 539×620 image; the rest is the gradient shadow.
  const cx = x + iw * 4 / 539, cy = y + ih * 4 / 620;
  const cw = iw * 509 / 539, ch = ih * 591 / 620;
  return { x: cx + 0.25, y: cy + 0.25, w: cw - 0.5, h: ch - 0.5, card: { x: cx, y: cy, w: cw, h: ch } };
}

/**
 * Place the gradient quotation mark icon (71×56 px), at its own aspect ratio.
 */
function addQuoteIcon(slide, x, y, w = 0.55) {
  slide.addImage({
    path: ASSETS.quotation,
    x, y, w, h: w * 56 / 71,
  });
}

/**
 * v2.1 logo-box frame (202×140 px), fitted inside w × h at its own aspect ratio. No 2.0 recipe
 * uses it: Figma's logo cards are native shapes. Kept so older build scripts still run.
 */
function addLogoBox(slide, x, y, w, h) {
  const ratio = 202 / 140;
  const iw = Math.min(w, h * ratio), ih = iw / ratio;
  slide.addImage({
    path: ASSETS.logoBox,
    x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih,
  });
}

// ---------------------------------------------------------------------------
// Line spacing (audit/GSLIDES-SPACING-AUDIT.md)
// ---------------------------------------------------------------------------

// Recipes set line spacing in points (`lineSpacing`, Figma's line height px ÷ 2). Google Slides has
// no exact spacing: on import it turns the points into a multiple of the font size and applies that
// to Figtree's natural line height, so every line came out 20% taller. A percentage is measured
// against the natural line height in PowerPoint, Keynote, LibreOffice and Google Slides alike, so
// newPresentation() converts points to a percentage here and every app shows the recipe's pitch.
const FIGTREE_LINE_HEIGHT = 1.2;  // hhea ascent 950 + descent 250, per 1000 units (all 5 weights)
const DEFAULT_FONT_SIZE = 18;     // pptxgenjs default when a text box sets no fontSize

/** Text options with `lineSpacing` (points) swapped for the equivalent `lineSpacingMultiple`. */
function lineSpacingAsMultiple(o, fontSize) {
  if (!o || !o.lineSpacing || o.lineSpacingMultiple) return o;
  const { lineSpacing, ...rest } = o;
  return { ...rest, lineSpacingMultiple: lineSpacing / ((fontSize || DEFAULT_FONT_SIZE) * FIGTREE_LINE_HEIGHT) };
}

/**
 * slide.addText arguments with every point line spacing converted, for one string or an array of
 * runs. A run takes its own fontSize and lineSpacing, else the text box's (as pptxgenjs does).
 * Copies, never mutates: recipes reuse option objects across slides.
 */
function convertLineSpacing(text, opts) {
  if (!Array.isArray(text)) return [text, lineSpacingAsMultiple(opts, opts && opts.fontSize)];
  const box = opts || {};
  const runs = text.map(run => {
    const o = run && run.options ? run.options : {};
    const lineSpacing = o.lineSpacing || box.lineSpacing;
    if (!lineSpacing || o.lineSpacingMultiple) return run;
    return { ...run, options: lineSpacingAsMultiple({ ...o, lineSpacing }, o.fontSize || box.fontSize) };
  });
  return [runs, lineSpacingAsMultiple(opts, box.fontSize)];
}

// ---------------------------------------------------------------------------
// Presentation
// ---------------------------------------------------------------------------

/**
 * Create a new PptxGenJS presentation pre-configured for LAYOUT_WIDE.
 * Its slides' addText converts point line spacing to a percentage (see convertLineSpacing).
 * Theme fonts are Figtree: pptxgenjs defaults to Calibri Light / Calibri, which numbered bullets and
 * any text added later in PowerPoint or Google Slides would pick up.
 * audience: "internal" (footer keeps the confidentiality line) or "external" (customers, prospects,
 * partners: no line). See SKILL.md "Footer" for how to choose. Missing → internal, with a warning.
 */
function newPresentation({ title = "Ordergroove", author = "Ordergroove", company = "Ordergroove", audience } = {}) {
  if (audience === undefined) {
    console.warn('newPresentation: no audience given, so the footer keeps "Confidential and proprietary. Do not distribute." Pass audience: "internal" or "external".');
    audience = "internal";
  }
  if (!AUDIENCES.includes(audience)) throw new Error(`newPresentation: audience must be "internal" or "external", not "${audience}"`);
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
  pres.title = title;
  pres.author = author;
  pres.company = company;
  pres.audience = audience;
  const addSlide = pres.addSlide.bind(pres);
  pres.addSlide = (...args) => {
    const slide = addSlide(...args);
    slide._ogAudience = audience; // read by addFooter / addFooterText
    const addText = slide.addText.bind(slide);
    slide.addText = (text, opts) => addText(...convertLineSpacing(text, opts));
    return slide;
  };
  return pres;
}

/**
 * Save the presentation to an absolute path.
 */
async function saveTo(pres, absPath) {
  await pres.writeFile({ fileName: absPath, compression: true });
  return absPath;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  W, H, SAFE,
  C, FONT, FONT_MEDIUM, FONT_SEMI, FONT_EXTRA,
  ASSETS, SKILL_ROOT, BRAND_DIR, ICON_DIR, LOGO_DIR,
  accentColor, subtitleColor, sectionLabel,
  imageSize,
  addFooter, addFooterText, addLogo, customerLogo, addLogoFit, addLogoCard,
  addCard, addPill, addPlaceholder, figmaShadow, addGradientShape,
  addIcon, addIconTile, TILE_COLORS, tileColor, addSectionTile,
  PHOTO_ACCENTS, photoAccent, addPhotoRing,
  textWidth, fitFontSize, wrapLines, addGradientHighlight, addStatCardGradient, addStatStrip,
  niceAxis, chartAxes, drawLineChart, drawBarChart,
  addGradientCard, addQuoteIcon, addLogoBox,
  newPresentation, saveTo,
  PptxGenJS,
};
