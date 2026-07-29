import type { CaseStudy } from "./types";

/* ------------------------------------------------------------------
   NEEDS INPUT FROM JAYESH — run docs/CASE_STUDY_PROMPT.md inside the
   Rizzl repo and replace the marked fields with what the code proves.

   Everything below is carried over from the old data.ts and rewritten
   to only claim what can be defended in a client call. Two numbers were
   REMOVED because nothing backs them up:
     · "1k+ active users"            → ask Himani for the real figure
     · "reduced database load by 80%" → no benchmark exists; now qualitative
   Put them back only with a source.
   ------------------------------------------------------------------ */

export const rizzl: CaseStudy = {
  slug: "rizzl",
  name: "Rizzl",
  client: "Rizzl (rizzl.in)",
  clientContext:
    "An early-stage creator-marketing startup backed by the Indian School of Business, connecting brands with Instagram creators.",
  status: "SCALING",
  year: "2025",
  role: "Tech Lead — sole engineer",
  duration: "Nov 2025 — Jan 2026 · ~3 months",
  teamSize: "1 engineer (me) + founder",
  accent: "#ffb86b",

  hook: "Rizzl had a business model and no product. I built all three apps and shipped them to production in three months.",

  brief:
    "The founders needed the whole platform, not a piece of it: an app creators install, a portal brands log into, and an admin panel the team runs campaigns from. All three had to share one backend, one identity system, and one payout ledger.",

  problem:
    "Creator marketing runs on trust in the numbers. A brand pays for engagement it cannot see, and a creator gets paid on a figure they did not calculate. Rizzl needed to sit in the middle and be believable to both — which meant pulling engagement metrics straight from Instagram rather than taking anyone's word, and computing payouts the same way every time. Doing that naively means hammering the Instagram Graph API and the database on every screen load.",

  constraints: [
    "One engineer, three client applications, three months to launch.",
    "Instagram Graph API rate limits and short-lived tokens sit on the critical path of every metric shown.",
    "Money is involved — payout maths has to be reproducible and auditable, not eventually consistent.",
    "Pre-revenue startup: infrastructure had to stay on a small AWS footprint.",
  ],

  deliverables: [
    {
      title: "Creator mobile app",
      detail:
        "React Native app for iOS and Android — Instagram sign-in, campaign discovery, submission flow, and earnings view.",
    },
    {
      title: "Brand portal",
      detail:
        "Web app where brands create campaigns, set engagement targets, and track creator performance against them.",
    },
    {
      title: "Admin panel",
      detail:
        "Internal tool for the Rizzl team to approve creators, resolve payout disputes, and run campaign operations.",
    },
    {
      title: "Payout engine",
      detail:
        "Scheduled service that reads cached engagement metrics, computes creator credits on a fixed rule set, and writes an auditable ledger entry per cycle.",
    },
    {
      title: "Production infrastructure",
      detail:
        "AWS EC2 + RDS deployment, database migration pipeline via Prisma, and the release process the team still uses.",
    },
  ],

  architecture: {
    summary:
      "Three thin clients talk to one Express API. The API owns identity and business rules; Postgres owns the truth about campaigns and money. Redis sits between the API and the Instagram Graph API so that engagement numbers are fetched on a schedule, not on page load. A cron worker turns those cached metrics into ledger entries.",
    nodes: [
      { id: "app", label: "Creator App", kind: "client", col: 0, row: 1, detail: "React Native, iOS + Android. Instagram OAuth sign-in, campaign feed, earnings." },
      { id: "brand", label: "Brand Portal", kind: "client", col: 0, row: 2, detail: "Campaign creation, engagement targets, creator performance tracking." },
      { id: "admin", label: "Admin Panel", kind: "client", col: 0, row: 3, detail: "Creator approval, payout dispute resolution, campaign ops." },
      { id: "api", label: "Express API", kind: "service", col: 2, row: 1.6, detail: "Single backend for all three clients. Owns auth, campaign rules, and payout policy." },
      { id: "auth", label: "Auth (OTP + IG OAuth)", kind: "edge", col: 1, row: 1.6, detail: "Phone OTP for account creation, Instagram OAuth for verifying the creator actually owns the handle. Tokens encrypted at rest." },
      { id: "ig", label: "Instagram Graph API", kind: "service", col: 3, row: 3, detail: "Source of truth for follower counts and post engagement. Rate limited, tokens expire." },
      { id: "cron", label: "Payout Worker", kind: "queue", col: 3, row: 1, detail: "Scheduled job. Reads cached metrics, applies the payout rules, writes ledger entries." },
      { id: "redis", label: "Redis", kind: "queue", col: 3, row: 2, detail: "Caches engagement metrics between scheduled refreshes so screens never hit Instagram directly." },
      { id: "db", label: "PostgreSQL (RDS)", kind: "data", col: 4, row: 1.6, detail: "Creators, brands, campaigns, and the payout ledger. Schema managed with Prisma migrations." },
    ],
    edges: [
      { from: "app", to: "auth" },
      { from: "brand", to: "auth" },
      { from: "admin", to: "auth" },
      { from: "auth", to: "api" },
      { from: "api", to: "redis", label: "read metrics" },
      { from: "api", to: "db", label: "query" },
      { from: "cron", to: "ig", label: "refresh" },
      { from: "cron", to: "redis", label: "cache" },
      { from: "cron", to: "db", label: "write ledger" },
    ],
  },

  decisions: [
    {
      title: "PostgreSQL + Prisma over MongoDB",
      context:
        "Every other service I'd built for early-stage clients used MongoDB, and it would have been faster to start with. But this schema holds money.",
      options: [
        "MongoDB — fastest to iterate while the payout model was still changing",
        "PostgreSQL + Prisma — real transactions, real constraints, versioned migrations",
      ],
      chose: "PostgreSQL with Prisma",
      why: "A payout ledger needs foreign keys and transactions, not application-level discipline. Prisma's migration history also meant the schema changes were reviewable — useful when I was the only person who could review them.",
      tradeoff:
        "The first month was slower. The payout model changed three times and each change was a migration instead of just writing a different shape of document. I'd make the same call again, but it cost real days early on.",
    },
    {
      title: "Cache engagement metrics instead of fetching them live",
      context:
        "The obvious build fetches a creator's Instagram stats when a screen opens. That breaks immediately — Graph API rate limits are per-token, and a campaign screen showing 40 creators means 40 calls.",
      options: [
        "Fetch on demand with a short TTL",
        "Refresh on a schedule into Redis and always read from cache",
        "Store every metric snapshot in Postgres and query the latest",
      ],
      chose: "Scheduled refresh into Redis; the API only ever reads cache",
      why: "It decouples the read path from Instagram entirely. Screens stay fast and stay up even when the Graph API is throttling or a token needs refreshing.",
      tradeoff:
        "Numbers on screen are as fresh as the last refresh cycle, not live. Creators occasionally ask why a post from an hour ago isn't counted yet. Worth it — the alternative is a product that gets slower as it grows.",
    },
    {
      title: "Instagram OAuth for identity, not just for data",
      context:
        "Anyone can type in a handle. If Rizzl pays out on self-reported follower counts, it has a fraud problem on day one.",
      options: [
        "Manual verification by the Rizzl team",
        "Instagram OAuth — the creator proves ownership by logging in",
      ],
      chose: "Instagram OAuth, with access tokens encrypted at rest",
      why: "It makes handle ownership provable and gives access to real engagement data in the same step. Manual review doesn't scale past the first hundred creators.",
      tradeoff:
        "It put Rizzl on Meta's platform timeline — app review, permission scopes, and token expiry all became our problem. It also means a creator who revokes access silently breaks their own payouts, which needed its own handling.",
    },
    {
      title: "One backend for three clients",
      context:
        "Mobile app, brand portal, and admin panel have genuinely different needs. The textbook answer is a service per surface or a BFF per client.",
      options: [
        "A service per client surface",
        "One Express API with role-scoped routes",
      ],
      chose: "One API, roles enforced at the route layer",
      why: "One engineer cannot operate three deployments. A single API meant one auth implementation, one migration path, one thing to debug at 2am.",
      tradeoff:
        "The API does too much and the admin routes are the messiest part of the codebase. This is the first thing that should be split when Rizzl hires a second backend engineer — and I flagged it as such at handover.",
    },
  ],

  hardProblems: [
    {
      title: "Instagram tokens expire and take payouts down with them",
      problem:
        "Long-lived Instagram tokens still expire, and they expire per creator, silently. A creator who onboarded 60 days ago would just stop accruing engagement — no error, no signal, until they asked why their earnings had flatlined.",
      diagnosis:
        "Traced a creator's missing credits back through the payout worker and found the metric refresh had been failing for that single account for weeks. The worker was catching per-creator errors so one bad token wouldn't kill the whole batch — which was right, but it meant failures were invisible.",
      solution:
        "Made token state explicit rather than incidental: the refresh worker records the outcome per creator, accounts with failing tokens get flagged, and the app prompts a re-link instead of quietly showing stale numbers. The batch still isolates failures — it just no longer swallows them.",
    },
    {
      title: "Payout runs had to be re-runnable without double-paying",
      problem:
        "The payout worker is a scheduled job, and scheduled jobs get retried — by the scheduler, or by me, manually, when something looked wrong. A naive implementation credits a creator twice.",
      diagnosis:
        "Obvious in review before it ever hit production, but it shaped the whole design: any job that writes money has to be safe to run twice.",
      solution:
        "Ledger entries are keyed on (creator, campaign, cycle) so a re-run collides with the existing row instead of appending a second one. Re-running a cycle is a no-op, which made the job safe to retry and safe to operate manually.",
    },
    {
      // NEEDS INPUT: the repo will surface a third real one — the prompt's
      // "hard parts" investigation step is designed to find it.
      title: "Three clients, one release",
      problem:
        "Mobile app updates ship on Apple and Google's timeline; the web apps ship whenever. A backend change that all three depend on can't assume everyone updated.",
      diagnosis:
        "Hit this the first time a payout response shape changed and older app builds were still in the wild.",
      solution:
        "Backend changes became additive by default — new fields alongside old ones, removals only after the app version that needed them had aged out. Slower, but it stopped the mobile store review queue from being on the critical path for backend work.",
    },
  ],

  outcomes: [
    {
      label: "Applications shipped",
      value: "3",
      kind: "measured",
      note: "Creator mobile app, brand portal, admin panel — all live in production.",
    },
    {
      label: "Concept to production",
      value: "~3 months",
      kind: "measured",
      note: "Nov 2025 → Jan 2026, single engineer.",
    },
    {
      label: "Read path independent of Instagram",
      value: "Yes",
      kind: "qualitative",
      note: "App screens read cached metrics only, so Graph API throttling never reaches the user. No before/after benchmark was captured.",
    },
    {
      label: "Payout runs",
      value: "Idempotent",
      kind: "qualitative",
      note: "Cycles can be safely re-run; ledger entries are keyed to prevent double credits.",
    },
    // NEEDS INPUT: ask Himani for real active-creator and campaign counts,
    // then add them here as `measured` with the date the figure was taken.
  ],

  stack: [
    { layer: "Mobile", items: ["React Native", "TypeScript"] },
    { layer: "Web", items: ["React", "TypeScript"] },
    { layer: "Backend", items: ["Node.js", "Express", "Prisma"] },
    { layer: "Data", items: ["PostgreSQL (AWS RDS)", "Redis"] },
    { layer: "Infra", items: ["AWS EC2", "Docker", "cron workers"] },
    { layer: "Integrations", items: ["Instagram Graph API", "Phone OTP"] },
  ],

  testimonial: {
    quote:
      "Jayesh took Rizzl from concept to launch by building our complete full-stack mobile app, brand portal, and admin panel from scratch. His backend architecture, payout calculations, and AWS setup are highly scalable, and his speed of execution is incredible.",
    author: "Himani Bindal",
    role: "Founder, Rizzl",
  },

  links: [
    { label: "Live site", href: "https://rizzl.in" },
    {
      label: "Product walkthrough",
      href: "https://drive.google.com/file/d/1S-MJOHn43l_k7j9-wWl4M-EO_Spn6iba/view?usp=sharing",
    },
  ],

  shot: "/rizzl.png",
};
