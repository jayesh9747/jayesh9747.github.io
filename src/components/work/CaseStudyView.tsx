"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleAlert,
  GitFork,
  Layers,
  Quote,
  Wrench,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ProjectShot } from "@/components/sections/ProjectShot";
import { ArchDiagram } from "./ArchDiagram";
import { outcomeKindLabel, type CaseStudy } from "@/lib/case-studies";
import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusStyle: Record<CaseStudy["status"], string> = {
  SHIPPED: "text-ok border-ok/30 bg-ok/10",
  SCALING: "text-warn border-warn/30 bg-warn/10",
  IN_PROGRESS: "text-accent-2 border-accent-2/30 bg-accent-2/10",
};

function Heading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
      <Icon className="size-4" />
      {children}
    </h2>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </div>
      <div className="mt-1 text-sm text-ink">{value}</div>
    </div>
  );
}

export function CaseStudyView({ study }: { study: CaseStudy }) {
  return (
    <article className="pb-40 pt-20">
      {/* ---- header ---- */}
      <header className="relative overflow-hidden border-b border-line/60">
        <div className="absolute inset-0 -z-10">
          <ProjectShot
            shot={study.shot}
            accent={study.accent}
            name={study.name}
            className="size-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/90 to-void/60" />
        </div>

        <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-10 sm:px-8">
          <Link
            href="/"
            data-cursor="hover"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            back
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
                statusStyle[study.status],
              )}
            >
              {study.status.replace("_", " ")}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              {study.year}
            </span>
          </div>

          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-gradient md:text-6xl">
            {study.name}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-dim">
            {study.hook}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line/60 pt-6 sm:grid-cols-4">
            <Meta label="Client" value={study.client} />
            <Meta label="Role" value={study.role} />
            <Meta label="Duration" value={study.duration} />
            <Meta label="Team" value={study.teamSize} />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl space-y-20 px-5 pt-20 sm:px-8">
        {/* ---- context ---- */}
        <Reveal>
          <section>
            <Heading icon={CircleAlert}>The problem</Heading>
            {study.clientContext && (
              <p className="mb-5 text-pretty leading-relaxed text-ink-dim">
                {study.clientContext}
              </p>
            )}
            <p className="text-pretty text-lg leading-relaxed text-ink">
              {study.problem}
            </p>
            {study.brief && (
              <div className="mt-6 rounded-[var(--radius-md)] border-l-2 border-accent/50 bg-white/[0.02] py-3 pl-5 pr-4">
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  the brief
                </div>
                <p className="text-pretty leading-relaxed text-ink-dim">
                  {study.brief}
                </p>
              </div>
            )}
            {study.constraints.length > 0 && (
              <ul className="mt-6 grid gap-2.5">
                {study.constraints.map((c) => (
                  <li key={c} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-warn" />
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>

        {/* ---- deliverables ---- */}
        {study.deliverables.length > 0 && (
          <Reveal>
            <section>
              <Heading icon={Layers}>What I built</Heading>
              <div className="grid gap-3 sm:grid-cols-2">
                {study.deliverables.map((d) => (
                  <div
                    key={d.title}
                    className="rounded-[var(--radius-md)] border border-line bg-white/[0.02] p-5"
                  >
                    <div className="font-medium text-ink">{d.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-faint">
                      {d.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ---- architecture ---- */}
        {study.architecture.nodes.length > 0 && (
          <Reveal>
            <section>
              <Heading icon={Layers}>How it&apos;s built</Heading>
              <ArchDiagram
                summary={study.architecture.summary}
                nodes={study.architecture.nodes}
                edges={study.architecture.edges}
              />
            </section>
          </Reveal>
        )}

        {/* ---- decisions ---- */}
        {study.decisions.length > 0 && (
          <Reveal>
            <section>
              <Heading icon={GitFork}>Decisions & trade-offs</Heading>
              <div className="space-y-4">
                {study.decisions.map((d) => (
                  <div
                    key={d.title}
                    className="rounded-[var(--radius-md)] border border-line bg-white/[0.02] p-6"
                  >
                    <h3 className="text-lg font-medium text-ink">{d.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                      {d.context}
                    </p>

                    {d.options.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {d.options.map((o) => {
                          const picked = o
                            .toLowerCase()
                            .includes(d.chose.toLowerCase().split(" ")[0]);
                          return (
                            <li
                              key={o}
                              className={cn(
                                "flex gap-2.5 font-mono text-[12px] leading-relaxed",
                                picked ? "text-ink" : "text-ink-faint",
                              )}
                            >
                              <span className={picked ? "text-ok" : "text-ink-faint"}>
                                {picked ? "▸" : "·"}
                              </span>
                              {o}
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <p className="mt-4 text-sm leading-relaxed text-ink-dim">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-2">
                        chose{" "}
                      </span>
                      {d.chose} — {d.why}
                    </p>

                    <div className="mt-4 rounded-[var(--radius-sm)] border-l-2 border-warn/50 bg-warn/[0.04] py-2.5 pl-4 pr-3">
                      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warn">
                        what it cost
                      </div>
                      <p className="text-sm leading-relaxed text-ink-dim">
                        {d.tradeoff}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ---- hard problems ---- */}
        {study.hardProblems.filter((p) => p.solution).length > 0 && (
          <Reveal>
            <section>
              <Heading icon={Wrench}>Hard problems</Heading>
              <div className="space-y-4">
                {study.hardProblems
                  .filter((p) => p.solution)
                  .map((p) => (
                    <div
                      key={p.title}
                      className="rounded-[var(--radius-md)] border border-line bg-white/[0.02] p-6"
                    >
                      <h3 className="text-lg font-medium text-ink">{p.title}</h3>
                      <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                        {[
                          ["symptom", p.problem],
                          ["diagnosis", p.diagnosis],
                          ["fix", p.solution],
                        ]
                          .filter(([, body]) => body)
                          .map(([label, body]) => (
                            <div key={label} className="grid gap-1 sm:grid-cols-[88px_1fr] sm:gap-4">
                              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:pt-1">
                                {label}
                              </dt>
                              <dd className="text-ink-dim">{body}</dd>
                            </div>
                          ))}
                      </dl>
                      {p.evidence && (
                        <p className="mt-4 font-mono text-[11px] text-ink-faint">
                          ↳ {p.evidence}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ---- outcomes ---- */}
        {study.outcomes.length > 0 && (
          <Reveal>
            <section>
              <Heading icon={ArrowUpRight}>Outcomes</Heading>
              <div className="grid gap-3 sm:grid-cols-2">
                {study.outcomes.map((o) => (
                  <div
                    key={o.label}
                    className="rounded-[var(--radius-md)] border border-line bg-white/[0.02] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xl font-semibold text-gradient-accent">
                        {o.value}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                          o.kind === "measured"
                            ? "border-ok/30 bg-ok/10 text-ok"
                            : "border-line text-ink-faint",
                        )}
                        title="How solid is this number?"
                      >
                        {outcomeKindLabel[o.kind]}
                      </span>
                    </div>
                    <div className="mt-1.5 text-sm text-ink">{o.label}</div>
                    {o.note && (
                      <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                        {o.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-faint">
                Every figure is tagged with how it was arrived at. Nothing here is
                an estimate dressed up as a measurement.
              </p>
            </section>
          </Reveal>
        )}

        {/* ---- stack ---- */}
        {study.stack.length > 0 && (
          <Reveal>
            <section>
              <Heading icon={Layers}>Stack</Heading>
              <div className="space-y-3">
                {study.stack.map((band) => (
                  <div
                    key={band.layer}
                    className="grid gap-2 sm:grid-cols-[120px_1fr] sm:gap-4"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:pt-1.5">
                      {band.layer}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {band.items.map((i) => (
                        <span
                          key={i}
                          className="rounded-md border border-line bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-ink-dim"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ---- testimonial ---- */}
        {study.testimonial && (
          <Reveal>
            <blockquote className="glass relative overflow-hidden rounded-[var(--radius-lg)] p-8">
              <Quote className="absolute right-6 top-6 size-10 rotate-180 text-accent/10" />
              <p className="relative text-pretty text-lg italic leading-relaxed text-ink">
                &ldquo;{study.testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-line/60 pt-5 text-sm">
                <div className="font-medium text-ink">
                  {study.testimonial.author}
                </div>
                <div className="mt-0.5 text-xs text-ink-faint">
                  {study.testimonial.role}
                </div>
              </footer>
            </blockquote>
          </Reveal>
        )}

        {/* ---- CTA ---- */}
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-[var(--radius-lg)] border border-line bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-medium text-ink">
                Building something like this?
              </div>
              <p className="mt-1 text-sm text-ink-dim">
                {profile.availability}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {study.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  <MagneticButton variant="outline">
                    {l.label}
                    <ArrowUpRight className="size-4" />
                  </MagneticButton>
                </a>
              ))}
              <a href={`mailto:${profile.email}`}>
                <MagneticButton variant="primary">Get in touch</MagneticButton>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
