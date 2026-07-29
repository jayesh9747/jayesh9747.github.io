"use client";

import { useEffect, useState } from "react";

/** Tailwind-free media query hook (SSR safe). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True on coarse pointers / small screens — used to pick lightweight fallbacks. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 768px), (pointer: coarse)");
}

/** Respects the user's reduced-motion preference. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
