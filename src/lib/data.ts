/* ============================================================
   Portfolio data — single source of truth for the homepage.

   Client case studies live separately in src/lib/case-studies/.
   Anything here should be a fact about Jayesh, not about a project.
   ============================================================ */

export const profile = {
  name: "Jayesh",
  handle: "jayesh",
  os: "JAYESH.OS",
  role: "Full-Stack & AI Engineer",
  roles: [
    "Full-Stack Engineer",
    "AI & Agentic Systems",
    "Cloud-Native & Kubernetes",
    "CNCF Maintainer",
  ],
  tagline:
    "I build and ship complete products for startups — mobile, web, backend, and the AI that runs inside them. Usually as the only engineer.",
  location: "Pune, India · GMT+5:30",
  email: "jsavaliya.tech@gmail.com",
  phone: "+91 7490811091",
  phoneHref: "tel:+917490811091",
  availability: "Open to freelance & contract work",
  yearsExperience: 2,
  bootLines: [
    "Full-Stack Development",
    "Agentic AI & MCP",
    "Cloud-Native Systems",
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/jayesh9747", handle: "@jayesh9747" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jayesh-savaliya/", handle: "/in/jayesh-savaliya" },
    { label: "Email", href: "mailto:jsavaliya.tech@gmail.com", handle: "jsavaliya.tech@gmail.com" },
  ],
} as const;

/* ---------------------------------------------------------- */
/* Proof strip — the credentials that do the most work         */
/* ---------------------------------------------------------- */

export type Proof = { label: string; detail: string; href?: string };

export const proofs: Proof[] = [
  {
    label: "CNCF Kmesh",
    detail: "Maintainer",
    href: "https://github.com/kmesh-net",
  },
  { label: "ISB-backed startup", detail: "Shipped as tech lead" },
  { label: "Code for GovTech", detail: "Two programmes" },
  { label: "Tarana Wireless", detail: "SDE Intern" },
];

/* ---------------------------------------------------------- */
/* Experience — condensed. Depth lives in the case studies.    */
/* ---------------------------------------------------------- */

export type Role = {
  id: string;
  range: string;
  title: string;
  org: string;
  summary: string;
  stack: string[];
  /** Links this role to a published case study, if one exists. */
  caseStudy?: string;
};

export const experience: Role[] = [
  {
    id: "tarana",
    range: "Nov 2025 — Present",
    title: "SDE Intern",
    org: "Tarana Wireless",
    summary:
      "End-to-end test suites for telemetry microservices, plus an MCP service that automates Jira/Zephyr ticket creation, Dockerized and running on EC2.",
    stack: ["Python", "Playwright", "Pytest", "MCP", "Docker", "Kafka", "InfluxDB"],
  },
  {
    id: "rizzl",
    range: "Nov 2025 — Jan 2026",
    title: "Tech Lead",
    org: "Rizzl",
    summary:
      "Sole engineer on a creator-marketing platform: mobile app, brand portal, admin panel, payout engine, and the AWS infrastructure under all of it.",
    stack: ["React Native", "Express", "Prisma", "PostgreSQL", "Redis", "AWS"],
    caseStudy: "rizzl",
  },
  {
    id: "hcw",
    range: "Jun 2025 — Aug 2025",
    title: "Backend Developer",
    org: "HCW-labsis · Code for GovTech",
    summary:
      "Migrated a telemedicine backend from Express to a modular NestJS architecture and built the WebRTC chat, audio, and video layer.",
    stack: ["NestJS", "Prisma", "PostgreSQL", "WebRTC", "TypeScript"],
  },
  {
    id: "kmesh",
    range: "Mar 2025 — May 2025",
    title: "LFX Mentee → Maintainer",
    org: "Kmesh · CNCF",
    summary:
      "Built the deployment and topology dashboard for an eBPF-based service mesh. Went from mentee to official maintainer on contribution record.",
    stack: ["Go", "Gin", "client-go", "React", "Kubernetes", "Helm"],
  },
  {
    id: "mazinda",
    range: "Dec 2024 — Jan 2025",
    title: "Full-Stack Developer",
    org: "Mazinda",
    summary:
      "Seller onboarding mobile app and a pricing microservice using geospatial queries for location-based rate calculation.",
    stack: ["React Native", "NestJS", "MongoDB", "AWS"],
  },
  {
    id: "shikshalokam",
    range: "Jun 2024 — Aug 2024",
    title: "Backend Developer",
    org: "ShikshaLokam · Code for GovTech",
    summary:
      "High-throughput MongoDB migration scripts with schema transformation, batched async processing, and Redis-backed request caching.",
    stack: ["Node.js", "MongoDB", "Redis"],
  },
];

