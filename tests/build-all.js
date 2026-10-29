// Builds every recipe and variant with its sample content into one deck.
//   node tests/build-all.js <skill-dir> <out.pptx> [--source]
// --source adds a 2-line source / methodology note to every recipe that has a SOURCE slot.
const path = require("path");
const { load } = require("./recipes");
const [skillDir, out, flag] = process.argv.slice(2);
const R = load(path.resolve(skillDir));
const ALL = [
  [1], [2, "AB"], [3, "ABCDE"], [4, "ABC"], [5, "AB"], [6, "AB"], [7, "ABC"], [8], [9],
  [10, "ADEF", 0], [10, "BC", 1], [11], [12], [13, "AB"], [14], [15], [16, "AB"], [17, "AB"],
  [18, "AB"], [19, "ABCD"], [20], [21, "AB"], [22], [23], [24, "AB"], [25], [26], [27, "ABC"], [28, "ABCDEF"],
];
const NOTE = 'const SOURCE = ["Source: Ordergroove platform data, 412 brands, Jan 2025–Jun 2026.", "Methodology: cohort retention measured at 12 months; bundles defined as 2+ SKUs in the first order."];';
const pres = R.build.newPresentation({ title: "all recipes", audience: "internal" });
const made = [];
for (const [n, variants, block = 0] of ALL) {
  if (!R.blocks[n] || !R.blocks[n][block]) { console.log(`skip ${n}: no block ${block}`); continue; }
  for (const V of variants ? variants.split("") : [null]) {
    const code = R.blocks[n][block];
    if (V && !code.includes("const VARIANT")) continue;
    if (V && !new RegExp(`(?:\\b|·\\s)${V}(?: \\/ [A-Z])?:|[A-Z] \\/ ${V}:`).test(code.split("\n").find(l => l.includes("const VARIANT")))) { console.log(`skip ${n}${V}: not in this build`); continue; }
    const replace = [];
    if (flag === "--source") {
      const m = code.match(/const SOURCE = [^;]*;/);
      if (!m) continue;
      replace.push([m[0], NOTE]);
    }
    R.run(pres, n, { VARIANT: V || undefined, block, replace });
    made.push(`${n}${V || ""}`);
  }
}
R.build.saveTo(pres, path.resolve(out)).then(() => console.log(`${made.length} slides: ${made.join(" ")}`));
