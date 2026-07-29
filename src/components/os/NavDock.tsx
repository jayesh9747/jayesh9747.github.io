"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Home, Briefcase, FlaskConical, GitBranch, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "./SmoothScroll";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks";

const items = [
  { id: "hero", label: "Home", Icon: Home },
  { id: "work", label: "Work", Icon: Briefcase },
  { id: "lab", label: "Lab", Icon: FlaskConical },
  { id: "experience", label: "Experience", Icon: GitBranch },
  { id: "contact", label: "Contact", Icon: Mail },
];

export function NavDock() {
  const [active, setActive] = useState("hero");
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);
  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  // The dock is a homepage-anchor nav — on a case-study page there's nothing
  // for it to point at, and the page has its own "back" link.
  if (!onHome) return null;

  return (
    <motion.nav
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => !isMobile && mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="glass-strong fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-end gap-1 rounded-2xl px-2.5 py-2"
      aria-label="Section navigation"
    >
      {items.map((item) => (
        <DockItem
          key={item.id}
          {...item}
          active={active === item.id}
          mouseX={mouseX}
          isMobile={isMobile}
        />
      ))}
    </motion.nav>
  );
}

function DockItem({
  id,
  label,
  Icon,
  active,
  mouseX,
  isMobile,
}: {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  mouseX: MotionValue<number>;
  isMobile: boolean;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  // Magnification based on pointer distance (macOS dock effect).
  const distance = useTransform(mouseX, (x) => {
    const el = ref.current;
    if (!el || x === Infinity) return 200;
    const rect = el.getBoundingClientRect();
    return x - (rect.left + rect.width / 2);
  });
  const sizeRaw = useTransform(distance, [-120, 0, 120], [40, 58, 40]);
  const size = useSpring(sizeRaw, { stiffness: 320, damping: 22, mass: 0.3 });

  return (
    <button
      ref={ref}
      onClick={() => scrollToSection(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="hover"
      aria-label={label}
      aria-current={active ? "true" : undefined}
      className="group relative flex flex-col items-center"
    >
      {(hover || (isMobile && active)) && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-9 whitespace-nowrap rounded-md border border-line bg-elevated px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-dim"
        >
          {label}
        </motion.span>
      )}
      <motion.span
        style={isMobile ? undefined : { width: size, height: size }}
        className={cn(
          "grid place-items-center rounded-xl border transition-colors duration-300",
          isMobile ? "size-10" : "",
          active
            ? "border-accent/50 bg-accent/15 text-accent-2"
            : "border-line/70 bg-white/[0.02] text-ink-faint group-hover:text-ink",
        )}
      >
        <Icon className="size-[18px]" />
      </motion.span>
      <span
        className={cn(
          "mt-1 size-1 rounded-full transition-colors",
          active ? "bg-accent-2" : "bg-transparent",
        )}
      />
    </button>
  );
}
