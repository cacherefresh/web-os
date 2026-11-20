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
    // Tighter than the radii this was ported with. web-os renders into a
    // phone-shaped viewport (`max-w-md`, portrait), where the *horizontal* FOV
    // is only ~23° — a wide ring simply falls outside the frame and the home
    // view reads as an empty starfield. Pulled in so panels actually sweep
    // through shot as they orbit.
    const radius = 2.8 + ring * 0.7;
    const height = -1.4 + ring * 1.4 + (i % 2 === 0 ? 0.3 : -0.3);
    const speed = 0.06 + ring * 0.015 + (i % 2 === 0 ? 0.01 : -0.01);
    const phase = (i / count) * Math.PI * 2;
    return { screen, radius, height, speed, phase };
  });
}
