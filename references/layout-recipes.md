# Layout Recipes

Each recipe is code you can paste into a build script and adapt for the user's content. They assume you've imported constants and helpers from `scripts/build.js`.

## Table of contents

1. [Title / Cover (dark)](#1-title--cover-dark)
2. [Title / Cover (light)](#2-title--cover-light)
3. [Title with client logo + image](#3-title-with-client-logo--image)
4. [Section divider](#4-section-divider)
5. [Agenda](#5-agenda)
6. [Content: heading + bullets](#6-content-heading--bullets)
7. [Two-column with quote card](#7-two-column-with-quote-card)
8. [Three-stat callout](#8-three-stat-callout)
9. [Percentage callout (two-column)](#9-percentage-callout-two-column)
10. [Percentage callout (three-column)](#10-percentage-callout-three-column)
11. [Testimonial with gradient cards](#11-testimonial-with-gradient-cards)
12. [Content with subhead blocks + image](#12-content-with-subhead-blocks--image)
13. [Case study one-pager](#13-case-study-one-pager)
14. [Process timeline](#14-process-timeline)
15. [Chart (bar)](#15-chart-bar)
16. [Chart (line)](#16-chart-line)
17. [Before / after comparison](#17-before--after-comparison)
18. [Market size / concentric tiers](#18-market-size--concentric-tiers)
19. [Logo grid](#19-logo-grid)
20. [Closing / thank you (simple)](#20-closing--thank-you-simple)
21. [Closing / thank you (with contact)](#21-closing--thank-you-with-contact)

---

## 1. Title / Cover (dark)

Dark mode with bg-divider background, gradient circles. Logo bottom-left (baked into footer). Large hero headline.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgDivider };

  s.addText("Presentation title\ngoes here", {
    x: 0.7, y: 2.2, w: 8.5, h: 2.8,
    fontFace: FONT, fontSize: 48, bold: true, color: C.white,
    valign: "top", lineSpacingMultiple: 1.1, margin: 0,
  });

  s.addText("Subtitle or date can go here", {
    x: 0.7, y: 5.0, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.gray900, margin: 0,
  });

  addFooter(s);
}
```

---

## 2. Title / Cover (light)

White background variant. Same layout, dark text.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  s.addText("Presentation title\ngoes here", {
    x: 0.7, y: 2.2, w: 8.5, h: 2.8,
    fontFace: FONT, fontSize: 48, bold: true, color: C.midnight,
    valign: "top", lineSpacingMultiple: 1.1, margin: 0,
  });

  s.addText("Subtitle or date can go here", {
    x: 0.7, y: 5.0, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.darkIndigo, margin: 0,
  });

  addFooter(s);
}
```

---

## 3. Title with client logo + image

Light mode. Client logo top-left inside logo-box frame. Circular hero image on the right (use a square image clipped by the gradient circles in the background).

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  // Client logo in branded frame (top-left)
  addLogoBox(s, 0.5, 0.5, 1.5, 1.0);
  // Place actual client logo image centered inside the box:
  // s.addImage({ path: clientLogoPath, x: 0.65, y: 0.6, w: 1.2, h: 0.8 });

  s.addText("Presentation title\ngoes here", {
    x: 0.7, y: 2.2, w: 7, h: 2.8,
    fontFace: FONT, fontSize: 48, bold: true, color: C.midnight,
    valign: "top", lineSpacingMultiple: 1.1, margin: 0,
  });

  s.addText("Subtitle or date can go here", {
    x: 0.7, y: 5.0, w: 7, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.darkIndigo, margin: 0,
  });

  // Circular hero image (right side — clip is handled by bg-content gradient circles)
  // s.addImage({ path: heroImagePath, x: 7.8, y: 1.2, w: 5.0, h: 5.0, rounding: true });

  addFooter(s);
}
```

---

## 4. Section divider

Dark mode, minimal. Big section label + 1-2 line title. No logo.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgDivider };

  sectionLabel(s, "Section 01", 0.7, 2.9, accentColor(true));

  s.addText("Current state\nof the business", {
    x: 0.7, y: 3.25, w: 10, h: 2.5,
    fontFace: FONT, fontSize: 44, bold: true, color: C.white,
    lineSpacingMultiple: 1.1, margin: 0, valign: "top",
  });

  addFooter(s);
}
```

---

## 5. Agenda

Light mode, numbered list. Numerals are Green (light background → contrast rule).

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Agenda", 0.7, 0.7, accentColor(false));
  s.addText("What we'll cover today", {
    x: 0.7, y: 1.05, w: 10, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });

  const items = [
    { n: "01", t: "Context & objectives", d: "Why we're here and what we're solving" },
    { n: "02", t: "Current state", d: "Where things stand today, by the numbers" },
    { n: "03", t: "Recommendation", d: "The path forward and the rationale" },
    { n: "04", t: "Next steps", d: "What happens in the next 30 days" },
  ];

  items.forEach((it, i) => {
    const y = 2.3 + i * 0.95;
    s.addText(it.n, {
      x: 0.7, y, w: 0.9, h: 0.8,
      fontFace: FONT, fontSize: 32, bold: true, color: accentColor(false), margin: 0, valign: "top",
    });
    s.addText(it.t, {
      x: 1.7, y, w: 6.5, h: 0.4,
      fontFace: FONT, fontSize: 20, bold: true, color: C.midnight, margin: 0, valign: "top",
    });
    s.addText(it.d, {
      x: 1.7, y: y + 0.45, w: 8, h: 0.4,
      fontFace: FONT, fontSize: 13, color: C.darkIndigo, margin: 0, valign: "top",
    });
  });

  addFooter(s);
}
```

---

## 6. Content: heading + bullets

Light mode. 4-5 bullets max.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Key insight", 0.7, 0.7, accentColor(false));
  s.addText("One clear headline stating the insight", {
    x: 0.7, y: 1.05, w: 11, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });

  s.addText("Lead paragraph sets up the claim in 1-2 sentences — concise and declarative.", {
    x: 0.7, y: 2.1, w: 11, h: 0.9,
    fontFace: FONT, fontSize: 16, color: C.midnight, margin: 0, valign: "top",
  });

  s.addText([
    { text: "First supporting point — one sentence, concrete.", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Second point with a number that proves it.", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Third point connecting to a business outcome.", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Optional fourth point; keep it tight.", options: { bullet: true } },
  ], {
    x: 0.7, y: 3.3, w: 11, h: 3,
    fontFace: FONT, fontSize: 16, color: C.midnight, valign: "top",
  });

  addFooter(s);
}
```

---

## 7. Two-column with quote card

Light mode. Narrative left, dark card (Midnight) with pull-quote right.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Customer story", 0.7, 0.7, accentColor(false));
  s.addText("How [Brand X] rebuilt\ntheir subscriber journey", {
    x: 0.7, y: 1.05, w: 7, h: 1.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.midnight,
    lineSpacingMultiple: 1.05, margin: 0,
  });
  s.addText("Supporting narrative paragraph — concise context for the story.", {
    x: 0.7, y: 2.75, w: 6.3, h: 1.6,
    fontFace: FONT, fontSize: 15, color: C.midnight, margin: 0, valign: "top",
  });
  s.addText("+42%", {
    x: 0.7, y: 4.5, w: 3.2, h: 1.3,
    fontFace: FONT, fontSize: 50, bold: true, color: accentColor(false), margin: 0, valign: "top",
  });
  s.addText("Subscriber retention lift\nin months 0–6", {
    x: 3.9, y: 4.75, w: 3.3, h: 1.2,
    fontFace: FONT, fontSize: 14, color: C.midnight, margin: 0, valign: "top",
  });

  // Dark quote card (right)
  const cx = 8.1, cy = 1.05, cw = 4.5, ch = 5.2;
  s.addShape("rect", {
    x: cx, y: cy, w: cw, h: ch,
    fill: { color: C.midnight }, line: { type: "none" },
  });
  addQuoteIcon(s, cx + 0.3, cy + 0.3);
  s.addText("Ordergroove gave us one flexible foundation to build the experience we always wanted.", {
    x: cx + 0.35, y: cy + 1.0, w: cw - 0.7, h: 2.8,
    fontFace: FONT, fontSize: 17, bold: true, color: C.white, margin: 0, valign: "top",
    lineSpacingMultiple: 1.15,
  });
  s.addText("— Director of Retention, [Brand X]", {
    x: cx + 0.35, y: cy + ch - 0.8, w: cw - 0.7, h: 0.4,
    fontFace: FONT, fontSize: 12, color: accentColor(true), bold: true, margin: 0,
  });

  addFooter(s);
}
```

---

## 8. Three-stat callout

Three equal cards, light mode, with a top accent bar.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "By the numbers", 0.7, 0.7, accentColor(false));
  s.addText("What our platform delivers", {
    x: 0.7, y: 1.05, w: 10, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });

  const stats = [
    { num: "2.5B+", label: "Subscription transactions processed", sub: "Since 2010" },
    { num: "180M", label: "Active subscribers under management", sub: "As of Q1 2026" },
    { num: "99.99%", label: "Platform uptime", sub: "Trailing 12 months" },
  ];
  const cardW = 4.0, cardH = 3.6, gap = 0.3;
  const startX = (W - (cardW * 3 + gap * 2)) / 2;
  const startY = 2.5;

  stats.forEach((st, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape("rect", { x, y: startY, w: cardW, h: cardH, fill: { color: C.offWhite }, line: { type: "none" } });
    s.addShape("rect", { x, y: startY, w: cardW, h: 0.08, fill: { color: accentColor(false) }, line: { type: "none" } });
    s.addText(st.num, { x: x + 0.3, y: startY + 0.4, w: cardW - 0.6, h: 1.4, fontFace: FONT, fontSize: 50, bold: true, color: C.midnight, valign: "top", margin: 0 });
    s.addText(st.label, { x: x + 0.3, y: startY + 2.05, w: cardW - 0.6, h: 0.9, fontFace: FONT, fontSize: 15, bold: true, color: C.midnight, margin: 0, valign: "top" });
    s.addText(st.sub, { x: x + 0.3, y: startY + 3.0, w: cardW - 0.6, h: 0.4, fontFace: FONT, fontSize: 11, color: C.muted, margin: 0, valign: "top" });
  });

  addFooter(s);
}
```

---

## 9. Percentage callout (two-column)

Two large percentage numbers with descriptions. From Figma Templates 89/103.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  s.addText("Headline for slide goes here", {
    x: 0.7, y: 0.65, w: 11.5, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });
  s.addText("Subhead", {
    x: 0.7, y: 1.5, w: 11.5, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.darkIndigo, margin: 0,
  });

  const pcts = [
    { num: "72%", head: "Key metric label", body: "Supporting description text in one or two sentences." },
    { num: "94%", head: "Key metric label", body: "Supporting description text in one or two sentences." },
  ];
  const colW = 5.5, gap = 1.0;
  const startX = 0.7, startY = 2.8;

  pcts.forEach((p, i) => {
    const x = startX + i * (colW + gap);
    s.addText(p.num, { x, y: startY, w: colW, h: 1.6, fontFace: FONT, fontSize: 50, bold: true, color: C.midnight, margin: 0, valign: "top" });
    sectionLabel(s, p.head, x, startY + 1.6, accentColor(false));
    s.addText(p.body, { x, y: startY + 2.1, w: colW, h: 1.5, fontFace: FONT, fontSize: 14, color: C.midnight, margin: 0, valign: "top" });
  });

  addFooter(s);
}
```

---

## 10. Percentage callout (three-column)

Three large percentage numbers. From Figma Templates 98/99.

```javascript
{
  const s = pres.addSlide();
  const isDark = true;
  s.background = { path: ASSETS.bgDivider };

  s.addText("Headline for slide goes here", {
    x: 0.7, y: 0.65, w: 11.5, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.white, margin: 0,
  });
  s.addText("Subhead", {
    x: 0.7, y: 1.5, w: 11.5, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.gray900, margin: 0,
  });

  const pcts = [
    { num: "72%", head: "Metric label", body: "Supporting text." },
    { num: "94%", head: "Metric label", body: "Supporting text." },
    { num: "3.2x", head: "Metric label", body: "Supporting text." },
  ];
  const colW = 3.8, gap = 0.5;
  const startX = 0.7, startY = 2.8;

  pcts.forEach((p, i) => {
    const x = startX + i * (colW + gap);
    s.addText(p.num, { x, y: startY, w: colW, h: 1.6, fontFace: FONT, fontSize: 50, bold: true, color: C.white, margin: 0, valign: "top" });
    sectionLabel(s, p.head, x, startY + 1.6, accentColor(isDark));
    s.addText(p.body, { x, y: startY + 2.1, w: colW, h: 1.5, fontFace: FONT, fontSize: 14, color: C.gray900, margin: 0, valign: "top" });
  });

  addFooter(s);
}
```

---

## 11. Testimonial with gradient cards

Three quote cards with gradient shadow assets, quote icon, and client logos. From Figma Template 54.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  s.addText("What our customers say", {
    x: 0.7, y: 0.65, w: 11.5, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });

  const quotes = [
    { text: "Quote text from customer one — keep it to 2-3 sentences.", attr: "— VP Ecommerce, Brand A" },
    { text: "Quote text from customer two — keep it to 2-3 sentences.", attr: "— Director of Retention, Brand B" },
    { text: "Quote text from customer three — keep it to 2-3 sentences.", attr: "— Head of Growth, Brand C" },
  ];
  const cardW = 3.8, cardH = 4.0, gap = 0.35;
  const startX = (W - (cardW * 3 + gap * 2)) / 2;
  const startY = 2.0;

  quotes.forEach((q, i) => {
    const x = startX + i * (cardW + gap);
    const inner = addGradientCard(s, x, startY, cardW, cardH, i + 1);

    addQuoteIcon(s, inner.x, inner.y);

    s.addText(q.text, {
      x: inner.x, y: inner.y + 0.6, w: inner.w, h: inner.h - 1.4,
      fontFace: FONT, fontSize: 13, color: C.darkIndigo, margin: 0, valign: "top",
      lineSpacingMultiple: 1.15,
    });

    s.addText(q.attr, {
      x: inner.x, y: startY + cardH - 0.65, w: inner.w, h: 0.3,
      fontFace: FONT, fontSize: 11, bold: true, color: C.muted, margin: 0,
    });

    // Client logo placeholder at bottom of card
    // s.addImage({ path: clientLogo, x: inner.x, y: startY + cardH - 1.1, w: 1.2, h: 0.35 });
  });

  addFooter(s);
}
```

---

## 12. Content with subhead blocks + image

Dark mode. Headline, subhead, then 2-3 labeled text blocks on the left with an image on the right. From Figma Template 32.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgDivider };

  s.addText("Headline for slide goes here", {
    x: 0.7, y: 0.65, w: 11.5, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.white, margin: 0,
  });
  s.addText("Subhead", {
    x: 0.7, y: 1.4, w: 6, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.gray900, margin: 0,
  });

  // Client logo in branded box (top-right area)
  // addLogoBox(s, 7.8, 1.0, 1.6, 1.1);

  const blocks = [
    { label: "Key point one", body: "Supporting description for this point in one or two sentences." },
    { label: "Key point two", body: "Supporting description for this point in one or two sentences." },
    { label: "Key point three", body: "Supporting description for this point in one or two sentences." },
  ];

  blocks.forEach((b, i) => {
    const y = 2.3 + i * 1.4;
    sectionLabel(s, b.label, 0.7, y, accentColor(true));
    s.addText(b.body, {
      x: 0.7, y: y + 0.35, w: 6, h: 0.9,
      fontFace: FONT, fontSize: 15, color: C.white, margin: 0, valign: "top",
      lineSpacingMultiple: 1.15,
    });
  });

  // Image right side (optional)
  // s.addImage({ path: imagePath, x: 7.8, y: 1.8, w: 5.0, h: 4.8 });

  addFooter(s);
}
```

---

## 13. Case study one-pager

Light mode. Challenge/solution split with inline stats. From Figma Template 91 (DSC).

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  s.addText("[Client Name]", {
    x: 0.7, y: 0.65, w: 11.5, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });

  // Stats row
  const stats = [
    { num: "100%", label: "of subscribers migrated" },
    { num: "99.99%", label: "migration success rate" },
    { num: "99.99%", label: "uptime" },
  ];
  const statW = 2.5;
  stats.forEach((st, i) => {
    const x = 0.7 + i * statW;
    s.addText(st.num, { x, y: 1.7, w: statW, h: 0.6, fontFace: FONT, fontSize: 20, bold: true, color: accentColor(false), margin: 0 });
    s.addText(st.label, { x, y: 2.2, w: statW, h: 0.4, fontFace: FONT, fontSize: 12, color: C.darkIndigo, margin: 0 });
  });

  // Challenge column
  sectionLabel(s, "Challenge", 0.7, 3.0, accentColor(false));
  s.addText("Description of the customer's challenge before Ordergroove.", {
    x: 0.7, y: 3.4, w: 5.8, h: 2.5,
    fontFace: FONT, fontSize: 14, color: C.midnight, margin: 0, valign: "top",
    lineSpacingMultiple: 1.15,
  });

  // Solution column
  sectionLabel(s, "Solution", 7.0, 3.0, accentColor(false));
  s.addText("Description of how Ordergroove solved the problem and what the results were.", {
    x: 7.0, y: 3.4, w: 5.8, h: 2.5,
    fontFace: FONT, fontSize: 14, color: C.midnight, margin: 0, valign: "top",
    lineSpacingMultiple: 1.15,
  });

  // Headline connecting insight
  s.addText("How [Client Name]'s move to Ordergroove lowered costs and unlocked innovation", {
    x: 0.7, y: 6.0, w: 12, h: 0.5,
    fontFace: FONT, fontSize: 18, bold: true, color: C.midnight, margin: 0,
  });

  addFooter(s);
}
```

---

## 14. Process timeline

Four horizontal steps with Midnight circles and accent numerals.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Our approach", 0.7, 0.7, accentColor(false));
  s.addText("A four-stage rollout", { x: 0.7, y: 1.05, w: 10, h: 0.9, fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0 });

  const steps = [
    { n: "1", t: "Discover", d: "Audit current subscriber experience" },
    { n: "2", t: "Design", d: "Map the target state journey" },
    { n: "3", t: "Build", d: "Phased implementation with bi-weekly reviews" },
    { n: "4", t: "Optimize", d: "Monthly performance reviews and tests" },
  ];
  const stepW = 2.8, gap = 0.3;
  const total = stepW * 4 + gap * 3;
  const startX = (W - total) / 2;
  const startY = 2.6;

  s.addShape("line", { x: startX + 0.6, y: startY + 0.6, w: total - 1.2, h: 0, line: { color: C.gray800, width: 2 } });

  steps.forEach((st, i) => {
    const x = startX + i * (stepW + gap);
    s.addShape("ellipse", { x: x + stepW / 2 - 0.6, y: startY, w: 1.2, h: 1.2, fill: { color: C.midnight }, line: { type: "none" } });
    s.addText(st.n, { x: x + stepW / 2 - 0.6, y: startY, w: 1.2, h: 1.2, fontFace: FONT, fontSize: 30, bold: true, color: accentColor(true), align: "center", valign: "middle", margin: 0 });
    s.addText(st.t, { x, y: startY + 1.45, w: stepW, h: 0.5, fontFace: FONT, fontSize: 20, bold: true, color: C.midnight, align: "center", margin: 0 });
    s.addText(st.d, { x: x + 0.1, y: startY + 2.0, w: stepW - 0.2, h: 1.5, fontFace: FONT, fontSize: 13, color: C.midnight, align: "center", valign: "top", margin: 0 });
  });

  addFooter(s);
}
```

---

## 15. Chart (bar)

Light mode bar chart using chart palette.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Performance", 0.7, 0.7, accentColor(false));
  s.addText("Subscriber growth vs. one-time buyers", {
    x: 0.7, y: 1.05, w: 11, h: 0.9,
    fontFace: FONT, fontSize: 28, bold: true, color: C.midnight, margin: 0,
  });

  s.addChart(pres.charts.BAR, [
    { name: "Subscribers", labels: ["Q1", "Q2", "Q3", "Q4", "Q1'26"], values: [100, 118, 134, 151, 172] },
    { name: "One-time", labels: ["Q1", "Q2", "Q3", "Q4", "Q1'26"], values: [100, 103, 107, 108, 111] },
  ], {
    x: 0.7, y: 2.5, w: 12, h: 4.0,
    barDir: "col", barGapWidthPct: 55,
    chartColors: [C.green, C.groovyGreen, C.intenseCyan],
    catAxisLabelColor: C.midnight, catAxisLabelFontFace: FONT, catAxisLabelFontSize: 12,
    valAxisLabelColor: C.darkIndigo, valAxisLabelFontFace: FONT, valAxisLabelFontSize: 10,
    valGridLine: { color: C.gray800, size: 0.5 },
    catGridLine: { style: "none" },
    showLegend: true, legendPos: "t", legendColor: C.midnight, legendFontFace: FONT, legendFontSize: 12,
  });

  addFooter(s);
}
```

---

## 16. Chart (line)

Light mode line chart. From Figma Templates 96/97.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Trends", 0.7, 0.7, accentColor(false));
  s.addText("Revenue trajectory", {
    x: 0.7, y: 1.05, w: 11, h: 0.9,
    fontFace: FONT, fontSize: 28, bold: true, color: C.midnight, margin: 0,
  });

  s.addChart(pres.charts.LINE, [
    { name: "Series A", labels: ["FY23", "FY24", "FY25", "FY26E"], values: [25, 33, 42, 57] },
    { name: "Series B", labels: ["FY23", "FY24", "FY25", "FY26E"], values: [15, 18, 22, 30] },
  ], {
    x: 0.7, y: 2.3, w: 12, h: 4.2,
    chartColors: [C.green, C.intenseCyan],
    lineSize: 3, lineSmooth: false,
    catAxisLabelColor: C.midnight, catAxisLabelFontFace: FONT, catAxisLabelFontSize: 12,
    valAxisLabelColor: C.darkIndigo, valAxisLabelFontFace: FONT, valAxisLabelFontSize: 10,
    valGridLine: { color: C.gray800, size: 0.5 },
    showLegend: true, legendPos: "t", legendColor: C.midnight, legendFontFace: FONT, legendFontSize: 12,
  });

  addFooter(s);
}
```

---

## 17. Before / after comparison

Off-white "before" card beside Midnight "after" card.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Before vs. after", 0.7, 0.7, accentColor(false));
  s.addText("The impact of a unified subscriber experience", {
    x: 0.7, y: 1.05, w: 11.5, h: 0.9, fontFace: FONT, fontSize: 28, bold: true, color: C.midnight, margin: 0,
  });

  const cardW = 5.9, cardH = 4.4, gap = 0.4;
  const startX = (W - (cardW * 2 + gap)) / 2;
  const startY = 2.3;

  // Before (off-white)
  s.addShape("rect", { x: startX, y: startY, w: cardW, h: cardH, fill: { color: C.offWhite }, line: { type: "none" } });
  s.addText("BEFORE", { x: startX + 0.4, y: startY + 0.35, w: cardW - 0.8, h: 0.35, fontFace: FONT, fontSize: 11, bold: true, color: C.darkIndigo, charSpacing: 4, margin: 0 });
  s.addText("Three fragmented flows", { x: startX + 0.4, y: startY + 0.8, w: cardW - 0.8, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: C.midnight, margin: 0 });
  s.addText([
    { text: "Siloed subscription flows by channel", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Manual pause/skip via support tickets", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: "No unified view of subscriber health", options: { bullet: true } },
  ], { x: startX + 0.4, y: startY + 1.55, w: cardW - 0.8, h: cardH - 1.8, fontFace: FONT, fontSize: 14, color: C.midnight, valign: "top" });

  // After (dark)
  const rx = startX + cardW + gap;
  s.addShape("rect", { x: rx, y: startY, w: cardW, h: cardH, fill: { color: C.midnight }, line: { type: "none" } });
  s.addText("AFTER", { x: rx + 0.4, y: startY + 0.35, w: cardW - 0.8, h: 0.35, fontFace: FONT, fontSize: 11, bold: true, color: accentColor(true), charSpacing: 4, margin: 0 });
  s.addText("One unified experience", { x: rx + 0.4, y: startY + 0.8, w: cardW - 0.8, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: C.white, margin: 0 });
  s.addText([
    { text: "Single subscription layer across channels", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Self-service skip, swap, edit, pause", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Subscriber health scoring in one dashboard", options: { bullet: true } },
  ], { x: rx + 0.4, y: startY + 1.55, w: cardW - 0.8, h: cardH - 1.8, fontFace: FONT, fontSize: 14, color: C.white, valign: "top" });

  addFooter(s);
}
```

---

## 18. Market size / concentric tiers

Four ascending value tiers in a horizontal row. From Figma Templates 92/93.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  s.addText("Market opportunity", {
    x: 0.7, y: 0.65, w: 11.5, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });
  s.addText("Addressable market by segment", {
    x: 0.7, y: 1.4, w: 11.5, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.darkIndigo, margin: 0,
  });

  const tiers = [
    { value: "$5M", label: "Tier label", desc: "Short description of this tier." },
    { value: "$20M", label: "Tier label", desc: "Short description of this tier." },
    { value: "$50M", label: "Tier label", desc: "Short description of this tier." },
    { value: "$100M", label: "Tier label", desc: "Short description of this tier." },
  ];
  const colW = 2.8, gap = 0.4;
  const startX = (W - (colW * 4 + gap * 3)) / 2;
  const startY = 2.5;

  tiers.forEach((t, i) => {
    const x = startX + i * (colW + gap);
    // Colored circle scales with tier
    const diam = 1.0 + i * 0.35;
    const cx = x + (colW - diam) / 2;
    s.addShape("ellipse", { x: cx, y: startY + (2.0 - diam) / 2, w: diam, h: diam, fill: { color: accentColor(false) }, line: { type: "none" }, transparency: 20 + (3 - i) * 15 });
    s.addText(t.value, { x, y: startY + 2.3, w: colW, h: 0.7, fontFace: FONT, fontSize: 20, bold: true, color: C.midnight, align: "center", margin: 0 });
    s.addText(t.label, { x, y: startY + 3.0, w: colW, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: C.midnight, align: "center", margin: 0 });
    s.addText(t.desc, { x, y: startY + 3.4, w: colW, h: 1.0, fontFace: FONT, fontSize: 12, color: C.darkIndigo, align: "center", valign: "top", margin: 0 });
  });

  addFooter(s);
}
```

---

## 19. Logo grid

Client/partner logos in a grid. Use logo-box frames for each.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgContent };

  sectionLabel(s, "Our customers", 0.7, 0.7, accentColor(false));
  s.addText("Trusted by leading brands", {
    x: 0.7, y: 1.05, w: 10, h: 0.9,
    fontFace: FONT, fontSize: 32, bold: true, color: C.midnight, margin: 0,
  });

  // 3×2 grid of logo placeholders with logo-box frames
  const logoW = 3.2, logoH = 1.8, gapX = 0.6, gapY = 0.5;
  const startX = (W - (logoW * 3 + gapX * 2)) / 2;
  const startY = 2.4;

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = startX + col * (logoW + gapX);
      const y = startY + row * (logoH + gapY);
      addLogoBox(s, x, y, logoW, logoH);
      // Place actual logo inside: s.addImage({ path: logoPath, x: x+0.4, y: y+0.3, w: logoW-0.8, h: logoH-0.6 });
    }
  }

  addFooter(s);
}
```

---

## 20. Closing / thank you (simple)

Dark mode, simple. No contact info.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgDivider };

  s.addText("Thank you!", {
    x: 0.7, y: 2.2, w: 9, h: 2.8,
    fontFace: FONT, fontSize: 48, bold: true, color: C.white,
    lineSpacingMultiple: 1.1, margin: 0, valign: "top",
  });
  s.addText("We'd love to hear your questions, feedback, and thoughts.", {
    x: 0.7, y: 4.6, w: 9, h: 0.8,
    fontFace: FONT, fontSize: 20, color: C.gray900, margin: 0,
  });

  addFooter(s);
}
```

---

## 21. Closing / thank you (with contact)

Dark mode, contact details.

```javascript
{
  const s = pres.addSlide();
  s.background = { path: ASSETS.bgDivider };

  sectionLabel(s, "Thank you", 0.7, 2.4, accentColor(true));
  s.addText("Let's build something\nworth subscribing to.", {
    x: 0.7, y: 2.8, w: 9, h: 2.0,
    fontFace: FONT, fontSize: 44, bold: true, color: C.white,
    lineSpacingMultiple: 1.1, margin: 0, valign: "top",
  });
  s.addText([
    { text: "[Your Name]", options: { bold: true, color: C.white, breakLine: true } },
    { text: "[your.email@ordergroove.com]", options: { color: accentColor(true), bold: true, breakLine: true } },
    { text: "ordergroove.com", options: { color: C.white } },
  ], { x: 0.7, y: 5.2, w: 6, h: 1.2, fontFace: FONT, fontSize: 15, margin: 0, valign: "top", paraSpaceAfter: 4 });

  addFooter(s);
}
```
