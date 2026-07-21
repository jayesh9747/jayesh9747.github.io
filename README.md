<div align="center">

# JAYESH.OS

**A freelance portfolio built around two things a client actually wants:
proof the work happened, and honesty about what it cost.**

[**Live → jayesh9747.github.io**](https://jayesh9747.github.io)

`Next.js` · `React 19` · `TypeScript` · `Tailwind v4` · `Framer Motion` · `Lenis`

</div>

---

## What's here

- **Case studies at their own URLs** — `/work/rizzl`, `/work/eduteck`. Each one runs
  problem → constraints → what I built → real architecture diagram → decisions →
  what each decision cost → hard problems → outcomes. Shareable as a single link.
- **Outcomes are tagged `measured` / `estimated` / `observed`.** A portfolio that
  admits which numbers are soft is more believable than one that doesn't.
- **Lab & open source** — GitFlip, QwikAid, the CNCF Kmesh dashboard, Transpectra.
  Deliberately lighter than the case studies so paid work reads differently from
  side projects.
- **⌘K palette** — jump to any section, open a case study, copy the email, or ask
  a question answered from the site's own data. No API key; runs client side.
- **Static export + SEO** — per-page metadata and canonicals, JSON-LD, sitemap
  covering every case study, OG image, `prefers-reduced-motion` respected.

## Adding a case study

1. Run [`docs/CASE_STUDY_PROMPT.md`](docs/CASE_STUDY_PROMPT.md) with Claude Code
   **inside that project's own repo** — it reads the real code rather than guessing.
2. Save the object it returns to `src/lib/case-studies/<slug>.ts` and register it
   in [`src/lib/case-studies/index.ts`](src/lib/case-studies/index.ts).
3. Drop a screenshot (~1600×1000) in `public/`.
4. Fill in the `NEEDS INPUT` comments — real user counts, client quotes, the
   actual reason behind a decision. No tool can write those.

Set `locked: true` on a study that isn't ready: it renders a teaser card on the
homepage and gets no route, so nothing half-written can ship.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

> The boot animation plays once per session, on the homepage only — a case-study
> link opens straight into the case study. To replay it: `sessionStorage.clear()`.

## Project structure

```
src/
├─ app/
│  ├─ page.tsx           homepage composition
│  ├─ work/[slug]/       statically generated case-study pages
│  └─ sitemap.ts         includes every published case study
├─ components/
│  ├─ os/                shell — boot, cursor, dock, ⌘K palette, smooth scroll
│  ├─ sections/          hero, proof, selected work, lab, experience, closing
│  ├─ work/              case-study view + per-project architecture diagram
│  └─ ui/                primitives (Reveal, GlassPanel, MagneticButton…)
└─ lib/
   ├─ data.ts            profile, experience, lab projects, stack, testimonials
   ├─ case-studies/      one file per client engagement + the CaseStudy type
   ├─ knowledge.ts       retrieval powering ⌘K ask-mode (built from the data)
   ├─ hooks.ts           media-query / reduced-motion helpers
   └─ utils.ts           cn(), lerp, clamp, mapRange
```

Facts about Jayesh live in `data.ts`; facts about a client engagement live in
`case-studies/`. Nothing is written twice — `knowledge.ts` builds its answers
from both rather than restating them.

## Deployment

Pushing to `main` builds the static export and publishes to GitHub Pages via
GitHub Actions. Configured for a root user-site (no `basePath`); see
[`next.config.ts`](next.config.ts) for project-page setup.

---

<div align="center">
<sub>Designed & built by Jayesh.</sub>
</div>
