"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { profile } from "@/lib/data";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { scrollToSection } from "@/components/os/SmoothScroll";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

/** Lightweight floating particle field (canvas, GPU-cheap). */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const count = isMobile ? 28 : 64;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(150,170,255,0.5)";
        ctx.fill();
      }
      // connective lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(109,139,255,${(1 - dist / 120) * 0.14})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  return <canvas ref={ref} className="absolute inset-0 size-full opacity-70" />;
}

/** Cycles through role phrases, typing and deleting like a terminal. */
function Typewriter({ phrases }: { phrases: readonly string[] }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return; // static, set below
    const current = phrases[index % phrases.length];

    // Finished typing → hold, then start deleting.
    if (!deleting && shown === current) {
      const hold = setTimeout(() => setDeleting(true), 1900);
      return () => clearTimeout(hold);
    }
    // Finished deleting → advance to next phrase.
    if (deleting && shown === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }
    const t = setTimeout(
      () => {
        setShown(
          deleting
            ? current.slice(0, shown.length - 1)
            : current.slice(0, shown.length + 1),
        );
      },
      deleting ? 34 : 68,
    );
    return () => clearTimeout(t);
  }, [shown, deleting, index, phrases, reduced]);

  return (
    <span className="font-mono text-accent-2">
      {reduced ? phrases[0] : shown}
      <span className="animate-blink">▋</span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="hero"
      ref={ref}
      // pb clears the fixed nav dock so the scroll hint doesn't sit under it
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-28 pt-9"
    >
      <Particles />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-ink-dim"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-ok" />
          {profile.availability}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.2, duration: 1, ease }}
          className="text-balance text-[clamp(2.6rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tight"
        >
          <span className="text-gradient">Hi, I&apos;m {profile.name}.</span>
          <br />
          <span className="text-gradient-accent">I ship whole products.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease }}
          className="mt-7 flex items-center justify-center gap-2 text-base sm:text-lg"
        >
          <span className="text-ink-faint">&gt;</span>
          <Typewriter phrases={profile.roles} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-dim"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            variant="primary"
            onClick={() => scrollToSection("work")}
            data-cursor-label="open"
          >
            <Sparkles className="size-4" />
            Read the case studies
          </MagneticButton>
          <MagneticButton
            variant="outline"
            onClick={() => scrollToSection("contact")}
          >
            Start a project
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-12 flex flex-col items-center gap-2 text-ink-faint"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            press{" "}
            <kbd className="rounded border border-line bg-white/[0.04] px-1.5 py-0.5 text-ink-dim">
              ⌘K
            </kbd>{" "}
            to jump anywhere
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
