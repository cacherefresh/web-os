"use client";

import dynamic from "next/dynamic";
import type { AppScreen } from "@/data/apps";

const Scene = dynamic(() => import("./Scene").then((mod) => mod.Scene), {
  ssr: false,
});

interface SceneClientProps {
  apps: AppScreen[];
  dimmed: boolean;
  onSelect: (slot: number) => void;
}

export function SceneClient({ apps, dimmed, onSelect }: SceneClientProps) {
  return <Scene apps={apps} dimmed={dimmed} onSelect={onSelect} />;
}
