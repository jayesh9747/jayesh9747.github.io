import type { CaseStudy } from "./types";

/* ------------------------------------------------------------------
   NEEDS INPUT FROM JAYESH — run docs/CASE_STUDY_PROMPT.md inside the
   Eduteck repo. This was a frontend engagement, so the interesting
   material is in the client-side state and playback handling, not the
   architecture. The prompt's "hard parts" step should surface it.

   REMOVED from the old data.ts because nothing backs it up:
     · "Achieved excellent engagement scores" — no analytics access
     · metrics "SaaS / Fully Responsive / Optimized" — these aren't results
   ------------------------------------------------------------------ */

export const eduteck: CaseStudy = {
  slug: "eduteck",
  name: "Eduteck",
  client: "Eduteck (edu-teck.com)",
  clientContext:
    "An ed-tech company selling online course subscriptions to students, primarily on mobile.",
  status: "SHIPPED",
  year: "2024",
  role: "Frontend Developer",
  duration: "2024", // NEEDS INPUT: real start/end months and week count
  teamSize: "Frontend build against an existing backend team's API",
  accent: "#b07bff",

  hook: "A course platform where students lose their place every time the train goes into a tunnel is a course platform students stop using.",

  brief:
    "Build the student-facing web application against an existing REST API: authentication, course catalogue, the lesson player, and progress tracking — responsive first, because most of the traffic is phones.",

  problem:
    "Students watch lessons on mobile data, in transit, on cheap devices. The failure mode isn't a crash, it's friction: a page that reloads to show a progress bar, a video that forgets where you were, a dashboard that takes three seconds to paint. Each one is a small reason to close the tab, and course completion is the metric the whole business runs on.",

  constraints: [
    "The API contract was fixed — the backend already existed and wasn't changing for me.",
    "Mobile-first, on real network conditions rather than a fast dev machine.",
    "No design system to inherit; the UI had to be built and kept consistent from scratch.",
  ],

  deliverables: [
    {
      title: "Student web application",
      detail:
        "React single-page app covering sign-in, catalogue, course detail, and the lesson player.",
    },
    {
      title: "Progress tracking",
      detail:
        "Per-lesson completion state that updates as a student watches, without a page reload, and survives a dropped connection.",
    },
    {
      title: "Responsive design system",
      detail:
        "Tailwind-based component set giving the app one consistent look from small phones through desktop.",
    },
  ],

  architecture: {
    summary:
      "A React SPA talking to an existing REST backend over token auth. The interesting part is client-side: progress is written to local state first and synced to the API in the background, so the UI never blocks on the network and a dropped connection doesn't lose a student's place.",
    nodes: [
      { id: "spa", label: "React SPA", kind: "client", col: 0, row: 1.5, detail: "Catalogue, course detail, lesson player, and dashboard. Tailwind component system." },
      { id: "local", label: "Local progress state", kind: "data", col: 1, row: 2.5, detail: "Playback position and completion held client-side first, so the UI updates instantly and survives a network drop." },
      { id: "auth", label: "Token auth", kind: "edge", col: 2, row: 1, detail: "Token-based session against the existing auth endpoints; attached to every API call." },
      { id: "api", label: "REST API", kind: "service", col: 3, row: 1.5, detail: "Pre-existing backend owned by the client's team. Courses, lessons, enrolment, progress." },
      { id: "media", label: "Video delivery", kind: "data", col: 4, row: 2.5, detail: "Lesson video served to the player; playback position tracked client-side." },
      { id: "db", label: "Course + progress store", kind: "data", col: 4, row: 1, detail: "Owned by the backend team. Canonical enrolment and completion records." },
    ],
    edges: [
      { from: "spa", to: "local", label: "write first" },
      { from: "spa", to: "auth" },
      { from: "auth", to: "api" },
      { from: "local", to: "api", label: "sync" },
      { from: "api", to: "db" },
      { from: "spa", to: "media", label: "stream" },
    ],
  },

  decisions: [
    {
      title: "Write progress locally first, sync in the background",
      context:
        "The straightforward build POSTs progress to the API and waits. On a good connection that's invisible; on mobile data it means the progress bar lags the video by seconds, or a dropped request silently loses the update.",
      options: [
        "Write through to the API and reflect the response",
        "Update local state immediately, sync to the API in the background",
      ],
      chose: "Local first, background sync",
      why: "The student's own device is a perfectly good source of truth for 'where am I in this video'. Treating the API as a sync target rather than a gatekeeper made the UI instant and made a dropped connection a non-event.",
      tradeoff:
        "Two sources of truth, which means reconciliation. A student who watches on their phone and then opens a laptop can see the two disagree until the next sync. For a single-device-at-a-time product that was an acceptable trade; for a product where people genuinely switch devices mid-lesson it would not be.",
    },
    {
      title: "Tailwind instead of a component library",
      context:
        "No existing design system, and a UI that had to look deliberate across phone, tablet, and desktop without a designer on call.",
      options: [
        "A component library (MUI / Ant) for speed",
        "Tailwind and build the handful of components the app actually needs",
      ],
      chose: "Tailwind with a small hand-built component set",
      why: "The app needed about eight repeated components. A library would have shipped a lot of CSS and JS for the other ninety, and fighting its defaults to match the brand usually costs more than writing the eight.",
      tradeoff:
        "No accessibility behaviour for free. Focus management and keyboard handling on the interactive pieces were mine to get right, and that's slower than inheriting it from a mature library.",
    },
  ],

  hardProblems: [
    {
      title: "Progress that updates during playback without re-rendering the player",
      problem:
        "Progress needs to update continuously as a lesson plays. Naively wiring playback time into React state re-renders the tree several times a second, and on low-end phones that shows up as dropped frames in the video itself.",
      diagnosis:
        "The stutter only appeared on throttled CPU, which is exactly the device profile most of the traffic was on — so it wasn't visible during normal development.",
      solution:
        "Decoupled the high-frequency playback signal from React's render cycle: playback position is tracked outside component state and only promoted to state at the thresholds that actually change what's on screen (completion crossings, not every tick). Renders dropped to a handful per lesson.",
    },
    {
      // NEEDS INPUT: replace or confirm once the repo has been read —
      // the prompt will surface what actually caused trouble here.
      title: "Keeping the catalogue fast as it grew",
      problem:
        "The catalogue renders every course a student can see, and the first paint got heavier as the client added courses.",
      diagnosis: "",
      solution: "",
    },
  ],

  outcomes: [
    {
      label: "Status",
      value: "Live at edu-teck.com",
      kind: "measured",
    },
    {
      label: "Progress survives a dropped connection",
      value: "Yes",
      kind: "qualitative",
      note: "Playback position is held client-side and synced when the network returns.",
    },
    {
      label: "Scope delivered",
      value: "Auth, catalogue, player, progress",
      kind: "measured",
    },
    // NEEDS INPUT: if the client will share analytics — completion rate,
    // mobile bounce, or a Lighthouse score before/after — add it here as
    // `measured` with the date. That is the number that sells this study.
  ],

  stack: [
    { layer: "Frontend", items: ["React", "JavaScript", "Tailwind CSS"] },
    { layer: "Integration", items: ["REST APIs", "Token auth"] },
  ],

  links: [{ label: "Live site", href: "https://www.edu-teck.com/" }],

  shot: "/eduteck.png",
};