/* ---------------------------------------------------------- */
/* Lab & open source — one line each, no modals               */
/* ---------------------------------------------------------- */

export type LabProject = {
  id: string;
  name: string;
  blurb: string;
  tags: string[];
  href: string;
  note?: string;
};

export const labProjects: LabProject[] = [
  {
    id: "gitflip",
    name: "GitFlip",
    blurb:
      "A Go CLI that switches Git identity and SSH keys per repo, so work and personal commits stop leaking into each other. Single static binary, no runtime.",
    tags: ["Go", "CLI", "SSH"],
    href: "https://github.com/jayesh9747/gitflip",
  },
  {
    id: "qwikaid",
    name: "QwikAid",
    blurb:
      "Roadside assistance app with a LangChain agent that handles booking and dispatch in conversation, plus live mechanic tracking over Socket.IO.",
    tags: ["LangChain", "Agentic AI", "React Native", "NestJS"],
    href: "https://github.com/jayesh9747/QuickAid",
  },
  {
    id: "kmesh",
    name: "Kmesh Dashboard",
    blurb:
      "Deployment and topology UI for the CNCF eBPF service mesh — Go backend against the Kubernetes API, React frontend for traffic and cluster views.",
    tags: ["Go", "Kubernetes", "CNCF", "eBPF"],
    href: "https://github.com/kmesh-net",
    note: "Maintainer",
  },
  {
    id: "transpectra",
    name: "Transpectra",
    blurb:
      "Supply-chain platform unifying warehouse, transport, and yard management on India's national ULIP logistics APIs, with Gemini-assisted route planning.",
    tags: ["React", "Node.js", "Gemini", "ULIP APIs"],
    href: "https://transpectra.vercel.app/",
    note: "Top 25 · national ULIP hackathon",
  },
];

/* ---------------------------------------------------------- */
/* Stack — grouped, flat, no 3D                               */
/* ---------------------------------------------------------- */

export type StackBand = { layer: string; color: string; items: string[] };

export const stackBands: StackBand[] = [
  {
    layer: "AI",
    color: "#56e1c7",
    items: ["LangChain", "LangGraph", "MCP", "Gemini", "RAG pipelines", "Agentic tools"],
  },
  {
    layer: "Frontend",
    color: "#6d8bff",
    items: ["React", "React Native", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    layer: "Backend",
    color: "#b07bff",
    items: ["Node.js", "Express", "NestJS", "Go", "Python", "REST", "WebRTC"],
  },
  {
    layer: "Data & Infra",
    color: "#ffb86b",
    items: [
      "PostgreSQL",
      "Prisma",
      "MongoDB",
      "Redis",
      "Kafka",
      "Docker",
      "Kubernetes",
      "AWS",
    ],
  },
];

/* ---------------------------------------------------------- */
/* What I take on                                             */
/* ---------------------------------------------------------- */

export type Service = { title: string; detail: string };

export const services: Service[] = [
  {
    title: "MVP from zero",
    detail:
      "Mobile app, web app, backend, and infrastructure — the whole product, shipped to production.",
  },
  {
    title: "AI inside an existing product",
    detail:
      "Agentic workflows, RAG, and MCP integrations wired into software you already run.",
  },
  {
    title: "Backend and infrastructure",
    detail:
      "APIs, data modelling, caching, background jobs, and the AWS setup to run them.",
  },
];

/* ---------------------------------------------------------- */
/* Testimonials                                               */
/* ---------------------------------------------------------- */

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  color: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Jayesh took Rizzl from concept to launch by building our complete full-stack mobile app, brand portal, and admin panel from scratch. His backend architecture, payout calculations, and AWS setup are highly scalable, and his speed of execution is incredible.",
    author: "Himani Bindal",
    role: "Founder, Rizzl",
    avatar: "HB",
    color: "#2563EB",
  },
  {
    quote:
      "Jayesh is an exceptional developer who brings both technical expertise and strategic thinking to the table. His work on Sangam's platform was clean, modular, and delivered on time. Highly recommended for any scaling product.",
    author: "Suhani Dhadphale",
    role: "Founder, Sangam",
    avatar: "SD",
    color: "#7C3AED",
  },
  {
    quote:
      "Jayesh tackled LFX open source with real enthusiasm. When the community lacked website developers, he stepped up and is still active. Thanks to his initiative, he grew into a core contributor and maintainer of the Kmesh website.",
    author: "Zhencheng Lee",
    role: "CNCF Kmesh Maintainer",
    avatar: "ZL",
    color: "#0F766E",
  },
];
