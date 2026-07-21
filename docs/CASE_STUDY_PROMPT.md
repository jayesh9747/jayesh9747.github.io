# Case-study extraction prompt

Run this **inside the project's own repo** (Rizzl repo, Eduteck repo, Sarthi repo)
with Claude Code. It reads the actual code and produces a `CaseStudy` object that
drops straight into `src/lib/case-studies/<slug>.ts` in the portfolio.

Run it once per project. Paste everything between the `---8<---` markers.

---8<---

You are helping me write a **client-facing engineering case study** for my freelance
portfolio. I am the developer who built this codebase. Read the actual repo — do not
guess, do not invent.

## Step 1 — Investigate (do this before writing anything)

Explore and report what you actually find:

1. **Shape**: monorepo or single app? List every deployable (mobile app, web portal,
   admin panel, API, workers, cron jobs). Read `package.json`, `docker-compose*`,
   `Dockerfile`, CI configs, infra-as-code.
2. **Stack**: exact frameworks + versions from lockfiles. Language, runtime, ORM,
   database, cache, queue, auth, hosting.
3. **Data model**: read the schema (`schema.prisma`, migrations, models/). How many
   tables/collections? Name the 5–8 core entities and the interesting relationships.
   Note anything unusual: soft deletes, audit trails, money columns, multi-tenancy.
4. **The hard parts**: find the genuinely non-trivial code. Look for
   - transactions, locks, idempotency keys, retries
   - caching layers and invalidation logic
   - background jobs / cron / queues
   - third-party integrations and their failure handling
   - auth flows, token refresh, encryption
   - anything with a long comment explaining *why*
   Quote the file paths.
5. **AI / agentic surface** (if any): prompts, tool definitions, RAG/embeddings,
   MCP servers, model calls, eval or guardrail code. Be specific about the model,
   the orchestration, and what the agent is actually allowed to do.
6. **Git history**: `git log --oneline | head -60` and `git shortlog -sn`. What was
   the real sequence of work? What did I own vs. others? How long did it run?
7. **Scale evidence**: only from the repo — seed data size, migration row counts,
   rate limits, pagination defaults, load-test scripts, index definitions. Say
   "no evidence in repo" where there is none.

Print this investigation summary first. Then continue.

## Step 2 — Write the case study

Output a single TypeScript object matching this type. Fill every field.

```ts
type CaseStudy = {
  slug: string;                 // "rizzl"
  name: string;
  client: string;               // "Rizzl (rizzl.in)"
  clientContext: string;        // 1 sentence: who they are, why it matters
  status: "SHIPPED" | "SCALING" | "IN_PROGRESS";
  year: string;
  role: string;                 // "Tech Lead — sole engineer"
  duration: string;             // "Nov 2025 — Jan 2026 · 3 months"
  teamSize: string;             // "1 engineer + 1 designer + founder"
  accent: string;               // hex

  // --- the story ---
  hook: string;                 // ONE sentence a non-technical founder understands
  brief: string;                // 2-3 sentences: what the client asked for
  problem: string;              // 3-4 sentences: the BUSINESS problem, not the tech
  constraints: string[];        // budget/timeline/team/compliance/legacy. 3-5 items.

  // --- what I actually delivered ---
  deliverables: { title: string; detail: string }[];  // 3-6. Concrete artifacts.

  // --- how it's built ---
  architecture: {
    summary: string;            // 2-3 sentences, plain English
    nodes: { id: string; label: string; kind: "client"|"edge"|"service"|"ai"|"data"|"queue"; col: number; row: number; detail: string }[];
    edges: { from: string; to: string; label?: string }[];
  };

  // --- the part that proves I can think ---
  decisions: {
    title: string;
    context: string;            // what forced the choice
    options: string[];          // 2-3 real alternatives considered
    chose: string;
    why: string;
    tradeoff: string;           // what this cost me — be honest, this is the credibility
  }[];                          // 3-5 decisions

  hardProblems: {
    title: string;
    problem: string;            // the symptom / the failure mode
    diagnosis: string;          // how I found the cause
    solution: string;           // what I actually did, with the technique named
    evidence?: string;          // file path or measurable result, if it exists
  }[];                          // 2-4 problems

  outcomes: {
    label: string;
    value: string;
    kind: "measured" | "estimated" | "qualitative";   // BE HONEST
    note?: string;
  }[];                          // 3-5

  stack: { layer: string; items: string[] }[];   // Frontend / Backend / Data / Infra / AI

  testimonial?: { quote: string; author: string; role: string };
  links: { label: string; href: string }[];
  shot: string;                 // "/work/<slug>.png"
};
```

## Rules — these matter more than the format

- **No invented numbers.** If the repo doesn't prove it, either omit it or mark it
  `"estimated"` with a `note` saying how it was estimated. A case study with three
  honest numbers beats one with eight fake ones. Never write "reduced load by 80%"
  unless you found the benchmark.
- **No leaked secrets.** Never include API keys, connection strings, internal URLs,
  customer names, real user data, or proprietary business formulas (e.g. the exact
  payout algorithm). Describe the *shape* of the logic, not the logic.
- **Write like an engineer talking to a smart founder.** Short sentences. Concrete
  nouns. Say "creators log in with Instagram" not "orchestrated a secure OAuth
  verification pipeline leveraging the Graph API." Delete every instance of:
  orchestrated, leveraged, robust, seamless, cutting-edge, high-throughput,
  state-of-the-art, holistic, elevate.
- **The `tradeoff` field is required and must be real.** "We chose Postgres and
  gave up the flexibility to change the schema quickly during the first month."
  That sentence is what makes a client trust the rest of the page.
- **`hardProblems` must be things that actually broke or were actually hard.**
  Not "designing a responsive layout." If the repo genuinely has no hard problems,
  say so and pick the most interesting design work instead.
- Architecture `nodes` should be the **real** components in this repo, with real
  names, laid out left→right: `col: 0` = clients, `col: 4` = data stores.

## Step 3 — Flag gaps

After the object, list under `## Needs input from Jayesh` anything only I can answer:
real user counts, revenue impact, client quotes, why a decision was actually made,
screenshots to capture. Keep it to a checklist.

---8<---

## After you run it

1. Save the object to `src/lib/case-studies/<slug>.ts`.
2. Capture screenshots into `public/work/<slug>.png` (~1600×1000).
3. Fill in the "Needs input" gaps by hand — that's the part no tool can write.
4. Get the client to approve anything attributed to them before it goes live.
