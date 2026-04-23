// Ordergroove Slides — shared build helpers
//
// Every layout recipe in references/layout-recipes.md imports from this file.
// It centralizes the brand constants, asset paths, and helpers that enforce
// the brand rules teammates would otherwise get wrong (most notably the
// Green vs Groovy Green contrast rule).
//
// Usage from a build script:
//   const { pres, C, FONT, W, H, ASSETS,
//           accentColor, addFooter, addLogo, sectionLabel,
//           addGradientCard, addQuoteIcon, addLogoBox,
//           newPresentation, saveTo } = require("./build");

const path = require("path");
const PptxGenJS = require("pptxgenjs");

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

const W = 13.333;
const H = 7.5;

// ---------------------------------------------------------------------------
// Color palette — sourced from Figma design system (Skill_Presentation)
// ---------------------------------------------------------------------------

const C = {
  // Primary
  midnight:     "17132F",
  darkIndigo:   "2E2A47",  // Figma: Gray-200
  green:        "009A50",  // accent on LIGHT backgrounds
  groovyGreen:  "00FF85",  // accent on DARK backgrounds
  intenseCyan:  "00FAFF",
  neonCarrot:   "FF8500",
  laserLemon:   "EAFF00",
  white:        "FFFFFF",
  gray900:      "EBEAF0",  // subtitle on dark
  gray800:      "D8D7DF",  // borders, dividers

  // Secondary text
  muted:      "4F4A6A",  // secondary body on light
  soft:       "666279",  // tertiary/caption on light

  // Chart sequence extras
  teal:       "00C8CC",
  deepTeal:   "009699",
  steelBlue:  "28639D",

  // Convenience aliases
  bodyDark:   "17132F",
  bodyLight:  "FFFFFF",
  offWhite:   "F5F5F5",
};

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

const FONT = "Figtree";
const FONT_SEMI = "Figtree SemiBold";
const FONT_EXTRA = "Figtree ExtraBold";

// ---------------------------------------------------------------------------
// Asset paths (absolute, relative to the skill root)
// ---------------------------------------------------------------------------

const SKILL_ROOT = path.resolve(__dirname, "..");
const BRAND_DIR  = path.join(SKILL_ROOT, "assets", "brand");

const ASSETS = {
  // Backgrounds
  bgDivider:       path.join(BRAND_DIR, "bg-divider.png"),
  bgContent:       path.join(BRAND_DIR, "bg-content.png"),
  testimonialDark: path.join(BRAND_DIR, "testimonial-bg-dark.png"),
  testimonialLight:path.join(BRAND_DIR, "testimonial-bg-light.png"),

  // Footer + logos
  footer:    path.join(BRAND_DIR, "Footer.png"),
  logoDark:  path.join(BRAND_DIR, "logo-dark.png"),
  logoWhite: path.join(BRAND_DIR, "logo-white.png"),

  // Design elements
  logoBox:       path.join(BRAND_DIR, "logo-box.png"),
  quotation:     path.join(BRAND_DIR, "quotation.png"),
  gradientCard1: path.join(BRAND_DIR, "gradient-callout-1.png"),
  gradientCard2: path.join(BRAND_DIR, "gradient-callout-2.png"),
  gradientCard3: path.join(BRAND_DIR, "gradient-callout-3.png"),
  gradientCard4: path.join(BRAND_DIR, "gradient-callout-4.png"),

  // Fonts
  fontRegular:   path.join(BRAND_DIR, "fonts", "Figtree-Regular.ttf"),
  fontMedium:    path.join(BRAND_DIR, "fonts", "Figtree-Medium.ttf"),
  fontSemiBold:  path.join(BRAND_DIR, "fonts", "Figtree-SemiBold.ttf"),
  fontBold:      path.join(BRAND_DIR, "fonts", "Figtree-Bold.ttf"),
  fontExtraBold: path.join(BRAND_DIR, "fonts", "Figtree-ExtraBold.ttf"),
};

// ---------------------------------------------------------------------------
// Helpers
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
 */
function subtitleColor(isDark) {
  return isDark ? C.gray900 : C.darkIndigo;
}

/**
 * Place the universal footer bar flush against the slide's bottom edge.
 * Footer.png is a rasterized full-width bar with the logo + confidentiality
 * text baked in. Every slide gets one — no exceptions.
 */
function addFooter(slide) {
  slide.addImage({
    path: ASSETS.footer,
    x: 0, y: H - 0.75, w: W, h: 0.75,
  });
}

/**
 * Place the Ordergroove wordmark on a title or closing slide.
 * Only use on title and closing — content/divider slides stay clean.
 * Logo source is 1204×450px (aspect ratio 2.676:1).
 * At w=1.5", correct h=0.56" to prevent warping.
 */
function addLogo(slide, onDark) {
  slide.addImage({
    path: onDark ? ASSETS.logoDark : ASSETS.logoWhite,
    x: 0.55, y: 0.45, w: 1.5, h: 0.56,
  });
}

/**
 * ALL-CAPS tracked section label above an H1.
 */
function sectionLabel(slide, text, x, y, color) {
  slide.addText(String(text).toUpperCase(), {
    x, y, w: 6.0, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true,
    color: color || C.green,
    charSpacing: 4, margin: 0,
  });
}

/**
 * Place a gradient callout card (shadow image + white rectangle + content).
 * cardIndex: 1-4, selects gradient-callout-N.png
 * Returns {x, y, w, h} of the inner white card for text placement.
 */
function addGradientCard(slide, x, y, w, h, cardIndex) {
  const gradientAssets = [
    ASSETS.gradientCard1, ASSETS.gradientCard2,
    ASSETS.gradientCard3, ASSETS.gradientCard4,
  ];
  const asset = gradientAssets[(cardIndex - 1) % 4];

  // Shadow image (slightly offset right and down)
  slide.addImage({
    path: asset,
    x: x + 0.08, y: y + 0.08, w, h,
  });

  // White card on top
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: C.gray800, width: 1.5 },
    rectRadius: 0.12,
  });

  return { x: x + 0.25, y: y + 0.25, w: w - 0.5, h: h - 0.5 };
}

/**
 * Place the gradient quotation mark icon.
 */
function addQuoteIcon(slide, x, y) {
  slide.addImage({
    path: ASSETS.quotation,
    x, y, w: 0.55, h: 0.4,
  });
}

/**
 * Place a client logo inside the brand logo-box frame.
 */
function addLogoBox(slide, x, y, w, h) {
  slide.addImage({
    path: ASSETS.logoBox,
    x, y, w, h,
  });
}

/**
 * Create a new PptxGenJS presentation pre-configured for LAYOUT_WIDE.
 */
function newPresentation({ title = "Ordergroove", author = "Ordergroove", company = "Ordergroove" } = {}) {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.title = title;
  pres.author = author;
  pres.company = company;
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
  W, H,
  C, FONT, FONT_SEMI, FONT_EXTRA, ASSETS,
  accentColor, subtitleColor,
  addFooter, addLogo, sectionLabel,
  addGradientCard, addQuoteIcon, addLogoBox,
  newPresentation, saveTo,
  PptxGenJS,
};
