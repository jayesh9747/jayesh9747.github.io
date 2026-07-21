"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { ProjectShot } from "./ProjectShot";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

const statusStyle: Record<CaseStudy["status"], string> = {
  SHIPPED: "text-ok border-ok/30 bg-ok/10",
  SCALING: "text-warn border-warn/30 bg-warn/10",
  IN_PROGRESS: "text-accent-2 border-accent-2/30 bg-accent-2/10",
};

export function SelectedWork() {
  return (
    <Section id="work">
      <SectionHeading
        index="01"
        kicker="Selected Work"
        title="Two products I was paid to ship."
        description="Full write-ups — the problem, the architecture, the decisions and what each one cost me. Not screenshots."
      />

      <RevealGroup className="grid gap-5">
        {caseStudies.map((study) =>
          study.locked ? (
            <LockedCard key={study.slug} study={study} />
          ) : (
            <StudyCard key={study.slug} study={study} />
          ),
        )}
      </RevealGroup>
    </Section>
  );
}

function StudyCard({ study }: { study: CaseStudy }) {
  return (
    <motion.div variants={revealItem}>
      <Link
        href={`/work/${study.slug}`}
        data-cursor="hover"
        data-cursor-label="read"
        className="group relative grid overflow-hidden rounded-[var(--radius-lg)] border border-line bg-panel/60 backdrop-blur-xl transition-colors hover:border-accent/40 md:grid-cols-[1fr_1.1fr]"
      >
        <div className="relative min-h-[200px] md:min-h-[260px]">
          <ProjectShot
            shot={study.shot}
            accent={study.accent}
            name={study.name}
            className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        <div className="relative flex flex-col p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
                statusStyle[study.status],
              )}
            >
              {study.status.replace("_", " ")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {study.role} · {study.year}
            </span>
          </div>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
            {study.name}
          </h3>
          <p className="mt-3 text-pretty leading-relaxed text-ink-dim">
            {study.hook}
          </p>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
            <div className="flex flex-wrap gap-1.5">
              {/* A tool can appear in more than one layer (TypeScript is both
                  mobile and web on Rizzl) — dedupe before rendering. */}
              {Array.from(new Set(study.stack.flatMap((s) => s.items)))
                .slice(0, 5)
                .map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-line bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-ink-dim"
                  >
                    {s}
                  </span>
                ))}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-ink-dim transition-colors group-hover:text-accent-2">
              Read the case study
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function LockedCard({ study }: { study: CaseStudy }) {
  return (
    <motion.div
      variants={revealItem}
      className="relative grid overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-line bg-panel/30 md:grid-cols-[1fr_1.1fr]"
    >
      <div className="relative min-h-[140px] overflow-hidden md:min-h-[180px]">
        <div
          className="absolute inset-0 opacity-40 blur-sm"
          style={{
            background: `radial-gradient(120% 140% at 20% 0%, ${study.accent}33, transparent 60%)`,
          }}
        />
        <div className="grid-bg absolute inset-0 opacity-20" />
        <div className="absolute inset-0 grid place-items-center">
          <Lock className="size-6 text-ink-faint" />
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
              statusStyle[study.status],
            )}
          >
            {study.status.replace("_", " ")}
          </span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink-dim">
          {study.name}
        </h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-faint">
          {study.hook}
        </p>
        {study.lockedNote && (
          <p className="mt-4 font-mono text-[11px] text-ink-faint">
            ↳ {study.lockedNote}
          </p>
        )}
      </div>
    </motion.div>
  );
}
