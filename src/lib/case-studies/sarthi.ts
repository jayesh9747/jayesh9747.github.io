import type { CaseStudy } from "./types";

/* ------------------------------------------------------------------
   SARTHI — placeholder.

   `locked: true` means:
     · the homepage renders a locked teaser card
     · /work/sarthi is NOT generated, so nothing half-written ships

   TO PUBLISH:
     1. Run docs/CASE_STUDY_PROMPT.md inside the Sarthi repo.
     2. Fill the fields below with what it returns.
     3. Drop a screenshot at public/work/sarthi.png.
     4. Delete `locked` and `lockedNote`.

   NEEDS INPUT FROM JAYESH — I don't know what Sarthi is. The two
   fields that matter right now are `hook` and `lockedNote`: a locked
   card with a real one-liner reads as "coming soon", a locked card
   with filler reads as "unfinished portfolio". Replace the hook below
   before this goes live.
   ------------------------------------------------------------------ */

export const sarthi: CaseStudy = {
  slug: "sarthi",
  name: "Sarthi",
  client: "Sarthi",
  clientContext: "", // NEEDS INPUT: who it's for, one sentence
  status: "IN_PROGRESS",
  year: "2026",
  role: "", // NEEDS INPUT
  duration: "In progress",
  teamSize: "",
  accent: "#56e1c7",

  // NEEDS INPUT — replace this line. It is the only Sarthi copy a
  // visitor will actually read until the study is published.
  hook: "Currently in build. Full case study coming once it ships.",

  brief: "",
  problem: "",
  constraints: [],
  deliverables: [],
  architecture: { summary: "", nodes: [], edges: [] },
  decisions: [],
  hardProblems: [],
  outcomes: [],
  stack: [],
  links: [],

  locked: true,
  lockedNote: "Case study in progress — happy to walk through it on a call.",
};
