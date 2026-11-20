"use client";

import { useEffect, useRef, useState } from "react";
import type { AppScreen } from "@/data/apps";
import { AppListItem } from "./AppListItem";

export interface AppListProps {
  apps: AppScreen[];
  selectedSlot: number | null;
  onSelect: (slot: number) => void;
}

/**
 * The vertical carousel of all 9 slots.
 *
 * Owns which row is "live" — deliberately kept local rather than lifted to the
 * shell, because it changes on every scroll tick and hoisting it would
 * re-render the R3F `<Canvas>` subtree throughout a drag.
 *
 * Exactly one iframe is mounted at a time: the row nearest the scroll centre,
 * or the hovered row if there is one. Nine concurrent embeds — several of them
 * WebGL sites — would stutter the scroll badly on a phone.
 */
export function AppList({ apps, selectedSlot, onSelect }: AppListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centeredSlot, setCenteredSlot] = useState<number | null>(
    () => apps.find((a) => a.status === "active")?.slot ?? null,
  );
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    // Only active rows compete for the live frame. An empty slot has nothing to
    // embed, so letting one win the "centred" contest would blank the preview
    // for as long as it stayed centred. Link slots (Cash App) can't be framed
    // either, so they sit out too.
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-slot][data-active="true"]'));
    if (items.length === 0) return;

    // Ratios accumulate across callbacks — an entry only fires when *that*
    // element's visibility changes, so the winner has to be picked against the
    // last known state of every row, not just the ones in this batch.
    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slot = Number(entry.target.getAttribute("data-slot"));
          ratios.set(slot, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best: number | null = null;
        let bestRatio = 0;
        for (const [slot, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = slot;
          }
        }
        if (best !== null) setCenteredSlot(best);
      },
      {
        root,
        // Squeeze the observation area down to a band across the middle of the
        // drawer, so "most visible" means "closest to centre".
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [apps]);

  const liveSlot = hoveredSlot ?? centeredSlot;

  return (
    <div
      ref={scrollRef}
      className="webos-scroll min-h-0 flex-1 snap-y snap-proximity overflow-y-auto overscroll-contain px-3 py-2"
    >
      <ul className="flex flex-col gap-2.5">
        {apps.map((app) => (
          <li
            key={app.id}
            data-slot={app.slot}
            data-active={app.status === "active" && app.kind === "app"}
            className="snap-center"
          >
            <AppListItem
              app={app}
              live={app.slot === liveSlot}
              selected={app.slot === selectedSlot}
              onSelect={onSelect}
              onHover={setHoveredSlot}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
