# Inner pages — Gentle Procedures Dubai

Fourteen inner pages plus a directory index, built on the **Gentle Procedures 3**
theme (Figma file `HmxadvCHVFaJhrgd6vJ0Hp`, frame `2:2` — the navy/parchment
homepage direction).

Open `inner/index.html` for the page directory.

## What came from where

- **Theme** — palette, type scale, chrome, spacing, motion, buttons, footer — is
  read from the Figma frame. The design frame is **1904px** wide, so every size is
  the design value expressed as `clamp(min, value/1904*100 vw, value)`; at ~1904px
  the pages match the frame's own scale 1:1. Same convention as `coming-soon/`.
- **The section vocabulary is the frame's own.** Where the homepage already solves a
  problem, these pages reuse its solution rather than inventing a second one. The
  patterns are catalogued at the top of `css/inner.css` and listed below.
- **Copy** is the approved wording from `~/Downloads/gentle-procedures-inner-pages.html`,
  placed verbatim. Two pages in that file were out of scope by instruction and are
  not built here: *The Gentle Protector* and *Homepage V5 / Homepage Five*.

## The pattern vocabulary

Nine patterns, all lifted from frame `2:2`. Each page composes a different sequence
of them, so no two pages read the same way.

| | Pattern | The frame's own use |
|---|---|---|
| **A** | `.phero` cinematic hero — photo, 4-stop scrim, eyebrow, Canela display | the homepage hero |
| **B** | `.statement` one left column: eyebrow, Canela head, lede, prose, navy pill | "Gentle is something we practise…" |
| **C** | `.duo` copy beside a 20px-radius image | "A global standard, now in Dubai" |
| **D** | `.figures` giant Canela numerals, navy unit marks | the 1 / 4 / 30yrs / 100k+ row |
| **E** | `.filmband` bright full-bleed photo + floating cream card | "THE FILM · From our family to yours" |
| **F** | `.ledger` numbered hairline accordion | "From the moment you book…" 01–05 |
| **G** | `.nightlist` chevron accordion over photography | "Your questions is answered" |
| **H** | `.veil` quote over photo, right-aligned cream serif | "The night before, every parent asks…" |
| **I** | `.marble` travertine wash, big head, label/value pairs | "We would be honoured to welcome your family" |

**B is the workhorse.** The frame almost never sets a small label in one column
against prose in another, so neither do these pages — an earlier draft leaned on that
split for nearly every section and it read as a different site.

**F and G are both accordions and are not interchangeable.** F is the light ground
one: rule above each row, Söhne `01` at `.14em`, Canela 33.6px title, both turning
navy when open, body indented to the title. G is the dark one: no rules, a chevron at
the left, cream Canela question, small cream Söhne answer.

Per-page sequences:

```
about-us              A B E C D G I H B
pollock-technique     A B · C F C I B
our-team              A B roster F H B
our-surgeon           A C F I
newborn-…-dubai       A B F E C G
circumcision-package  A B F(plain) D I
pricing               I+D C F H G B
faqs                  A B F(open) F G B
resources             A C reads G I
contact               A I C G
careers               A B F C H
```

## Layout

```
inner/
  index.html                 page directory
  about-us.html              /about-us
  pollock-technique.html     /pollock-technique          — Our Approach
  our-team.html              /our-team
  our-surgeon.html           /our-surgeon               — noindex until 8 Sept
  newborn-circumcision-dubai.html   /newborn-circumcision-dubai — What to Expect
  circumcision-package-dubai.html   /circumcision-package-dubai — What's Included
  pricing.html               /pricing                   — button-only, not in nav
  faqs.html                  /faqs                      — all 52 questions
  resources.html             /resources
  resources-caring-for-him-at-home.html
  resources-choosing-a-provider.html
  resources-preparing-your-home.html
  contact.html               /contact
  careers.html               /careers
  css/inner.css   js/inner.js   fonts/   img/
```

