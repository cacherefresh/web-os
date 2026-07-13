"use client";

import { useState } from "react";
import type { AppScreen } from "@/data/apps";

interface AppDrawerProps {
  side: "left" | "right";
  apps: AppScreen[];
  /** "hover" reveals itself on mouse-enter (desktop-friendly edge peek).
   *  "controlled" is driven entirely by `open`/`onOpenChange` (e.g. a menu button tap). */
  mode: "hover" | "controlled";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function AppRow({ app }: { app: AppScreen }) {
  const isActive = app.status === "active";

  return (
    <button
      type="button"
      disabled={!isActive}
      onClick={() => {
        if (isActive && app.url) window.open(app.url, "_blank", "noopener,noreferrer");
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors enabled:hover:bg-white/5 disabled:opacity-40"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md text-xs font-bold text-white"
        style={{ backgroundColor: `${app.accent}33`, border: `1px solid ${app.accent}88` }}
      >
        {isActive && app.faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.faviconUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          (app.name ?? "+").slice(0, 1).toUpperCase()
        )}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-white">
          {app.name ?? `Empty slot ${app.slot}`}
        </span>
        <span className="truncate text-[11px] uppercase tracking-wide text-white/40">
          {isActive ? app.repo : "unassigned"}
        </span>
      </span>
    </button>
  );
}

export function AppDrawer({ side, apps, mode, open: controlledOpen, onOpenChange }: AppDrawerProps) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const open = mode === "hover" ? hoverOpen : (controlledOpen ?? false);

  const setOpen = (next: boolean) => {
    if (mode === "hover") setHoverOpen(next);
    else onOpenChange?.(next);
  };

  const hoverHandlers =
    mode === "hover"
      ? { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) }
      : {};

  const edgeClass = side === "left" ? "left-0" : "right-0";
  const translateClosed = side === "left" ? "-translate-x-full" : "translate-x-full";
  const borderClass = side === "left" ? "border-r" : "border-l";
  const tabRadiusClass = side === "left" ? "rounded-r-md" : "rounded-l-md";

  return (
    // Purely a positioning container — it does not itself need to catch events,
    // each interactive child below sets its own pointer-events-auto.
    <div className={`pointer-events-none absolute inset-y-0 ${edgeClass} z-30`}>
      {mode === "hover" && (
        <div
          className={`pointer-events-auto absolute top-1/2 ${edgeClass} h-24 w-3 -translate-y-1/2 ${tabRadiusClass} bg-purple-500/30`}
          {...hoverHandlers}
        />
      )}

      <div
        className={`pointer-events-auto absolute inset-y-0 ${edgeClass} flex w-64 flex-col gap-1 border-purple-400/20 bg-[#0a0e1aee] p-3 pt-16 backdrop-blur-md transition-transform duration-300 ease-out ${borderClass} ${
          open ? "translate-x-0" : translateClosed
        }`}
        {...hoverHandlers}
      >
        <div className="mb-1 flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Apps</span>
          {mode === "controlled" && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close app list"
              className="text-white/50 transition-colors hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        {apps.map((app) => (
          <AppRow key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
