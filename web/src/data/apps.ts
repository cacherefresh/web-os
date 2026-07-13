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
  }));
}