Self-contained, like `coming-soon/` — no dependency on the main site's `assets/`.
The foundation block at the top of `inner.css` is the trimmed subset of
`assets/css/base.css` these pages use.

## How the chrome works

The nav, footer and prev/next block are injected by `inner.js` from the `PAGES`
sitemap object, into `<div data-chrome="nav">`, `"onward"` and `"foot"` slots. One
source of truth for fifteen pages — edit the sitemap in `inner.js`, not each page.

Everything else is progressive. With JS off, all copy is present, every accordion
still opens (`<details>`), and nothing is hidden — the reveal initial states are
gated on `html.js`.

## Design decisions worth knowing

- **Two registers.** Paper (`#F3ECD8`) is daylight; Evening Navy (`#1E3A5F`) is
  the night. FAQ uses the switch structurally: groups 01–03 in daylight, then a
  threshold statement, then 04–07 on navy, each register with its own category rail.
- **Photography is never faked.** Where a real photograph does not exist yet — the
  team headshots, the surgeon's portrait — the frame is an honest reserved space
  with its own treatment, not a stand-in picture of something else.
- **`--strip-h`** is measured at runtime by `initStrip()` so the FAQ's pinned
  safety strip and the fixed nav never overlap when the strip's copy wraps.
- **Reveals that use `clip-path`** observe their *parent*: an element clipped to
  nothing has an empty intersection rect and can never observe itself into view.

## Open items carried from the copy source

- `our-surgeon.html` is `noindex` and absent from the nav and footer until
  00:01 on 8 September 2026. `our-team.html` carries the fuller surgeon copy in
  the meantime, with the link to it commented out rather than pointing nowhere.
- The Tabby instalments paragraph on `pricing.html` is written and commented out;
  it goes live once the agreement is signed. The page also awaits the DHA
  advertising permit.
- Team names, roles, open roles, phone numbers, opening hours and the DHA licence
  number are the source file's placeholders, still to come from the client.
- `newborn-circumcision-dubai.html` chapter 04 needed a heading supplied (the copy
  source flagged it). It currently reads *"A private room is yours."*, drawn from
  the paragraph's own first sentence. Needs approval or cutting.

## QA

```
node scripts/inner-shoot.js <slug[,slug]> <outDir> [WxH] [motion|reduce] [full]
```

Runs headless Chrome on the host against an in-process static server, reports
section offsets, horizontal overflow and console/network errors, then screenshots.
Always do a **motion** pass as well as `reduce` — `reduce` forces reveals visible
and so masks broken ones.

## Fonts

Canela, Canela Text and Söhne are **trial cuts** and must be licensed before
production.

## Layout audit

```
node scripts/inner-audit.js [WxH]
```

Measures real geometry in headless Chrome and reports four classes of defect:

- **indent / outdent** — a text block sitting 1–72px inside its column, which the
  eye reads as broken. Component gutters (the ledger numeral, the night-list
  chevron, card padding) are skipped; their *consistency* is checked instead.
- **wobble** — titles in one list that do not share a left axis. This catches the
  real bug that proportional figures cause: `01` and `11` differ by ~5px, so a
  21-row list visibly drifts. Fixed by `--no-w` + `tabular-nums`.
- **axis** — a row's body not sitting on its own title's axis. Caught a ~6px drift
  from computing the body indent in the body's font size rather than the numeral's.
- **overflow / measure / collide** — blocks past their container, reading measures
  beyond 98 characters, and negative gaps inside a `.statement`.

Run it at **1904 / 1440 / 1024 / 768 / 390** after any layout change. All six
widths currently report zero.

One gutter variable pair drives every numbered list — `--gut` and `--no-w` on `.gp`
feed the numeral box, the row gap, the body indent and the FAQ group heads, so
titles and bodies cannot drift apart again. Below 760px the numeral moves above its
title so the whole row goes flush; a 40px gutter costs a tenth of a phone's width.
