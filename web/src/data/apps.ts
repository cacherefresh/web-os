import registry from "@/config/apps.json";

export interface AppScreen {
  slot: number;
  id: string;
  name: string | null;
  repo: string | null;
  url: string | null;
  faviconUrl: string | null;
  accent: string;
  status: "active" | "empty";
  /**
   * `"app"` — an embeddable site, loaded in place in the app frame.
   * `"link"` — a destination that can't be framed (e.g. Cash App sends
   * `X-Frame-Options: DENY`), so selecting it opens `url` in a new tab instead.
   */
  kind: "app" | "link";
  /** Secondary line shown under the name; falls back to `repo`. */
  caption: string | null;
  /** Replaces the drawer row's "Slot N" label when set (shown verbatim, not uppercased). */
  tag: string | null;
}

/** Whether selecting this slot should leave web-os instead of loading in the frame. */
export function isExternalLink(app: AppScreen): boolean {
  return app.kind === "link" && app.status === "active" && Boolean(app.url);
}

/**
 * Opens a link slot. Must be called synchronously inside the click handler —
 * browsers (Safari especially) block `window.open` from a timer as a popup.
 */
export function openExternalLink(app: AppScreen) {
  if (app.url) window.open(app.url, "_blank", "noopener,noreferrer");
}

// One accent per orbit slot, independent of app identity — keeps the ring
// visually distinct even while most slots are still empty.
const ACCENT_PALETTE = [
  "#4fd1ff",
  "#7c8cff",
  "#c084fc",
  "#f5c451",
  "#ff9f5a",
  "#34d399",
  "#f472b6",
  "#60a5fa",
  "#facc15",
];

interface RegistrySlot {
  slot: number;
  name: string | null;
  repo: string | null;
  url: string | null;
  faviconUrl: string | null;
  status: string;
  kind?: string;
  caption?: string | null;
  tag?: string | null;
}

export function getAppScreens(): AppScreen[] {
  const slots = (registry.slots as RegistrySlot[]) ?? [];
  return slots.map((slot, i) => ({
    slot: slot.slot,
    id: slot.repo ?? `slot-${slot.slot}`,
    name: slot.name,
    repo: slot.repo,
    url: slot.url,
    faviconUrl: slot.faviconUrl,
    accent: ACCENT_PALETTE[i % ACCENT_PALETTE.length],
    status: slot.status === "active" ? "active" : "empty",
    kind: slot.kind === "link" ? "link" : "app",
    caption: slot.caption ?? slot.repo,
    tag: slot.tag ?? null,
  }));
}
