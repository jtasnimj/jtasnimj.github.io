# Open questions — ask the user before building

These are blocking. Resolve all four before scaffolding the codebase.

---

## 1. Which direction do we ship?

Two complete prototypes exist:

- **Direction A — "Quiet Scholar"**
  Inter, Stanford-cardinal accent, generous whitespace, single-column-friendly. Restrained, scholarly. Easier to read on small screens.

- **Direction B — "Editorial Grid"**
  Space Grotesk + JetBrains Mono, warm terracotta accent, magazine-style heavy rules and grids, larger display type, multi-column emphasis. More expressive, harder to compress.

Ask: **"A, B, or a merge of moves from both?"** If a merge, ask which specific moves to keep from each (e.g. A's Home + B's Publications layout).

---

## 2. Roll in the Aperture identity?

A separate brand identity sheet (`Logo.html`) defines the canonical logo + palette + type system:

- **Aperture mark** — thin ring + three-node cluster, navy / teal / warm gold.
- **Type** — Cormorant Garamond serif wordmark + IBM Plex Mono.
- **Palette** — Midnight Field / Deep Navy / Scholar Teal / Soft Ivory / Warm Vellum / Manuscript Gold / Folio Rose.

This identity was approved *after* the two direction prototypes were built. The Aperture mark currently appears only in Direction A's Home upper-right and on `Logo.html`. Direction B still uses a different (also Aperture-styled but slightly different) mark in its nav and an editorial "figure plate" version in the hero.

Ask: **"Apply the full Aperture identity (navy / teal / ivory / gold + Cormorant Garamond + Plex Mono) end-to-end on the chosen direction, or keep that direction's original palette and type?"**

If full Aperture: retone every accent color, swap every font, regenerate the chip/pill backgrounds, redo the radial collab-map node fills.

If keep original: still drop in the Aperture mark as the nav logo and replace any remaining mortarboard-style imagery.

---

## 3. Real URLs and contact details

The prototypes use placeholders. Get the real values from the user:

- Google Scholar profile URL
- LinkedIn URL
- GitHub URL (optional)
- ORCID (optional)
- ResearchGate (optional)
- CV PDF — either a hosted URL, or have the user attach the file and host it locally
- Preferred email — currently `sakib.mostafa@stanford.edu`, confirm
- Phone (optional, only if user wants it public)
- Mailing address (optional, only if user wants it public)

---

## 4. Favicon, OG image, headshot

- **Favicon** — confirm the Aperture mark (compact 24px variant) is the favicon. Generate `favicon.svg`, `favicon-32.png`, `apple-touch-icon-180.png`, `android-chrome-512.png`.
- **OG image (1200×630)** — propose the primary horizontal lockup centered on Soft Ivory, with name + tagline + Stanford line. Confirm with user.
- **Headshot** — the prototypes do not include a photo. Ask: **"Do you want a headshot on Home or Contact? If yes, attach the image."** If no, skip.

---

## Nice-to-have follow-ups (not blocking)

- Custom domain? (e.g. `sakibmostafa.com`)
- Analytics? (Plausible / GoatCounter / none)
- Per-publication PDF links / DOI links?
- Search across publications? (probably overkill for ~20 papers — skip unless asked)
- Dark mode? The Aperture identity has a reverse / dark variant baked in. Worth asking.
- An RSS feed for "In preparation" updates? (Probably no, but ask.)
