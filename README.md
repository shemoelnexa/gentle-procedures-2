# Gentle Procedures — Website Concepts

Two high-end, minimal, world-class concept sites for **Gentle Procedures Dubai** (a member of The Pollock Group). Same brand, fonts, renders and copy — two distinct ways of moving through the story.

Both concepts are drawn from the supplied design references — **Soneva** and **Diamond Rose Sanctuary** — and are deliberately different temperaments of the same brand. Serif-led, centered/editorial, warm, unhurried, **no italics**.

## Pages
| File | What it is |
|------|-----------|
| `index.html` | Chooser landing — presents both concepts |
| `concept-a.html` | **The Stillness** (Soneva-family) — centered & symmetric, all-serif, cinematic **cream / espresso / gold** chapters. Dark full-bleed image chapters alternate with calm centered cream interludes; the Five Quiet Promises are a **Six Senses-style carousel** (image band + circular arrows + peeking teaser columns); an espresso "standard" section and a centered testimonial. |
| `concept-b.html` | **The Quiet Hours** — a **dark, cinematic, immersive** counterpoint: near-black warm base, **gold** accent, a fixed left **chapter-rail** that scroll-spies your position, photography-led full-bleed "scenes" (Arriving / Held close / Home together), and a dark promises list. Deliberately the opposite temperament of Concept A. |

## Design language
- **Palette:** Concept A — warm cream `#EFE7D6` base, **muted gold `#B08A4C`** accent over **espresso `#211A12`** darks. Concept B — near-black warm base `#15100A`, ivory text `#ECE3D2`, **gold `#C29A5A`** accent. The logo's teal appears only in the logo itself.
- **Type:** `Canela` (display serif, headings) + `Canela Text` (serif body copy, the Soneva-style literary feel) + `Söhne` (labels, nav, buttons, microcopy). No italics.
- **Imagery:** the supplied clinic renders + the supplied logo (processed to transparent `assets/img/logo.png`, an ivory version, and an extracted heart-hand mark used as the favicon / footer mark / preloader).

## Motion
GSAP + ScrollTrigger + Lenis smooth scroll. Preloader, magnetic buttons, custom cursor, count-up stats, split-line reveals, gentle parallax on full-bleed imagery. Calm and slow, in keeping with the references. All motion respects `prefers-reduced-motion`.

## Run locally
```
node scripts/serve.js   # then open http://127.0.0.1:4173
```
(Libraries load from CDN — an internet connection is needed for GSAP/Lenis.)

## ⚠️ Font licensing
The provided fonts are **trial/test cuts** (`Canela …-Trial`, `TestSöhne …`). They are fine for these concept previews but **must be replaced with fully-licensed webfonts before any public/production launch.**

## Assets
- `assets/fonts/` — Canela + Söhne (web `@font-face` in `assets/css/base.css`)
- `assets/img/` — processed logo variants + optimised clinic renders
- `scripts/` — helper scripts (logo processing, local server, headless screenshot QA)
