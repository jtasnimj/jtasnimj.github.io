# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is right now

This is **not a built site** — it is a high-fidelity design-reference bundle handed off for implementation. The real GitHub Pages site for Sakib Mostafa's portfolio (six pages: Home · Research · Publications · Teaching · CV · Contact) has **not been scaffolded yet**. Read `README.md` (full handoff) and `OPEN_QUESTIONS.md` (blocking decisions) before doing anything.

There is no build system, no `package.json`, no framework, no tests, no linter in the working tree. Git history contains an abandoned Next.js scaffold (`de8ac64`) and an old generic glassmorphism template — **ignore both**; the current untracked bundle supersedes them. Only `CNAME` and `index.html` are git-tracked; the design files are intentionally untracked until a direction is chosen.

`CNAME` is `sakibmostafa.com` — keep it; the site ships to a custom domain.

## Architecture of the prototype bundle

- **`cv-data.js`** — the single source of truth for all content, a global `window.CV` object. Both directions read from it. When building the real site, port this to the chosen framework's data shape **without renaming fields**. The author surname `Mostafa` is bolded wherever it appears in an authors string (substring match).
- **`portfolio-a.jsx`** — Direction A "Quiet Scholar" (Inter, Stanford-cardinal `#8c1515`, restrained). Defines `aTokens`, `AStyle`, per-page components (`AHome`, `AResearch`, …), and exports **`APortfolio`** which takes a `page` prop and renders one of the six pages.
- **`portfolio-b.jsx`** — Direction B "Editorial Grid" (Space Grotesk + JetBrains Mono, terracotta `#b34e2a`, magazine layout). Same structure, exports **`BPortfolio`**. Design tokens live in `bTokens`.
- **`Logo.html`** — the canonical **Aperture** brand identity sheet (mark geometry, navy/teal/ivory/gold palette, Cormorant Garamond + IBM Plex Mono). Approved *after* the two directions were built, so it is not yet rolled into either — see open question #2.
- **`index.html`** — an in-browser Babel-standalone canvas that renders both directions side by side via `<DesignCanvas>`/`<DCArtboard>` wrappers. **Reference only — none of this canvas chrome ships.** Only the `APortfolio`/`BPortfolio` components get ported.

The two directions are fully parallel implementations of the same six pages over the same data — pick one (or a merge) per OPEN_QUESTIONS.md #1.

## Previewing the prototype

`index.html` loads `cv-data.js`, `portfolio-a.jsx`, `portfolio-b.jsx` over CDN React + Babel, so it needs to be served over HTTP, not opened as a `file://`:

```
python3 -m http.server 8000   # then open http://localhost:8000
```

**Caveat:** `index.html:22` references `design-canvas.jsx`, which is **missing from the repo**. As-is, `DesignCanvas`/`DCSection`/`DCArtboard`/`DCPostIt` are undefined and the page will not render. To preview a single direction, render `<APortfolio page="Home" />` (or `<BPortfolio …>`) directly instead of the `DesignCanvas` tree.

## Hard constraints (from the signed-off handoff — do not violate)

- **Pixel-perfect.** Colors, type scale, spacing, borders, and copy are final. Recreate exactly.
- **No motion.** The earlier mortarboard-flip / hand illustration was explicitly removed. Do not add animations beyond an optional subtle Aperture-mark presentation.
- **No job-market framing.** All "academic job market / 2026–27 faculty market" language was deliberately stripped. Never reintroduce it.
- **Canvas chrome never ships** — `index.html`, `DesignCanvas`, `DCArtboard`, post-its, artboard scaling are review tooling only.
- In the **Aperture** palette, gold (`#B9883C`) is reserved for the accent node, full-stops, and small precise moments — never a large fill.
- The Contact page collaborator map uses hand-tuned position percentages documented inline in the JSX; preserve them when porting.

## Building the real site

`README.md` recommends **Astro** (zero-JS, file-based routing → one `.astro` per page, trivial Pages deploy); Next static export or Vite+React are acceptable fallbacks. Before scaffolding, the four blocking items in `OPEN_QUESTIONS.md` must be resolved with the user: (1) which direction to ship, (2) whether to roll in the full Aperture identity, (3) real social/contact URLs + CV PDF, (4) favicon/OG image/headshot. Set the framework's `base`/deploy so it serves correctly from the `sakibmostafa.com` custom domain.

## Outstanding work / TODO

1. **Resolve `OPEN_QUESTIONS.md` (4 blockers)** with the user — nothing real can be scaffolded until then.
2. **Recover or stub `design-canvas.jsx`** if the side-by-side prototype preview is needed (currently missing → `index.html` does not render).
3. **Scaffold the production static site** (Astro recommended) and port `APortfolio`/`BPortfolio` + `window.CV` for the chosen direction.
4. **Supply assets**: `cv.pdf`, favicon set + OG image derived from the Aperture mark, optional headshot.
5. **Add the GitHub Pages deploy workflow** and confirm the `CNAME` / custom-domain config.
6. The design bundle files are untracked — commit them once a direction is locked so the handoff is preserved.
