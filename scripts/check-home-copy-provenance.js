/**
 * Proves the home page's two restored accordions contain no new writing:
 * every body must appear verbatim in an already-approved v2.1 page.
 */
const fs = require('fs');

const strip = s => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const home = fs.readFileSync('site/index.html', 'utf8');
const sources = {
  'what-to-expect.html': strip(fs.readFileSync('site/what-to-expect.html', 'utf8')),
  'faqs.html': strip(fs.readFileSync('site/faqs.html', 'utf8')),
};

const ids = [
  'home-journey-01', 'home-journey-02', 'home-journey-03',
  'home-journey-04', 'home-journey-05', 'home-journey-06',
  'home-faq-01', 'home-faq-02', 'home-faq-03',
];

let bad = 0;
ids.forEach(id => {
  const m = home.match(new RegExp('id="' + id + '"[\\s\\S]*?<div class="accordion-body gp-accordion__body">([\\s\\S]*?)</div>'));
  if (!m) { console.log('MISSING ' + id); bad++; return; }
  const text = strip(m[1]);
  // check each sentence-ish chunk so a stray edit anywhere is caught
  const chunks = text.split(/(?<=\.)\s+/).filter(c => c.length > 25);
  const origin = Object.keys(sources).find(k => chunks.every(c => sources[k].includes(c)));
  if (origin) {
    console.log('ok       ' + id.padEnd(16) + chunks.length + ' sentences, all verbatim from ' + origin);
  } else {
    bad++;
    console.log('UNSOURCED ' + id);
    chunks.forEach(c => {
      const found = Object.keys(sources).filter(k => sources[k].includes(c));
      if (!found.length) console.log('       not in any approved page: "' + c.slice(0, 70) + '..."');
    });
  }
});

// House style, per the v2.1 rules
const homeText = strip(home);
[['em dash', /—/], ['en dash used as punctuation', / – /], ['valet', /\bvalet\b/i], ['district', /\bdistrict\b/i]]
  .forEach(([label, re]) => {
    if (re.test(homeText)) { console.log('STYLE   home page contains ' + label); bad++; }
  });

console.log(bad ? '\n' + bad + ' problem(s)' : '\nAll home accordion copy traced to approved pages; house style clean.');
process.exit(bad ? 1 : 0);
