# Copy v2.1 — what was applied

`staging/` is the untouched mirror of the build as it stood on 2026-08-31.
`site/` is the same build with every change from the copy document applied.
Diff any page against its twin to see exactly what moved.

Run `python scripts/qa_site.py site` to re-check the whole build.

---

## Structure

| Page | Before | After |
|---|---|---|
| our-surgeon.html | full page | redirect stub → `our-team.html#surgeon` |
| whats-included.html | full page | redirect stub → `what-to-expect.html#included` |
| our-team.html | surgeon as a grid card | named surgeon profile with photograph, then the team grid |
| what-to-expect.html | 5 accordion steps + a details block + a summary retelling | 8 sequential steps, then the included list and One fee |
| Nav | 8 items | 7 items (What's Included removed) |

The stubs carry `noindex`, a canonical, a meta refresh and a JS redirect.
**Replace them with server-side 301s at launch.**

## Home
- Hero: the two figures removed; they land in the statistics band a screen below.
- A global standard: countries named, the boast and its disclaimer removed.
- The journey accordion replaced by **The day, in short** — six statement lines, no
  numbering, and a *What to expect* button.
- Questions accordion replaced by three question headings linking through; the
  heading typo *"Your questions is answered"* corrected to *"Your questions, answered"*.
- Our Approach block: the repeated paragraph removed, heading, first line and button kept.
- Pull quote removed (it stays on About Us).
- Visiting Us address now opens Google Maps.

## Our Approach
- Why: dashes to brackets.
- *Before your visit* video block removed — it belongs on What to Expect.
- The technique and Why the UAE rewritten.
- *What it means for your son*: the apologetic heading gone, steps 02 and 03 given
  their full sentences.
- **Comfort** added as a new section, deliberately shorter and differently worded from
  the questions page answer, with a link through to it.
- Our Philosophy removed.
- How we improve rewritten around Gentle Evolution.

## Our Team
- Hero and How we hire: punctuation, and the duplicated sentence removed.
- Surgeon rebuilt as a named profile. **Every `[square bracket]` is a real fact the
  client will supply — nothing invented.** His training sits under it as three plain
  lines, not an accordion.
- The designer's note that was live in the page copy replaced with
  *"First names and roles. One card each."*
- Team cards corrected: Issam, **Kaitlyn, Jaron, Rena Lyka, Shireen**. Headshot files
  renamed to match, so the real photographs drop straight in.
- *Around him*: "DHA-licensed nurses" written out in full.
- Pull quote removed (it stays on Careers).
- *Join our team* button repointed from resources.html to careers.html.

## What to Expect
- Eight steps in the order the day happens. **Getting here** replaces the valet line
  with the real parking facts. Arriving, Afterwards and the guidance line rewritten.
- *On the day* removed — it retold the eight steps and carried three valet mentions.
- *The days after* now opens "Care carries on at home."
- The 998 line kept, dashes to commas.
- What's Included folded in: four group headings kept, the framing paragraph, the
  "four movements" idea and the 01–21 numbering removed. *"The valet at the door"*
  becomes *"Directions, a map pin and parking instructions sent before the day."*
- One fee rewritten.

## Pricing
- Hero second sentence rewritten.
- Band untouched; `Including VAT` marked **HOLD** in an HTML comment.
- *What it covers* rewritten, and the same wording now used in *Before you ask*, so
  the two answers agree.
- *What the fee reflects*: two cards instead of four accordion rows, sitting larger.
- Statistics band removed (third appearance).

## FAQ
- All **50 questions and answers carried over verbatim**. Nothing merged, nothing deleted.
- Regrouped into the seven groups from the document. The heaviest group drops from
  20 questions to 12:

  | Group | Questions |
  |---|---|
  | Before the day | 6 |
  | Is he ready? | 8 |
  | The procedure itself | 6 |
  | The first days at home | 12 |
  | Appearance, healing and later life | 9 |
  | The team and how we work | 6 |
  | Cost, insurance and practical questions | 3 |

  *How do I plan my visit* and *What if I need to reschedule* moved out of Procedure,
  as flagged. Both jump navigations rebuilt. The two pinned safety questions untouched.
- Hero halved. Search untouched.
- The two valet mentions removed from answers and replaced with the real parking facts.

## Resources · Contact Us · Careers
- Resources hero rewritten; "honest guidance" removed. Fridge sheet caption corrected
  to **Gentle Procedures Clinic**.
- Contact Us: hero, address, arriving strip and arriving section all corrected. *No
  question is too small* now appears once, under the hero.
- Careers: "four-year-old **brother**", "genuinely" removed, roles set as full stops.

## Site-wide
- **Valet: 12 mentions, all gone.**
- **Address:** one form everywhere, no district, footer address links to Google Maps.
- **Dashes:** 175 em/en dashes removed site-wide, judged one at a time — commas,
  colons, full stops or brackets. Zero remain, titles and meta descriptions included.
- `pediatric` → `paediatric`. "Gentle Procedures Dubai" → "Gentle Procedures Clinic".
- Meta descriptions and page titles brought in line with the rewritten copy.
- Statistics band now lands once, on the home page.

---

# Flagged for your decision

1. **Home, The Journey.** The section heading *"From the moment you book to the days
   after you're home."* now sits a few lines from the new standfirst *"From the first
   message to the days after you are home."* Same sentence twice. Deleting the
   standfirst fixes it, but that is their new wording — your call, or theirs.
2. **Pricing pull quote removed.** The document said *"Keep if you would rather. Our
   suggestion is that it comes off."* Their recommendation was followed. Restore the
   `QUOTE / WHAT THE FEE REFLECTS` section from `staging/pricing.html` to put it back.
3. **About Us statistics band removed.** Same footing: a recommendation, explicitly
   *"a judgement call rather than an error"*. Restore from `staging/about-us.html`.
4. **One fee sits after the list, not above it.** The note asks for it high on the
   page, but the wording is *"One fee covers every line above"*, which only works
   below the list. Moving it needs a new sentence from them.
5. **Footer copyright** read "© 2026 Gentle Procedures Dubai" and is now
   "Gentle Procedures Clinic", per the site-wide rule. The document called the fridge
   sheet the only place this occurred, so confirm this is not a legal entity name.
6. **Arriving step 4** loses *"Most families are with us for around an hour, and not
   one minute of it feels hurried."* — the final wording ends before it. The
   *Around an hour with us* label is kept.
7. **Our Approach has a free video slot** where the *Before your visit* block was. The
   note suggests the film could sit against the technique section; that needs a line
   of copy from them.
8. **The film itself is a placeholder** pulled from `jayasom.com`. Not flagged in the
   document, but it needs replacing before launch.
9. **Four pages the document does not cover** — About Us and the three Resources
   articles — received the site-wide rules only (valet, address, dashes, spelling).
   Their body copy is otherwise untouched and may want a pass.

# Still waiting on the client

Everything below is marked in the build and blocks nothing.

- **Surgeon:** surname, years in paediatric surgery, qualifying institution, training
  institutions and countries, number of circumcisions, when and how long with
  Dr Pollock, one or two sentences in his own words, DHA licence number.
- **Team:** confirm the spelling of Kaitlyn and Rena Lyka, and each person's consent
  to appear. Real headshots.
- **Contact:** telephone, WhatsApp, opening hours — all still read "to confirm".
- **Footer:** DHA licence number, still a placeholder.
- **VAT:** hold "Including VAT" on the pricing band.
- **13 FAQ answers** await their light punctuation rewrite. Substance unchanged.
- **Parking:** whether the underground parking needs validating, and whether the RTA
  parking outside is free at certain times.
- **Claims on hold:** 100,000+ families, 30 years, four continents, first in the
  Middle East, first international clinic of The Pollock Group, and the Pollock
  certification wording. All left in place; none publishes until confirmed.
- **Password-protect the staging address** before launch — it carries the surgeon's name.
