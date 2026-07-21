"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { labProjects } from "@/lib/data";

/**
 * Deliberately lighter than SelectedWork — one line each, no modals, no
 * metrics. The visual gap between this and the case studies is the point:
 * it keeps "I built this for fun" separate from "a client paid for this".
 */
export function Lab() {
  return (
    <Section id="lab">
      <SectionHeading
        index="02"
        kicker="Lab & Open Source"
        title="Things I build when nobody's paying."
        description="Side projects, hackathon builds, and the CNCF work. Smaller scope, same engineering."
      />

      <RevealGroup className="divide-y divide-line/60 border-y border-line/60">
        {labProjects.map((p) => (
          <motion.a
            key={p.id}
            variants={revealItem}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="group grid gap-3 py-6 transition-colors md:grid-cols-[220px_1fr_auto] md:items-baseline md:gap-8"
          >
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-medium text-ink transition-colors group-hover:text-accent-2">
                {p.name}
              </h3>
              {p.note && (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                  {p.note}
                </span>
              )}
            </div>

            <div>
              <p className="text-pretty text-sm leading-relaxed text-ink-dim">
                {p.blurb}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-line bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-ink-faint"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <ArrowUpRight className="size-4 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-2" />
          </motion.a>
        ))}
      </RevealGroup>
    </Section>
  );
}
