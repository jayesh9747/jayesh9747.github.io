"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { experience, stackBands } from "@/lib/data";

/**
 * Replaces the old interactive Timeline rail. A hiring manager scanning this
 * wants dates and orgs in one pass, not a hover interaction that reveals one
 * role at a time. Depth lives in the case studies.
 */
export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        index="03"
        kicker="Experience"
        title="Where I've done this before."
        description="Startups, a CNCF project, two government-tech programmes, and a telecom hardware company."
      />

      <RevealGroup className="divide-y divide-line/60 border-y border-line/60">
        {experience.map((role) => (
          <motion.div
            key={role.id}
            variants={revealItem}
            className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8"
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                {role.range}
              </div>
              <div className="mt-1.5 text-sm font-medium text-ink">
                {role.title}
              </div>
              <div className="text-sm text-ink-faint">{role.org}</div>
            </div>

            <div>
              <p className="text-pretty leading-relaxed text-ink-dim">
                {role.summary}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {role.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-line bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-ink-faint"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {role.caseStudy && (
                <Link
                  href={`/work/${role.caseStudy}`}
                  data-cursor="hover"
                  className="group mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-accent-2 transition-colors hover:text-ink"
                >
                  read the case study
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </RevealGroup>

      {/* Stack — flat replacement for the old 3D galaxy. */}
      <div className="mt-14 space-y-4">
        {stackBands.map((band) => (
          <div
            key={band.layer}
            className="grid gap-2 md:grid-cols-[200px_1fr] md:gap-8"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              <span
                className="size-2 rounded-full"
                style={{ background: band.color }}
              />
              {band.layer}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {band.items.map((i) => (
                <span
                  key={i}
                  className="rounded-md border px-2.5 py-1 font-mono text-[11px] text-ink-dim"
                  style={{
                    borderColor: `color-mix(in oklab, ${band.color} 22%, var(--color-line))`,
                    background: `color-mix(in oklab, ${band.color} 6%, transparent)`,
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
