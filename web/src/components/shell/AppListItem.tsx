"use client";

import type { AppScreen } from "@/data/apps";
import { AppPreviewFrame } from "./AppPreviewFrame";

export interface AppListItemProps {
  app: AppScreen;
  /** Whether this row's preview should mount a real iframe (one at a time, list-wide). */
  live: boolean;
  /** This app is the one currently loaded in the main frame. */
  selected: boolean;
  onSelect: (slot: number) => void;
  onHover: (slot: number | null) => void;
}

/**
 * One row of the app carousel: name top-left, icon bottom-left, live preview
 * window on the right. Pure presentation — which row is live and which is
 * selected are both decided by `AppList` / the shell above it.
 */
export function AppListItem({ app, live, selected, onSelect, onHover }: AppListItemProps) {
  const isActive = app.status === "active";

  return (
    <button
      type="button"
      disabled={!isActive}
      aria-current={selected || undefined}
      onClick={() => isActive && onSelect(app.slot)}
      onMouseEnter={() => isActive && onHover(app.slot)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => isActive && onHover(app.slot)}
      onBlur={() => onHover(null)}
      className="group grid w-full grid-cols-[1fr_7rem] items-stretch gap-3 rounded-xl border p-2.5 text-left transition-all duration-200 enabled:hover:bg-white/[0.06] disabled:cursor-default"
      style={{
        // Accent is positional (one per slot, from `data/apps.ts`), so even the
        // empty slots stay visually distinct from one another.
        borderColor: selected ? `${app.accent}aa` : isActive ? `${app.accent}33` : `${app.accent}1f`,
        backgroundColor: selected ? `${app.accent}1a` : "rgba(255,255,255,0.02)",
        boxShadow: selected ? `0 0 18px -4px ${app.accent}66, inset 0 0 24px -12px ${app.accent}` : undefined,
        opacity: isActive ? 1 : 0.45,
      }}
    >
      {/* Left column: name pinned top, icon pinned bottom. */}
      <span className="flex min-w-0 flex-col justify-between py-0.5">
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[13px] font-semibold leading-tight text-white">
            {app.name ?? `Empty slot ${app.slot}`}
          </span>
          <span
            className={`truncate ${
              app.tag ? "font-mono text-[10px]" : "text-[9px] uppercase tracking-[0.18em]"
            }`}
            style={{ color: isActive ? `${app.accent}cc` : "rgba(255,255,255,0.3)" }}
          >
            {isActive ? (app.tag ?? `Slot ${app.slot}`) : "Unassigned"}
          </span>
        </span>

        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[11px] font-bold text-white transition-transform duration-200 group-enabled:group-hover:scale-110"
          style={{ backgroundColor: `${app.accent}26`, border: `1px solid ${app.accent}80` }}
        >
          {isActive && app.faviconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.faviconUrl} alt="" className="h-5 w-5 object-contain" />
          ) : (
            (app.name ?? "+").slice(0, 1).toUpperCase()
          )}
        </span>
      </span>

      {/* Right column: the window into the app itself. */}
      <span
        className="block h-full min-h-[4.5rem] overflow-hidden rounded-md border"
        style={{ borderColor: `${app.accent}4d` }}
      >
        <AppPreviewFrame app={app} live={live && isActive} className="h-full w-full" />
      </span>
    </button>
  );
}
