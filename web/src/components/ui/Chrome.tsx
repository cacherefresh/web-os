"use client";

import { useState } from "react";
import type { AppScreen } from "@/data/apps";
import { TopMenu } from "./TopMenu";
import { AppDrawer } from "./AppDrawer";
import { AboutModal } from "./AboutModal";

export function Chrome({ apps }: { apps: AppScreen[] }) {
  const [rightOpen, setRightOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <TopMenu
        appsOpen={rightOpen}
        onToggleApps={() => setRightOpen((v) => !v)}
        onHome={() => {
          setRightOpen(false);
          setAboutOpen(false);
        }}
        onAbout={() => setAboutOpen(true)}
      />

      {/* Left-edge hover drawer — always-available quick access to the app grid. */}
      <AppDrawer side="left" apps={apps} mode="hover" />

      {/* Right slide-in drawer — opened from the top menu's toggle button. */}
      <AppDrawer side="right" apps={apps} mode="controlled" open={rightOpen} onOpenChange={setRightOpen} />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
