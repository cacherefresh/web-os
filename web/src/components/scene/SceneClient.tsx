"use client";

import dynamic from "next/dynamic";
import type { AppScreen } from "@/data/apps";

const Scene = dynamic(() => import("./Scene").then((mod) => mod.Scene), {
  ssr: false,
});

export function SceneClient({ apps }: { apps: AppScreen[] }) {
  return <Scene apps={apps} />;
}
