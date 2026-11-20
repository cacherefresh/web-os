"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AppScreen } from "@/data/apps";
import { computeOrbitLayout } from "./orbitLayout";

interface CameraRigProps {
  apps: AppScreen[];
  focusedSlot: number | null;
  /** An app frame is open — drift wider so the ring reads as backdrop. */
  dimmed: boolean;
}

const IDLE_RADIUS = 8.6;
const DIMMED_RADIUS = 11;

export function CameraRig({ apps, focusedSlot, dimmed }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const angle = useRef(0);
  const parallax = useRef(new THREE.Vector2(0, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0.4, 0));
  const radius = useRef(IDLE_RADIUS);
  // Reused each frame instead of allocating new vectors 60x/second.
  const scratchPos = useRef(new THREE.Vector3());
  const scratchLook = useRef(new THREE.Vector3());
  const layout = useMemo(() => computeOrbitLayout(apps), [apps]);

  useFrame((state, delta) => {
    const focused =
      focusedSlot != null ? layout.find((slot) => slot.screen.slot === focusedSlot) : undefined;

    if (focused) {
      // Same position formula ScreenPanel uses each frame, so the camera
      // targets exactly where the (still-orbiting) screen actually is.
      const t = state.clock.elapsedTime;
      const screenAngle = focused.phase + t * focused.speed;
      const sx = Math.cos(screenAngle) * focused.radius;
      const sz = Math.sin(screenAngle) * focused.radius;
      const sy = focused.height + Math.sin(t * 0.6 + focused.phase) * 0.15;

      const dirX = sx / focused.radius;
      const dirZ = sz / focused.radius;
      const standoff = focused.radius + 2.2;

      camera.position.lerp(scratchPos.current.set(dirX * standoff, sy + 0.4, dirZ * standoff), 0.09);
      lookTarget.current.lerp(scratchLook.current.set(sx, sy, sz), 0.15);
      camera.lookAt(lookTarget.current);

      // Keep the idle angle roughly caught up so resuming doesn't jump.
      angle.current = Math.atan2(camera.position.x, camera.position.z);
      return;
    }

    angle.current += delta * (dimmed ? 0.03 : 0.06);
    radius.current = THREE.MathUtils.lerp(radius.current, dimmed ? DIMMED_RADIUS : IDLE_RADIUS, 0.03);

    parallax.current.lerp(pointer as unknown as THREE.Vector2, 0.03);

    const x = Math.sin(angle.current) * radius.current + parallax.current.x * 0.8;
    const z = Math.cos(angle.current) * radius.current + parallax.current.y * 0.4;
    const y = 0.6 + parallax.current.y * 0.6;

    lookTarget.current.lerp(scratchLook.current.set(0, 0.4, 0), 0.1);
    camera.position.lerp(scratchPos.current.set(x, y, z), 0.06);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
