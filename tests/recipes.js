// Test helper: pull recipe code out of references/layout-recipes.md and run it against scripts/build.js,
// the way Claude pastes recipes into a build script. Not part of the skill package.
//
//   const { load } = require("./recipes");
//   const R = load("/path/to/ordergroove-slides-beta");
//   R.run(pres, 28, { VARIANT: "B", replace: [["Sample title goes here", "A much longer title"]] });
const fs = require("fs");
const path = require("path");

function load(skillDir) {
  const md = fs.readFileSync(path.join(skillDir, "references", "layout-recipes.md"), "utf8");
  const build = require(path.join(skillDir, "scripts", "build.js"));
  // Code blocks under each "## N. Name" heading (Card grid has two: 3 across, 4 × 2)
  const blocks = {};
  const sections = md.split(/\n## (?=\d+\. )/).slice(1);
  for (const sec of sections) {
    const n = Number(sec.match(/^(\d+)\./)[1]);
    blocks[n] = [...sec.matchAll(/```javascript\n([\s\S]*?)```/g)].map(m => m[1]);
  }
  function run(pres, n, { VARIANT, block = 0, replace = [] } = {}) {
    let code = blocks[n][block];
    if (!code) throw new Error(`No recipe ${n} block ${block}`);
    if (VARIANT) code = code.replace(/const VARIANT = "[A-Z]";/, `const VARIANT = "${VARIANT}";`);
    for (const [from, to] of replace) {
      if (!code.includes(from)) throw new Error(`Recipe ${n}: can't find ${JSON.stringify(from.slice(0, 60))}`);
      code = code.split(from).join(to);
    }
    const names = Object.keys(build);
    const fn = new Function("pres", ...names, code);
    fn(pres, ...names.map(k => build[k]));
  }
  return { blocks, build, run };
}
module.exports = { load };
