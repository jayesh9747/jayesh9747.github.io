"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { archKindColor, type ArchEdge, type ArchNode } from "@/lib/case-studies";

const COLS = 5;

function pos(node: ArchNode) {
  return {
    x: 8 + (node.col / (COLS - 1)) * 84, // 8%..92%
    y: 12 + (node.row - 1) * 24,
  };
}

/**
 * Interactive system diagram for a single case study. Unlike the old generic
 * "reference architecture", every node here is a real component of the project
 * being described — hovering one traces what it actually talks to.
 */
export function ArchDiagram({
  summary,
  nodes,
  edges,
}: {
  summary: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const activeId = hovered ?? pinned;

  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n) => (map[n.id] = pos(n)));
    return map;
  }, [nodes]);

  const connected = useMemo(() => {
    if (!activeId) return null;
    const set = new Set<string>([activeId]);
    edges.forEach((e) => {
      if (e.from === activeId) set.add(e.to);
      if (e.to === activeId) set.add(e.from);
    });
    return set;
  }, [activeId, edges]);

  const detail = nodes.find((n) => n.id === activeId) ?? null;

  if (!nodes.length) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="glass relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] md:aspect-[16/10]">
        <div className="grid-bg absolute inset-0 opacity-30" />

        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map((e, i) => {
            const a = positions[e.from];
            const b = positions[e.to];
            if (!a || !b) return null;
            const active = activeId && (e.from === activeId || e.to === activeId);
            const midX = (a.x + b.x) / 2;
            return (
              <motion.path
                key={`${e.from}-${e.to}-${i}`}
                d={`M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`}
                fill="none"
                stroke={active ? "#56e1c7" : "#2a2e44"}
                strokeWidth={active ? 0.7 : 0.4}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.05 }}
                style={{ filter: active ? "drop-shadow(0 0 4px #56e1c7)" : "none" }}
              />
            );
          })}
        </svg>

        {nodes.map((n) => {
          const p = positions[n.id];
          const color = archKindColor[n.kind];
          const dim = connected ? !connected.has(n.id) : false;
          const isActive = activeId === n.id;
          return (
            <button
              key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned(pinned === n.id ? null : n.id)}
              data-cursor="hover"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <motion.span
                animate={{ opacity: dim ? 0.3 : 1, scale: isActive ? 1.06 : 1 }}
                className="block whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-center font-mono text-[10px] backdrop-blur-md md:text-[11px]"
                style={{
                  borderColor: isActive ? color : "var(--color-line)",
                  background: isActive
                    ? `color-mix(in oklab, ${color} 16%, rgba(8,10,18,0.7))`
                    : "rgba(8,10,18,0.65)",
                  color: isActive ? "#fff" : "var(--color-ink-dim)",
                  boxShadow: isActive ? `0 0 24px -6px ${color}` : "none",
                }}
              >
                <span
                  className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                  style={{ background: color }}
                />
                {n.label}
              </motion.span>
            </button>
          );
        })}

        <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">
          hover to trace · click to pin
        </div>
      </div>

      <div className="glass flex min-h-[240px] flex-col rounded-[var(--radius-lg)] p-6">
        <AnimatePresence mode="wait">
          {detail ? (
            <motion.div
              key={detail.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                <span
                  className="size-2 rounded-full"
                  style={{ background: archKindColor[detail.kind] }}
                />
                <span style={{ color: archKindColor[detail.kind] }}>
                  {detail.kind}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-ink">{detail.label}</h3>
              <p className="text-pretty text-sm leading-relaxed text-ink-dim">
                {detail.detail}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-pretty text-sm leading-relaxed text-ink-dim"
            >
              {summary}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
