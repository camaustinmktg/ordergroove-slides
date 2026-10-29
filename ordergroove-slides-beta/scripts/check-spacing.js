// Spacing check for a built deck: run it after every build, before the visual QA.
//
//   node scripts/check-spacing.js OG-topic-2026-10-20.pptx
//
// For every card and panel (a filled shape at least 1.5 × 1 in), it finds the text, images and
// shapes drawn on top of it and measures the content's real extent. Text height comes from the
// bundled Figtree metrics (wrapLines in build.js), at each paragraph's own size and line spacing.
// It reports:
//   EMPTY BOTTOM / EMPTY TOP  the space below (above) the content is more than 0.45 in bigger than, and at
//                             least twice, the space on the other side: content bunched at one end.
//                             A grid of same-size cards is judged by its fullest card.
//   TIGHT                     content within 0.05 in of the card's top or bottom edge
//   OVERFLOW                  text runs past the card's edge
//   FOOTER                    text or a table within 0.35 in of the footer bar
//   OVERLAP                   text that runs into other text: a 2-line title over its subhead, a wrapped cover title
//                             over its subtitle, a note over a block (added 2026-10-29; these passed every other check)
// A flag is a prompt to look, not an automatic fail: a design can bunch content on purpose. Compare with
// the recipe's Figma render before changing anything. Expected flags on the recipe samples (Figma's own
// spacing): the Case study's stat band, Team B's role lines (0.29 in above Footer Bar 3), and Three-stat
// callout with 4 short figures (the designed empty top band).
// SPACING_DEBUG=1 prints every card's measurements.
// Needs pptxgenjs installed (it brings jszip), like the build.
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const { wrapLines, textWidth, FONT, FONT_MEDIUM, FONT_SEMI, FONT_EXTRA } = require("./build");

const EMU = 914400;
const SLIDE_W = 13.333, SLIDE_H = 7.5;

const num = (s, re, d) => { const m = s.match(re); return m ? Number(m[1]) : d; };

function boxOf(xml) {
  const off = xml.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/), ext = xml.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
  if (!off || !ext) return null;
  return { x: off[1] / EMU, y: off[2] / EMU, w: ext[1] / EMU, h: ext[2] / EMU };
}

// Height of a text body in inches, from its paragraphs.
function textExtent(sp, box) {
  const body = sp.match(/<p:txBody>([\s\S]*?)<\/p:txBody>/);
  if (!body) return null;
  const bp = body[1].match(/<a:bodyPr([^>]*)>/);
  const attrs = bp ? bp[1] : "";
  const ins = k => num(attrs, new RegExp(`${k}="(\\d+)"`), k === "lIns" || k === "rIns" ? 91440 : 45720) / EMU;
  const anchor = (attrs.match(/anchor="(\w+)"/) || [])[1] || "t";
  const width = box.w - ins("lIns") - ins("rIns");
  let h = 0, any = false, left = Infinity, right = -Infinity;
  for (const p of body[1].split(/<\/a:p>/)) {
    if (!/<a:p[ >]/.test(p)) continue;
    const runs = [...p.matchAll(/<a:r>([\s\S]*?)<\/a:r>|<a:br\/>/g)];
    let text = "", size = 0, bold = false, face = FONT;
    for (const r of runs) {
      if (!r[1]) { text += "\n"; continue; }
      const t = (r[1].match(/<a:t>([\s\S]*?)<\/a:t>/) || [])[1] || "";
      text += t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      const rpr = (r[1].match(/<a:rPr([^>]*)/) || [])[1] || "";
      size = Math.max(size, num(rpr, /sz="(\d+)"/, 1800) / 100);
      if (/ b="1"/.test(rpr)) bold = true;
      const tf = (r[1].match(/<a:latin typeface="([^"]+)"/) || [])[1];
      if (tf) face = tf;
    }
    const ppr = (p.match(/<a:pPr[^>]*\/>|<a:pPr[^>]*>[\s\S]*?<\/a:pPr>/) || [""])[0];
    const marL = num(ppr, /marL="(\d+)"/, 0) / EMU;                     // bullets and indents narrow the line
    size = size || num(p, /<a:endParaRPr[^>]*sz="(\d+)"/, 1800) / 100;
    const pct = num(ppr, /<a:lnSpc><a:spcPct val="(\d+)"/, null), pts = num(ppr, /<a:lnSpc><a:spcPts val="(\d+)"/, null);
    const pitch = pct ? (pct / 100000) * 1.2 * size : pts ? pts / 100 : 1.2 * size;
    const bef = num(ppr, /<a:spcBef><a:spcPts val="(\d+)"/, 0) / 100, aft = num(ppr, /<a:spcAft><a:spcPts val="(\d+)"/, 0) / 100;
    if (!text.trim()) { if (runs.length) h += (pitch + bef + aft) / 72; continue; }
    any = true;
    const faceKey = [FONT, FONT_MEDIUM, FONT_SEMI, FONT_EXTRA].includes(face) ? face : FONT;
    const opts = { fontSize: size, bold, fontFace: faceKey };
    const lines = Math.max(1, wrapLines(text, width - marL, opts));
    h += (lines * pitch + bef + aft) / 72;
    // Horizontal extent: the words' own width on one line, else the box's text width; placed by alignment
    const w = lines === 1 ? Math.min(width - marL, Math.max(...text.split("\n").map(t => textWidth(t, opts)))) : width - marL;
    const algn = (ppr.match(/algn="(\w+)"/) || [])[1] || "l";
    const x0 = box.x + ins("lIns") + marL + (algn === "ctr" ? (width - marL - w) / 2 : algn === "r" ? width - marL - w : 0);
    left = Math.min(left, x0); right = Math.max(right, x0 + w);
  }
  if (!any) return null;
  const innerTop = box.y + ins("tIns"), innerH = box.h - ins("tIns") - ins("bIns");
  const top = anchor === "ctr" ? innerTop + (innerH - h) / 2 : anchor === "b" ? innerTop + innerH - h : innerTop;
  return { top, bottom: top + h, left, right };
}

