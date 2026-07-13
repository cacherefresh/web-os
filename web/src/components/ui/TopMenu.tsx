"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

interface TopMenuProps {
  onHome: () => void;
  onAbout: () => void;
  onToggleApps: () => void;
  appsOpen: boolean;
}

export function TopMenu({ onHome, onAbout, onToggleApps, appsOpen }: TopMenuProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-auto absolute inset-x-0 top-0 z-40 flex items-center justify-between border-b border-purple-400/30 bg-gradient-to-r from-purple-950/80 via-purple-800/70 to-purple-950/80 px-4 py-3 text-purple-50 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={onHome}
        className="text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:text-purple-200"
      >
        {siteConfig.name}
      </button>

      <div className="flex items-center gap-5 text-xs uppercase tracking-[0.2em]">
        <button type="button" onClick={onHome} className="transition-colors hover:text-white">
          Home
        </button>
        <button type="button" onClick={onAbout} className="transition-colors hover:text-white">
          About
        </button>
        <button
          type="button"
          onClick={onToggleApps}
          aria-expanded={appsOpen}
          aria-label="Toggle app list"
          className="flex h-7 w-7 flex-col items-center justify-center gap-1 rounded border border-purple-300/40 transition-colors hover:border-purple-200 hover:bg-purple-500/20"
        >
          <span className="h-px w-3.5 bg-current" />
          <span className="h-px w-3.5 bg-current" />
          <span className="h-px w-3.5 bg-current" />
        </button>
      </div>
    </motion.nav>
  );
}
