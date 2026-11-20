"use client";

import { useState } from "react";
import { isExternalLink, openExternalLink, type AppScreen } from "@/data/apps";
import { SceneClient } from "@/components/scene/SceneClient";
import { AboutModal } from "@/components/ui/AboutModal";
import { AppFrame } from "./AppFrame";
import { AppRail } from "./AppRail";

/**
 * Owner of the shell's cross-cutting state, and the only place the 3D scene and
 * the DOM chrome meet.
 *
 * Note what is *not* here: which drawer row is currently previewing live. That
 * changes on every scroll tick and lives inside `AppList`, so a drag doesn't
 * re-render the `<Canvas>` subtree.
 */
export function WebOsShell({ apps }: { apps: AppScreen[] }) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [railOpen, setRailOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const selectedApp = apps.find((a) => a.slot === selectedSlot) ?? null;

  // Link slots (e.g. Cash App donate) can't be framed, so they open in a new
  // tab and never become the selection. The 3D ring handles its own link
  // clicks before its camera flight; this covers the drawer.
  const handleSelect = (slot: number) => {
    const app = apps.find((a) => a.slot === slot);
    if (app && isExternalLink(app)) {
      openExternalLink(app);
      return;
    }
    setSelectedSlot(slot);
  };

  return (
    <>
      {/* Home view. Stays mounted and animating behind the app frame — the
          particle field is the constant, the orbit ring dims back when an app
          takes over. */}
      <SceneClient apps={apps} dimmed={selectedSlot !== null} onSelect={handleSelect} />

      <AppFrame app={selectedApp} onClose={() => setSelectedSlot(null)} />

      <AppRail
        apps={apps}
        open={railOpen}
        onOpenChange={setRailOpen}
        selectedSlot={selectedSlot}
        onSelect={handleSelect}
        onHome={() => setSelectedSlot(null)}
        onAbout={() => setAboutOpen(true)}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