function parseSlide(xml) {
  const items = [];
  const re = /<p:(sp|pic|graphicFrame)>([\s\S]*?)<\/p:\1>/g;
  let m, z = 0;
  while ((m = re.exec(xml))) {
    const [, kind, body] = m;
    const box = boxOf(body);
    if (!box) continue;
    const it = { z: z++, kind, box, name: (body.match(/<p:cNvPr id="\d+" name="([^"]*)"/) || [])[1] || kind };
    it.rotated = /<a:xfrm[^>]*\brot="(?!0")-?\d+"/.test(body); // rotated text (a chart's axis title) isn't measured for OVERLAP
    if (kind === "graphicFrame") { // a table: its real height is the sum of its rows
      const rows = [...body.matchAll(/<a:tr h="(\d+)"/g)].map(r => Number(r[1]) / EMU);
      if (rows.length) it.tableBottom = box.y + rows.reduce((a, b) => a + b, 0);
    }
    if (kind === "sp") {
      const spPr = (body.match(/<p:spPr>([\s\S]*?)<\/p:spPr>/) || [])[1] || "";
      const fill = spPr.match(/^(?:(?!<a:ln)[\s\S])*?<a:solidFill><a:srgbClr val="([0-9A-F]{6})"\s*(?:\/>|>([\s\S]*?)<\/a:srgbClr>)/);
      it.fill = fill ? fill[1] : null;
      it.alpha = fill && fill[2] ? num(fill[2], /<a:alpha val="(\d+)"/, 100000) / 1000 : 100;
      it.line = /prst="line"/.test(spPr);
      const prst = (spPr.match(/<a:prstGeom prst="(\w+)"/) || [])[1];
      // A card shape: a rectangle, a rounded rectangle, or custom geometry made only of straight edges and 90° corners
      it.cardShape = prst === "rect" || prst === "roundRect" ||
        (/<a:custGeom>/.test(spPr) && !/swAng="(?!5400000")\d+"/.test(spPr));
      it.dashed = /<a:prstDash val="(?!solid)\w+"\/>/.test(spPr); // placeholder boxes have dashed outlines
      it.text = textExtent(body, box);
    }
    items.push(it);
  }
  return items;
}

