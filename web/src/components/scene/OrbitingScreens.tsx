"use client";

import { useMemo } from "react";
import type { AppScreen } from "@/data/apps";
import { computeOrbitLayout } from "./orbitLayout";
import { ScreenPanel } from "./ScreenPanel";

export function OrbitingScreens({ apps }: { apps: AppScreen[] }) {
  const layout = useMemo(() => computeOrbitLayout(apps), [apps]);

  return (
    <group>
      {layout.map(({ screen, radius, height, speed, phase }) => (
        <ScreenPanel key={screen.id} screen={screen} radius={radius} height={height} speed={speed} phase={phase} />
      ))}
    </group>
  );
}
