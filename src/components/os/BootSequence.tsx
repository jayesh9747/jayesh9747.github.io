"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Kept short on purpose. A boot animation is a cost the visitor pays before
 * seeing anything, and a prospective client who bounces during it never sees
 * the portfolio at all. Three lines at this cadence lands around 1.2s.
 */
const STEP_MS = 190;
const START_MS = 300;
const TAIL_MS = 420;

export function BootSequence() {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  // A case-study URL is what gets sent to a client. They should land on the
  // case study, not on a loading animation for a portfolio they didn't ask for.
  const isHome = pathname === "/";
  const [booting, setBooting] = useState(true);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const lines = profile.bootLines;
  const total = lines.length;

  useEffect(() => {
    // Only boot once per session, and only on the homepage.
    if (
      !isHome ||
      (typeof window !== "undefined" && sessionStorage.getItem("os-booted"))
    ) {
      setBooting(false);
      return;
    }
    if (reduced) {
      setBooting(false);
      sessionStorage.setItem("os-booted", "1");
      return;
    }

    document.body.style.overflow = "hidden";

    const stepTimers = lines.map((_, i) =>
      setTimeout(() => setStep(i + 1), START_MS + i * STEP_MS),
    );

    const progStart = START_MS;
    const progDur = total * STEP_MS + TAIL_MS;
    let raf = 0;
    let t0: number | null = null;
    const tick = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min(((t - t0) * 1000) / 1000 - progStart, progDur);
      setProgress(Math.max(0, Math.min(1, p / progDur)));
      if (p < progDur) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const done = setTimeout(
      () => {
        setBooting(false);
        sessionStorage.setItem("os-booted", "1");
        document.body.style.overflow = "";
      },
      START_MS + total * STEP_MS + TAIL_MS,
    );

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(done);
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, isHome]);

  // Rendered out entirely rather than dismissed in an effect, so a deep link
  // never flashes the overlay before the effect gets a chance to run.
  if (!isHome) return null;

  return (
    <AnimatePresence>
      {booting && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-void"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
        >
          {/* scanline + grid ambience */}
          <div className="grid-bg absolute inset-0 opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_50%,#000,transparent)]" />
          <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          <div className="relative w-[min(90vw,420px)] font-mono">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-baseline gap-3"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-ink-faint">
                booting
              </span>
              <span className="text-lg font-semibold tracking-tight text-gradient-accent">
                {profile.os}
              </span>
            </motion.div>

            <ul className="space-y-2.5 text-sm">
              {lines.map((line, i) => {
                const active = step > i;
                return (
                  <li
                    key={line}
                    className="flex items-center gap-3"
                    style={{
                      opacity: active ? 1 : 0.25,
                      transition: "opacity .4s ease",
                    }}
                  >
                    <span
                      className="grid size-4 place-items-center rounded-full border text-[9px]"
                      style={{
                        borderColor: active ? "var(--color-ok)" : "var(--color-line)",
                        color: active ? "var(--color-ok)" : "transparent",
                        background: active
                          ? "color-mix(in oklab, var(--color-ok) 12%, transparent)"
                          : "transparent",
                      }}
                    >
                      ✓
                    </span>
                    <span className={active ? "text-ink" : "text-ink-faint"}>
                      {line}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 h-px w-full overflow-hidden bg-line">
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
                style={{ scaleX: progress, transformOrigin: "left" }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              <span>kernel://{profile.handle}</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>

            {step > total && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center text-sm text-ink-dim"
              >
                Welcome.
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