function check(items) {
  const flags = [];
  const footer = items.find(it => it.kind === "pic" && it.box.w > 13 && it.box.y > 6.5 && it.box.h < 1);
  const footerTop = footer ? footer.box.y : null;
  // Cards and panels: filled card shapes, textless, card-sized; not placeholders, the footer or a full-slide background
  const containers = items.filter(it => it.kind === "sp" && it.cardShape && !it.dashed && it.fill && it.alpha >= 50 && !it.text &&
    it.box.w >= 1.5 && it.box.h >= 1.0 && it.box.w < SLIDE_W - 0.5 && it.box.y < 6.6); // full-width bands aren't cards
  const measured = [];
  for (const c of containers) {
    const b = c.box, tol = 0.03;
    // Content = items drawn after the card whose box sits fully inside it (designed overlaps, which cross the edge, don't count)
    const content = items.filter(it => it.z > c.z && it !== footer && !it.line &&
      (it.text ? it.text.left >= b.x - tol && it.text.right <= b.x + b.w + tol : it.box.x >= b.x - tol && it.box.x + it.box.w <= b.x + b.w + tol) &&
      it.box.y >= b.y - tol && (it.text ? it.box.y + Math.min(it.box.h, it.text.bottom - it.box.y) : it.box.y + it.box.h) <= b.y + b.h + tol &&
      (it.kind !== "sp" || it.text || (it.fill && it.box.w < b.w * 0.9)));
    if (!content.length) continue;
    const top = Math.min(...content.map(it => it.text ? it.text.top : it.box.y));
    const bottom = Math.max(...content.map(it => it.text ? it.text.bottom : it.box.y + it.box.h));
    measured.push({ c, topPad: top - b.y, botPad: b.y + b.h - bottom });
  }
  if (process.env.SPACING_DEBUG) measured.forEach(m => console.log("    [debug]", m.c.name, JSON.stringify(m.c.box), "above", m.topPad.toFixed(3), "below", m.botPad.toFixed(3)));
  const where = c => `${c.name} at ${c.box.x.toFixed(2)},${c.box.y.toFixed(2)} (${c.box.w.toFixed(2)} × ${c.box.h.toFixed(2)} in)`;
  const pads = m => `space above ${m.topPad.toFixed(2)} in, below ${m.botPad.toFixed(2)} in`;
  for (const m of measured) {
    if (m.botPad < -0.03) flags.push(`OVERFLOW      ${where(m.c)}: content runs ${(-m.botPad).toFixed(2)} in past the bottom`);
    else if (m.topPad < -0.03) flags.push(`OVERFLOW      ${where(m.c)}: content starts ${(-m.topPad).toFixed(2)} in above the top`);
    else if (m.botPad < 0.05 || m.topPad < 0.05) flags.push(`TIGHT         ${where(m.c)}: ${pads(m)}`);
  }
  // Balance. Same-size cards in a grid share one height, so a short card is expected: judge the grid by its fullest card.
  const groups = [];
  for (const m of measured) {
    const g = groups.find(g => Math.abs(g[0].c.box.w - m.c.box.w) < 0.03 && Math.abs(g[0].c.box.h - m.c.box.h) < 0.03 && g[0].c.fill === m.c.fill);
    g ? g.push(m) : groups.push([m]);
  }
  for (const g of groups) {
    const m = g.reduce((a, b) => (b.botPad < a.botPad ? b : a));
    if (m.botPad < 0.05 || m.topPad < 0.05) continue;
    const h = m.c.box.h, label = g.length > 1 ? ` (fullest of ${g.length} same-size cards)` : "";
    if (m.botPad - m.topPad > 0.45 && m.botPad > 2 * m.topPad) flags.push(`EMPTY BOTTOM  ${where(m.c)}${label}: ${pads(m)}`);
    else if (m.topPad - m.botPad > 0.45 && m.topPad > 2 * m.botPad) flags.push(`EMPTY TOP     ${where(m.c)}${label}: ${pads(m)}`);
  }
  // Text and tables within 0.35 in of the footer bar
  if (footerTop) {
    for (const it of items) {
      if (it.tableBottom && it.tableBottom > footerTop - 0.35 + 0.01)
        flags.push(`FOOTER        ${it.name}: the table ends ${(footerTop - it.tableBottom).toFixed(2)} in above the footer bar (needs 0.35)`);
      if (!it.text || it.box.y >= footerTop - 0.01) continue;
      if (it.text.bottom > footerTop - 0.35 + 0.01)
        flags.push(`FOOTER        ${it.name}: text ends ${(footerTop - it.text.bottom).toFixed(2)} in above the footer bar (needs 0.35)`);
    }
  }
  // Text running into other text. Each text's extent is measured (lines × line pitch, the words' own width on one
  // line), so a box that's too short for its text shows up even though the boxes themselves don't touch.
  const texts = items.filter(it => it.text && !it.rotated && it !== footer && it.box.y < (footerTop || SLIDE_H) - 0.01);
  const tol = 0.03;
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i].text, b = texts[j].text;
      const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left), dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (dx > tol && dy > tol) flags.push(`OVERLAP       ${texts[i].name} and ${texts[j].name}: their text overlaps by ${dy.toFixed(2)} in`);
    }
  }
  return flags;
}

(async () => {
  const file = process.argv[2];
  if (!file) { console.error("Usage: node scripts/check-spacing.js deck.pptx"); process.exit(2); }
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const slides = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort((a, b) => Number(a.match(/(\d+)\.xml/)[1]) - Number(b.match(/(\d+)\.xml/)[1]));
  let total = 0;
  for (const f of slides) {
    const flags = check(parseSlide(await zip.file(f).async("string")));
    if (!flags.length) continue;
    total += flags.length;
    console.log(`Slide ${f.match(/(\d+)\.xml/)[1]}`);
    flags.forEach(l => console.log("  " + l));
  }
  console.log(total ? `${total} spacing flag(s) in ${path.basename(file)}: look at each slide in the render.` : `No spacing flags in ${path.basename(file)}.`);
})();
