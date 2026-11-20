"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AppScreen } from "@/data/apps";
import { AppPreviewFrame } from "./AppPreviewFrame";

export interface AppFrameProps {
  app: AppScreen | null;
  onClose: () => void;
}

/**
 * The main viewport: the selected app, loaded live and interactive, inside a
 * holographic bezel. Sits above the 3D scene (which dims back behind it) and
 * clears the rail sliver on the left so the rail is always reachable.
 */
export function AppFrame({ app, onClose }: AppFrameProps) {
  return (
    <AnimatePresence>
      {app && (
        <motion.section
          key={app.id}
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute inset-y-4 left-6 right-3 z-20 flex flex-col overflow-hidden rounded-2xl border backdrop-blur-sm"
          style={{
            borderColor: `${app.accent}66`,
            backgroundColor: "#040611cc",
            boxShadow: `0 0 40px -12px ${app.accent}99, inset 0 0 60px -40px ${app.accent}`,
          }}
        >
          <header
            className="flex shrink-0 items-center gap-2 border-b px-3 py-2"
            style={{ borderColor: `${app.accent}33`, backgroundColor: `${app.accent}14` }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: `${app.accent}30`, border: `1px solid ${app.accent}80` }}
            >
              {app.faviconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.faviconUrl} alt="" className="h-4 w-4 object-contain" />
              ) : (
                (app.name ?? "?").slice(0, 1).toUpperCase()
              )}
            </span>

            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[12px] font-semibold text-white">{app.name}</span>
              <span className="truncate text-[9px] uppercase tracking-[0.16em] text-white/40">
                {app.repo}
              </span>
            </span>

            <span className="ml-auto flex shrink-0 items-center gap-1">
              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${app.name} in a new tab`}
                  className="rounded px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ↗
                </a>
              )}
              <button
                type="button"
                aria-label="Close app"
                onClick={onClose}
                className="rounded px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </span>
          </header>

          <AppPreviewFrame app={app} live interactive fit="native" className="min-h-0 flex-1" />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
