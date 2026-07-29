"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Mail, Phone, Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { profile, services, testimonials } from "@/lib/data";

/**
 * Services + social proof + the ask, in one section. These used to be three
 * separate scroll stops saying overlapping things; a client deciding whether
 * to email should see what I do, who vouches for me, and how to reach me
 * without scrolling between them.
 */
export function Closing() {
  const [copied, setCopied] = useState(false);

  function emailMe() {
    navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.location.href = `mailto:${profile.email}`;
  }

  return (
    <Section id="contact" className="pb-32">
      <SectionHeading
        index="04"
        kicker="Working Together"
        title="What you can hand me."
      />

      <RevealGroup className="grid gap-4 md:grid-cols-3">
        {services.map((s) => (
          <motion.div
            key={s.title}
            variants={revealItem}
            className="rounded-[var(--radius-md)] border border-line bg-white/[0.02] p-6"
          >
            <div className="font-medium text-ink">{s.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-faint">
              {s.detail}
            </p>
          </motion.div>
        ))}
      </RevealGroup>

      {/* ---- social proof ---- */}
      <RevealGroup className="mt-6 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <motion.figure
            key={t.author}
            variants={revealItem}
            className="glass group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] p-6"
          >
            <Quote className="pointer-events-none absolute right-4 top-4 size-9 rotate-180 text-accent/10 transition-colors group-hover:text-accent/20" />
            <blockquote className="relative z-10 text-sm leading-relaxed text-ink">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-line/60 pt-5">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold text-white"
                style={{ backgroundColor: t.color }}
                aria-hidden="true"
              >
                {t.avatar}
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">
                  {t.author}
                </span>
                <span className="block text-xs text-ink-faint">{t.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </RevealGroup>

      {/* ---- the ask ---- */}
      <div className="glass-strong relative mt-6 overflow-hidden rounded-[var(--radius-xl)] px-6 py-16 text-center md:px-16 md:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_-20%,rgba(109,139,255,0.16),transparent_55%)]" />
        <div className="grid-bg absolute inset-0 -z-10 opacity-20" />

        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-gradient md:text-5xl">
            Tell me what you&apos;re building.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mt-5 max-w-md text-pretty text-ink-dim">
            {profile.availability}. Email is fastest — I reply to everything
            with a real project behind it.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton variant="primary" onClick={emailMe}>
              {copied ? (
                <>
                  <Check className="size-4 text-[#06070d]" /> Email copied
                </>
              ) : (
                <>
                  <Mail className="size-4" /> {profile.email}
                </>
              )}
            </MagneticButton>
            <MagneticButton
              variant="outline"
              onClick={() => (window.location.href = profile.phoneHref)}
            >
              <Phone className="size-4" />
              {profile.phone}
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {profile.socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                whileHover={{ y: -2 }}
                className="group inline-flex items-center gap-1.5 font-mono text-sm text-ink-faint transition-colors hover:text-ink"
              >
                {s.label}
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>

      <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line/60 pt-8 font-mono text-[11px] text-ink-faint md:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name}. {profile.os}
        </span>
        <span>press ⌘K anywhere</span>
      </footer>
    </Section>
  );
}
