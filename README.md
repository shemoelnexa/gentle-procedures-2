# Gentle Procedures — Website

A high-end, minimal, world-class concept site for **Gentle Procedures Dubai** (a member of The Pollock Group).

Drawn from the supplied design references — **Soneva** and **Diamond Rose Sanctuary** — serif-led, centered/editorial, warm, unhurried, **no italics**. Started as two parallel concepts ("The Stillness" / light and "The Quiet Hours" / dark); consolidated into one **light-only** site that keeps Concept A's centered/symmetric temperament and folds in Concept B's structural ideas — the fixed chapter-rail scroll-spy nav and full-bleed cinematic "scenes" for the family's journey.

Two concepts share the same content, sitemap, branding, and copy — expressed as two distinct designs.

## Pages
| File | What it is |
|------|-----------|
| `index.html` | **Concept selector** — the landing page. A full-screen split of the two concepts ("Cinematic" / "Editorial") over full-bleed clinic photography; hovering a panel expands it and reveals its description, and clicking enters that concept. Own inline styles; reuses base tokens/fonts. |
| `concept-a.html` | **Concept A** — *cinematic*. Centered & symmetric, all-serif, full-bleed photography with dark scrims (page itself is always light), a type-first hero with a giant "Gentle" wordmark, an editorial 3-column "about", an interactive tabbed chapter, a pinned crossfading "journey", frosted-panel promises over photography, and blur-in reveals. |
| `concept-b.html` | **Concept B** — a *luxury-editorial* concept modelled closely on a client-chosen reference (an Eloria/Aethel-style interiors template), rendered in our theme: warm cream body with espresso dark bands and a **brand-teal accent**. A dark full-bleed photo hero with a centered logo nav; an "Our Story" row (label + thumbnails); bordered stat cards; a cinematic full-bleed band with a floating "private screening" card; the Five Promises as a **numbered accordion** (active item reveals its image + copy); "The Day" as a **staggered image grid**; a team section of four **image cards**; a big centered pull-quote; an espresso "Visit" band; and a footer with a giant **image-filled wordmark**. Serif is reserved for large display headings; small numerals/labels are set in the sans. Same content, sitemap, and branding as A — different structure and motion (clip-wipe reveals). Own CSS/JS; reuses only base tokens/fonts. |

## Design language
- **Palette:** warm cream `#EFE7D6` base throughout — **no dark-themed sections**. Accent is the brand's own **teal `#1E4E60`** (sampled from the Gentle Procedures logo wordmark), with a softer tint `#6FA8B4` for labels set over full-bleed photography. Full-bleed photo chapters use a dark scrim purely for text contrast, the same technique the Soneva reference itself uses (a dark aerial photo section inside an otherwise light site) — this is not a dark theme.
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
