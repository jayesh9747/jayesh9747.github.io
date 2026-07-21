"use client";

import { motion } from "framer-motion";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { proofs } from "@/lib/data";

/**
 * Credential strip directly under the hero. No section heading — this is
 * meant to be scanned in two seconds on the way down, not read.
 */
export function Proof() {
  return (
    <section id="proof" className="relative border-y border-line/50 py-8">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <RevealGroup
          className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4"
          stagger={0.06}
        >
          {proofs.map((p) => {
            const body = (
              <>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {p.detail}
                </div>
                <div className="mt-1 text-sm font-medium text-ink">{p.label}</div>
              </>
            );
            return (
              <motion.div key={p.label} variants={revealItem}>
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="block transition-opacity hover:opacity-70"
                  >
                    {body}
                  </a>
                ) : (
                  body
                )}
              </motion.div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
