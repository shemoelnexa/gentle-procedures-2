/**
 * Structural check for every Bootstrap accordion in a built page:
 * unique ids, every data-bs-target / aria-controls / data-bs-parent resolves,
 * exactly one open panel per accordion group, and balanced div nesting inside
 * each accordion. Run: node scripts/check-accordions.js site/*.html
 */
const fs = require('fs');

let failures = 0;

function check(file) {
  const html = fs.readFileSync(file, 'utf8');
  const problems = [];

  // --- id uniqueness across the page
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const seen = new Set();
  ids.forEach(id => {
    if (seen.has(id)) problems.push('duplicate id: #' + id);
    seen.add(id);
  });

  // --- every collapse toggle points at a real panel, and agrees with aria-controls
  const buttons = [...html.matchAll(/<button[^>]*data-bs-toggle="collapse"[^>]*>/g)].map(m => m[0]);
  buttons.forEach(btn => {
    const target = (btn.match(/data-bs-target="#([^"]+)"/) || [])[1];
    const controls = (btn.match(/aria-controls="([^"]+)"/) || [])[1];
    const expanded = (btn.match(/aria-expanded="([^"]+)"/) || [])[1];
    const collapsed = /class="[^"]*\bcollapsed\b/.test(btn);
    if (!target) return problems.push('toggle with no data-bs-target');
    if (!seen.has(target)) problems.push('data-bs-target #' + target + ' has no matching element');
    if (controls !== target) problems.push('#' + target + ': aria-controls="' + controls + '" does not match target');
    if (expanded === 'true' && collapsed) problems.push('#' + target + ': aria-expanded="true" but button is .collapsed');
    if (expanded === 'false' && !collapsed) problems.push('#' + target + ': aria-expanded="false" but button lacks .collapsed');
    // the panel's own state must agree with the button
    const panel = html.match(new RegExp('<div[^>]*\\sid="' + target + '"[^>]*>'));
    if (!panel) return problems.push('#' + target + ': panel element not found');
    const shown = /class="[^"]*\bshow\b/.test(panel[0]);
    if (shown !== (expanded === 'true')) {
      problems.push('#' + target + ': panel ' + (shown ? 'has' : 'lacks') + ' .show but aria-expanded="' + expanded + '"');
    }
    if (!/\bcollapse\b/.test(panel[0])) problems.push('#' + target + ': panel is missing the .collapse class');
  });

  // --- data-bs-parent must resolve, and each group opens at most one panel
  const groups = {};
  [...html.matchAll(/<div[^>]*\sid="([^"]+)"[^>]*\sclass="([^"]*)"[^>]*data-bs-parent="#([^"]+)"/g)]
    .forEach(m => {
      const [, id, cls, parent] = m;
      if (!seen.has(parent)) problems.push('#' + id + ': data-bs-parent #' + parent + ' does not exist');
      groups[parent] = groups[parent] || { open: [], all: [] };
      groups[parent].all.push(id);
      if (/\bshow\b/.test(cls)) groups[parent].open.push(id);
    });
  Object.entries(groups).forEach(([parent, g]) => {
    if (g.open.length > 1) {
      problems.push('#' + parent + ': ' + g.open.length + ' panels open at once (' + g.open.join(', ') + ')');
    }
  });

  // --- div balance inside each accordion container
  const accStart = [...html.matchAll(/<div class="accordion [^"]*" id="([^"]+)"/g)];
  accStart.forEach(m => {
    let i = m.index, depth = 0, end = -1;
    const tag = /<div\b|<\/div>/g;
    tag.lastIndex = i;
    let t;
    while ((t = tag.exec(html))) {
      depth += t[0] === '</div>' ? -1 : 1;
      if (depth === 0) { end = t.index; break; }
    }
    if (end === -1) problems.push('#' + m[1] + ': container div never closes');
  });

  const label = file.padEnd(34);
  if (problems.length) {
    failures += problems.length;
    console.log('FAIL ' + label + problems.length + ' problem(s)');
    problems.forEach(p => console.log('       - ' + p));
  } else {
    console.log('ok   ' + label + buttons.length + ' collapse toggles, ' + Object.keys(groups).length + ' groups');
  }
}

process.argv.slice(2).forEach(check);
process.exit(failures ? 1 : 0);
