"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Briefcase,
  CornerDownLeft,
  FileText,
  Mail,
  Phone,
  Search,
  Sparkles,
} from "lucide-react";
import { scrollToSection } from "./SmoothScroll";
import { answer, suggestedQuestions, type Source } from "@/lib/knowledge";
import { profile } from "@/lib/data";
import { caseStudies } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

/* ============================================================
   One surface replacing two full sections.

   The old portfolio had a Terminal section and an AI Assistant
   section back to back — same data, same fake-window chrome,
   ~520 lines between them, and neither told a visitor anything
   the page didn't already say. This does both jobs from a
   keyboard shortcut and costs zero scroll.
   ============================================================ */

type Action = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  keywords?: string;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [asking, setAsking] = useState(false);
  const [reply, setReply] = useState<{ text: string; sources: Source[] } | null>(
    null,
  );
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setReply(null);
    setAsking(false);
    setCursor(0);
  }, []);

  const actions = useMemo<Action[]>(() => {
    const go = (id: string) => () => {
      close();
      // Jumping to a homepage anchor only works from the homepage.
      if (window.location.pathname !== "/") router.push(`/#${id}`);
      else scrollToSection(id);
    };

    const studyActions: Action[] = caseStudies
      .filter((c) => !c.locked)
      .map((c) => ({
        id: `study-${c.slug}`,
        label: `${c.name} case study`,
        hint: c.role,
        icon: Briefcase,
        keywords: `${c.slug} client work ${c.stack.flatMap((s) => s.items).join(" ")}`,
        run: () => {
          close();
          router.push(`/work/${c.slug}`);
        },
      }));

    return [
      ...studyActions,
      { id: "work", label: "Selected work", icon: Search, keywords: "case studies clients", run: go("work") },
      { id: "lab", label: "Lab & open source", icon: Sparkles, keywords: "github side projects oss", run: go("lab") },
      { id: "experience", label: "Experience & stack", icon: Search, keywords: "career jobs skills tech", run: go("experience") },
      { id: "contact", label: "Contact", icon: Mail, keywords: "hire email reach", run: go("contact") },
      {
        id: "email",
        label: "Copy email address",
        hint: profile.email,
        icon: Mail,
        keywords: "contact hire reach",
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          close();
        },
      },
      {
        id: "call",
        label: "Call",
        hint: profile.phone,
        icon: Phone,
        keywords: "phone contact",
        run: () => {
          window.location.href = profile.phoneHref;
          close();
        },
      },
      {
        id: "resume",
        label: "Download résumé",
        icon: FileText,
        keywords: "cv pdf",
        run: () => {
          window.open("/Jayesh_Savaliya_9747.pdf", "_blank");
          close();
        },
      },
      ...profile.socials
        .filter((s) => s.href.startsWith("http"))
        .map((s) => ({
          id: `social-${s.label}`,
          label: s.label,
          hint: s.handle,
          icon: ArrowUpRight,
          run: () => {
            window.open(s.href, "_blank");
            close();
          },
        })),
    ];
  }, [close, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      `${a.label} ${a.hint ?? ""} ${a.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [actions, query]);

  /* ---- open / close on ⌘K ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /** Typing changes the result list, so the highlight goes back to the top. */
  function onQueryChange(value: string) {
    setQuery(value);
    setCursor(0);
  }

  function ask(q: string) {
    const text = q.trim();
    if (!text) return;
    setAsking(true);
    setReply(answer(text));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      // No matching command → treat the input as a question.
      if (filtered.length === 0 || asking) ask(query);
      else filtered[cursor]?.run();
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            className="fixed inset-0 z-[160] flex items-start justify-center p-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="fixed inset-0 bg-void/80 backdrop-blur-md"
              onClick={close}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong relative z-10 w-full max-w-xl overflow-hidden rounded-[var(--radius-lg)]"
            >
              {/* input */}
              <div className="flex items-center gap-3 border-b border-line/70 px-4 py-3.5">
                {asking ? (
                  <Bot className="size-4 shrink-0 text-accent-2" />
                ) : (
                  <Search className="size-4 shrink-0 text-ink-faint" />
                )}
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={
                    asking
                      ? `Ask about ${profile.name}…`
                      : "Jump to a section, or ask a question…"
                  }
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                  esc
                </kbd>
              </div>

              <div className="max-h-[52vh] overflow-y-auto" data-lenis-prevent>
                {/* answer */}
                {reply && (
                  <div className="border-b border-line/70 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-dim">
                      {reply.text}
                    </p>
                    {reply.sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {reply.sources.map((s) => (
                          <button
                            key={s.href + s.label}
                            data-cursor="hover"
                            onClick={() => {
                              close();
                              if (s.href.startsWith("#"))
                                scrollToSection(s.href.slice(1));
                              else router.push(s.href);
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-line bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-ink-faint transition-colors hover:text-accent-2"
                          >
                            ↳ {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* commands */}
                {!asking && filtered.length > 0 && (
                  <ul className="p-2">
                    {filtered.map((a, i) => (
                      <li key={a.id}>
                        <button
                          onClick={a.run}
                          onMouseEnter={() => setCursor(i)}
                          data-cursor="hover"
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                            i === cursor ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                          )}
                        >
                          <a.icon
                            className={cn(
                              "size-4 shrink-0",
                              i === cursor ? "text-accent-2" : "text-ink-faint",
                            )}
                          />
                          <span className="flex-1 text-sm text-ink">{a.label}</span>
                          {a.hint && (
                            <span className="font-mono text-[11px] text-ink-faint">
                              {a.hint}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* no command matched → offer to answer it */}
                {!asking && filtered.length === 0 && (
                  <button
                    onClick={() => ask(query)}
                    className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <Sparkles className="size-4 shrink-0 text-accent-2" />
                    <span className="flex-1 text-sm text-ink-dim">
                      Ask &ldquo;{query}&rdquo;
                    </span>
                    <CornerDownLeft className="size-3.5 text-ink-faint" />
                  </button>
                )}

                {/* suggestions */}
                {!reply && (
                  <div className="flex flex-wrap gap-2 border-t border-line/70 p-3">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setQuery(q);
                          ask(q);
                        }}
                        data-cursor="hover"
                        className="rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile affordance — there's no ⌘K on a phone. */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="glass-strong fixed bottom-4 right-4 z-40 grid size-11 place-items-center rounded-xl text-ink-dim transition-colors hover:text-ink md:hidden"
      >
        <Search className="size-[18px]" />
      </button>
    </>
  );
}
