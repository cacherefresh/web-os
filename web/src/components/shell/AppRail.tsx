"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppScreen } from "@/data/apps";
import { siteConfig } from "@/config/site";
import { AppList } from "./AppList";
import { RailTab } from "./RailTab";

export interface AppRailProps {
  apps: AppScreen[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: number | null;
  onSelect: (slot: number) => void;
  onHome: () => void;
  onAbout: () => void;
}

/**
 * The left rail: a few-pixel translucent sliver that expands into the app
 * drawer on touch/click, and collapses back to the sliver once an app is
 * picked. Home and About live here — this replaced the purple top bar, so the
 * app frame gets the full height of the phone viewport.
 */
export function AppRail({
  apps,
  open,
  onOpenChange,
  selectedSlot,
  onSelect,
  onHome,
  onAbout,
}: AppRailProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (slot: number) => {
    onSelect(slot);
    onOpenChange(false);
  };

  return (
    <>
      <RailTab onOpen={() => onOpenChange(true)} hidden={open} />

      <AnimatePresence>
        {open && (
          <>
            {/* Scrim: dismisses on outside tap and separates the drawer from
                whatever (scene or app frame) is behind it. */}
            <motion.div
              key="rail-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
              className="pointer-events-auto absolute inset-0 z-30 bg-black/50 backdrop-blur-[2px]"
            />

            <motion.aside
              key="rail-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto absolute inset-y-0 left-0 z-40 flex w-[19rem] max-w-[85%] flex-col border-r border-white/15 bg-[#0a0e1a]/75 backdrop-blur-xl"
            >
              <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold tracking-[0.2em] text-white">
                    {siteConfig.name}
                  </span>
                  <span className="truncate text-[9px] uppercase tracking-[0.18em] text-white/40">
                    {siteConfig.domain}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onHome();
                    onOpenChange(false);
                  }}
                  className="rounded-md border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Home
                </button>
              </header>

              <AppList apps={apps} selectedSlot={selectedSlot} onSelect={handleSelect} />

              <footer className="flex items-center justify-between border-t border-white/10 px-4 py-2.5">
                <button
                  type="button"
                  onClick={onAbout}
                  className="text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
                >
                  About
                </button>
                <button
                  type="button"
                  aria-label="Close app rail"
                  onClick={() => onOpenChange(false)}
                  className="text-[10px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white"
                >
                  Close
                </button>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
