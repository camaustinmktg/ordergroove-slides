// Regression test for the second real-deck test's feedback (2026-10-29). Builds each reported failure with
// realistic copy, runs scripts/check-spacing.js on it, and fails on any FOOTER or OVERLAP flag.
//
//   node tests/regression-2026-10-29.js [skill-dir] [out.pptx]
//
// 1. Slide 4: a 2-line title, an 8-row table beside a dark panel with three metrics, and a 2-line source note
// 2. The same panel with cards as the main block, in every metrics style (B, D, E, F)
// 3. Table: 8 rows with a highlighted total row and a source note; 12 rows with two highlights and a wrapped cell
// 4. Slide 10: highlighted rows at heights the two PNGs never covered
// 5. Title: the co-branded cover with the user's own line break and no photo (3 D / E), plus Title light A
const path = require("path");
const { execFileSync } = require("child_process");
const { load } = require("./recipes");
const skillDir = path.resolve(process.argv[2] || path.join(__dirname, "..", "ordergroove-slides-beta"));
const out = path.resolve(process.argv[3] || "regression-2026-10-29.pptx");
const R = load(skillDir);
const pres = R.build.newPresentation({ title: "Regression 2026-10-29", audience: "external" });

const TITLE2 = ["Sample title goes here", "Subscribers who start on a bundle stay longer, spend more and churn less across every category"];
const SOURCE2 = ['const SOURCE = "";', 'const SOURCE = ["Source: Ordergroove platform data, 412 brands, Jan 2025–Jun 2026.", "Methodology: cohort retention measured at 12 months; bundles defined as 2+ SKUs in the first order."];'];
const METRICS = ['const metrics = [', `const metrics = [
      { icon: "autorenew", figure: "$20M+", name: "Incremental ARR", caption: "Added in the first year across the 12 pilot brands, net of discounts" },
      { icon: "trending_up", figure: "2–4x", name: "Subscriber lifetime value", caption: "Bundle starters against single-SKU starters at 12 months" },
      { icon: "favorite", figure: "31%", name: "Lower churn", caption: "In the first 90 days, the window where most cancellations happen" },
    ]; const _sample = [`];
const ROWS8 = [["Base Case", "$2.4M", "18%", "97K"], ["Upside", "$3.1M", "24%", "121K"], ["Downside", "$1.6M", "11%", "70K"], ["Pilot brands (12)", "$0.8M", "15%", "31K"],
  ["Enterprise rollout", "$5.2M", "21%", "204K"], ["Mid-market", "$1.1M", "16%", "44K"], ["Retail partners", "$0.6M", "9%", "22K"], ["Total", "$14.8M", "17%", "589K"]];
const SAMPLE17 = "Array.from({ length: VARIANT === \"A\" ? 4 : 6 }, (_, i) =>\n    [`Row ${i + 1} title`, \"Lorem ipsum\", \"Lorem ipsum\", \"Lorem ipsum\", \"Lorem ipsum\"])";

// 1. Slide 4
R.run(pres, 28, { VARIANT: "B", replace: [TITLE2, SOURCE2, METRICS,
  ['const MAIN = VARIANT === "A" ? "milestones" : VARIANT === "C" ? "options" : "cards";', 'const MAIN = "table";'],
  ['body: Array.from({ length: 6 }, (_, i) => [`Row ${i + 1} title`, "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"]),', `body: ${JSON.stringify(ROWS8)},`],
  ['header: ["", "Title 1", "Title 2", "Title 3"],', 'header: ["Scenario", "ARR", "Lift", "Subscribers"],'],
  ['highlight: 1, // body', 'highlight: 7, // body']] });
// 2. Every metrics style with cards
for (const V of ["B", "D", "E", "F"]) R.run(pres, 28, { VARIANT: V, replace: [TITLE2, SOURCE2, METRICS] });
R.run(pres, 28, { VARIANT: "A", replace: [TITLE2, SOURCE2] });
// 3. Tables
R.run(pres, 17, { VARIANT: "B", replace: [
  [SAMPLE17, JSON.stringify(ROWS8.map(r => [...r.slice(0, 3), "1 in 4" + r[2][0], r[3]]))],
  ['["", "Title 1", "Title 2", "Title 3", "Title 4"]', '["Scenario", "ARR", "Lift", "Churn", "Subscribers"]'],
  ['const highlight = VARIANT === "A" ? 3 : 1;', "const highlight = 7;"], SOURCE2,
  ['const title = "Sample table";', 'const title = "Bundles lift ARR in every scenario, with the enterprise rollout carrying most of the upside";']] });
R.run(pres, 17, { VARIANT: "B", replace: [
  [SAMPLE17, JSON.stringify(Array.from({ length: 12 }, (_, i) => [`Milestone ${i + 1}`, i === 4 ? "A longer description that wraps onto a second line in this column, as real copy does" : "Owner team", `Q${(i % 4) + 1} 2027`]))],
  ['["", "Title 1", "Title 2", "Title 3", "Title 4"]', '["", "Detail", "Date"]'],
  ['const highlight = VARIANT === "A" ? 3 : 1;', "const highlight = [2, 4];"],
  ['const SOURCE = "";', 'const SOURCE = "Source: Q3 planning doc.";']] });
// 4. Slide 10: highlights on 3, 5 and 7 rows (0.86, 0.64 and the shared heights in between)
for (const n of [3, 5, 7]) R.run(pres, 17, { VARIANT: "A", replace: [[SAMPLE17, JSON.stringify(ROWS8.slice(0, n).map(r => [...r, r[1]]))], ['const highlight = VARIANT === "A" ? 3 : 1;', `const highlight = ${n - 2};`]] });
// 5. Covers
const COVER = [['const title = "Presentation title goes here";', 'const title = "Ordergroove + Keurig\\nSubscription growth plan for 2027";'],
  ['const subtitle = "Subtitle or date can go here";', 'const subtitle = "Prepared for the Keurig subscription team · November 2026";']];
R.run(pres, 3, { VARIANT: "D", replace: COVER });
R.run(pres, 3, { VARIANT: "E", replace: COVER });
R.run(pres, 2, { VARIANT: "A", replace: COVER });

R.build.saveTo(pres, out).then(() => {
  const report = execFileSync(process.execPath, [path.join(skillDir, "scripts", "check-spacing.js"), out], { encoding: "utf8" });
  const bad = report.split("\n").filter(l => /FOOTER|OVERLAP|OVERFLOW/.test(l));
  console.log(report.trim());
  if (bad.length) { console.error(`FAIL: ${bad.length} FOOTER / OVERLAP / OVERFLOW flag(s)`); process.exit(1); }
  console.log(`PASS: ${pres.slides.length} slides, no FOOTER, OVERLAP or OVERFLOW flags. Render ${path.basename(out)} to check by eye.`);
});
