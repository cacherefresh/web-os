import type { AppScreen } from "@/data/apps";

export interface OrbitSlot {
  screen: AppScreen;
  radius: number;
  height: number;
  speed: number;
  phase: number;
}

export function computeOrbitLayout(apps: AppScreen[]): OrbitSlot[] {
  const count = apps.length;
  return apps.map((screen, i) => {
    const ring = i % 3;
    const radius = 3.4 + ring * 0.9;
    const height = -1.4 + ring * 1.4 + (i % 2 === 0 ? 0.3 : -0.3);
    const speed = 0.06 + ring * 0.015 + (i % 2 === 0 ? 0.01 : -0.01);
    const phase = (i / count) * Math.PI * 2;
    return { screen, radius, height, speed, phase };
  });
}
