"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { AmbientBackground } from "./AmbientBackground";
import { Cursor } from "./Cursor";
import { BootSequence } from "./BootSequence";
import { TopBar } from "./TopBar";
import { NavDock } from "./NavDock";
import { CommandPalette } from "./CommandPalette";

/** The global operating-system shell that wraps every page. */
export function OSChrome({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <AmbientBackground />
      <Cursor />
      <BootSequence />
      <TopBar />
      <main className="noise relative">{children}</main>
      <NavDock />
      <CommandPalette />
    </SmoothScroll>
  );
}
