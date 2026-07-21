import { experience, labProjects, profile, services, stackBands } from "./data";
import { caseStudies } from "./case-studies";

/* ============================================================
   Local retrieval over the portfolio's own data. No API key,
   runs entirely client side. Powers "ask" mode in the ⌘K palette.

   Every answer is BUILT from the data files — there is no prose
   duplicated here. That was the old bug: the services list existed
   verbatim in both the terminal and this file and had already
   started to drift.
   ============================================================ */

export type Source = { label: string; href: string };

export type Answer = { text: string; sources: Source[] };

type Doc = {
  id: string;
  keywords: string[];
  label: string;
  href: string;
  build: () => string;
};

const docs: Doc[] = [
  {
    id: "intro",
    label: "About",
    href: "#hero",
    keywords: ["who", "about", "intro", "yourself", "jayesh", "bio"],
    build: () =>
      `${profile.name} is a ${profile.role}. ${profile.tagline} Based in ${profile.location}. ${profile.availability}.`,
  },
  {
    id: "services",
    label: "Working together",
    href: "#contact",
    keywords: ["service", "services", "offer", "hire", "help", "build", "mvp", "startup", "freelance", "contract", "rate", "engage"],
    build: () =>
      `${profile.availability}. What he takes on: ${services
        .map((s) => `${s.title} — ${s.detail}`)
        .join(" ")}`,
  },
  {
    id: "work",
    label: "Selected work",
    href: "#work",
    keywords: ["case", "study", "studies", "client", "clients", "work", "shipped", "portfolio", "paid", "freelance"],
    build: () =>
      `Client case studies: ${caseStudies
        .filter((c) => !c.locked)
        .map((c) => `${c.name} (${c.role}, ${c.year}) — ${c.hook}`)
        .join(" ")} Read the full write-ups under Selected Work.`,
  },
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
    keywords: ["experience", "career", "job", "jobs", "history", "background", "worked", "intern", "years", "cncf", "kmesh"],
    build: () =>
      `${profile.yearsExperience}+ years. ${experience
        .map((r) => `${r.range}: ${r.title} at ${r.org}`)
        .join("; ")}.`,
  },
  {
    id: "stack",
    label: "Stack",
    href: "#experience",
    keywords: ["skill", "skills", "stack", "tech", "tools", "languages", "know", "technologies", "kubernetes", "go", "python", "react", "node"],
    build: () =>
      stackBands.map((b) => `${b.layer}: ${b.items.join(", ")}`).join(" · "),
  },
  {
    id: "ai",
    label: "AI work",
    href: "#lab",
    keywords: ["ai", "agent", "agents", "agentic", "llm", "langchain", "mcp", "rag", "gemini", "model", "openai", "native"],
    build: () => {
      const ai = stackBands.find((b) => b.layer === "AI");
      return `On the AI side: ${ai?.items.join(", ")}. In practice — a LangChain agent handling booking and dispatch in QwikAid, an MCP service at Tarana Wireless that automates Jira/Zephyr ticketing (Dockerized on EC2), and Gemini-assisted route planning in Transpectra.`;
    },
  },
  {
    id: "lab",
    label: "Lab & open source",
    href: "#lab",
    keywords: ["open", "source", "oss", "github", "side", "project", "projects", "lab", "gitflip", "maintainer"],
    build: () =>
      labProjects.map((p) => `${p.name} — ${p.blurb}`).join(" "),
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    keywords: ["contact", "email", "mail", "reach", "touch", "available", "availability", "talk", "connect", "linkedin", "phone", "call", "meet", "hire"],
    build: () =>
      `${profile.availability}. Email ${profile.email} or call ${profile.phone}. Also on ${profile.socials
        .map((s) => s.label)
        .join(", ")}.`,
  },
];

// Per-study docs so "tell me about Rizzl" works.
for (const study of caseStudies) {
  if (study.locked) continue;
  docs.push({
    id: `study-${study.slug}`,
    label: study.name,
    href: `/work/${study.slug}/`,
    keywords: [
      study.slug,
      study.name.toLowerCase(),
      ...study.stack.flatMap((s) => s.items.map((i) => i.toLowerCase())),
    ],
    build: () =>
      `${study.name} — ${study.hook} Role: ${study.role}, ${study.duration}. ${study.problem}`,
  });
}

/**
 * Question words carry no signal but used to dominate scoring — "what AI work
 * have you done" matched the About doc on "you" and never reached the AI doc.
 */
const STOPWORDS = new Set([
  "what", "whats", "which", "how", "why", "when", "where", "does", "did", "do",
  "done", "have", "has", "had", "you", "your", "yours", "youve", "me", "my",
  "the", "a", "an", "and", "or", "of", "for", "to", "in", "on", "is", "are",
  "was", "were", "be", "been", "with", "any", "some", "can", "could", "would",
  "tell", "show", "give", "about",
]);

function score(query: string, doc: Doc) {
  const q = query.toLowerCase();
  const tokens = q
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !STOPWORDS.has(t));
  let s = 0;
  for (const kw of doc.keywords) {
    // Substring credit only for keywords distinctive enough to mean something.
    if (kw.length > 3 && q.includes(kw)) s += kw.length > 4 ? 3 : 2;
    for (const t of tokens) {
      if (t === kw) s += 4;
      else if (kw.includes(t) && t.length > 3) s += 1;
    }
  }
  return s;
}

export const suggestedQuestions = [
  "What have you built for clients?",
  "What AI work have you done?",
  "What's your stack?",
  "Are you available for freelance?",
];

export function answer(query: string): Answer {
  const q = query.trim();
  if (!q) {
    return {
      text: `Ask about the case studies, the stack, the AI work, or availability.`,
      sources: [],
    };
  }

  const ranked = docs
    .map((d) => ({ d, s: score(q, d) }))
    .sort((a, b) => b.s - a.s);

  const top = ranked[0];
  if (!top || top.s === 0) {
    return {
      text: `I only know this portfolio. Try: "${suggestedQuestions[0]}"`,
      sources: [],
    };
  }

  const picks = ranked.filter((r) => r.s >= Math.max(2, top.s * 0.6)).slice(0, 2);
  return {
    text: picks.map((p) => p.d.build()).join("\n\n"),
    sources: picks.map((p) => ({ label: p.d.label, href: p.d.href })),
  };
}
