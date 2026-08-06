"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AppScreen } from "@/data/apps";
import { computeOrbitLayout } from "./orbitLayout";

interface CameraRigProps {
  apps: AppScreen[];
  focusedSlot: number | null;
}

export function CameraRig({ apps, focusedSlot }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const angle = useRef(0);
  const parallax = useRef(new THREE.Vector2(0, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0.4, 0));
  const layout = useMemo(() => computeOrbitLayout(apps), [apps]);

  useFrame((state, delta) => {
    const focused = focusedSlot != null ? layout.find((slot) => slot.screen.slot === focusedSlot) : undefined;

    if (focused) {
      // Same position formula ScreenPanel uses each frame, so the camera
      // targets exactly where the (still-orbiting) screen actually is.
      const t = state.clock.elapsedTime;
      const screenAngle = focused.phase + t * focused.speed;
      const sx = Math.cos(screenAngle) * focused.radius;
      const sz = Math.sin(screenAngle) * focused.radius;
      const sy = focused.height + Math.sin(t * 0.6 + focused.phase) * 0.15;

      const dir = new THREE.Vector2(sx, sz).normalize();
      const standoff = focused.radius + 2.2;
      const targetPos = new THREE.Vector3(dir.x * standoff, sy + 0.4, dir.y * standoff);

      camera.position.lerp(targetPos, 0.09);
      lookTarget.current.lerp(new THREE.Vector3(sx, sy, sz), 0.15);
      camera.lookAt(lookTarget.current);

      // Keep the idle angle roughly caught up so resuming doesn't jump.
      angle.current = Math.atan2(camera.position.x, camera.position.z);
      return;
    }

    angle.current += delta * 0.06;

    parallax.current.lerp(pointer as unknown as THREE.Vector2, 0.03);

    const radius = 7.2;
    const x = Math.sin(angle.current) * radius + parallax.current.x * 0.8;
    const z = Math.cos(angle.current) * radius + parallax.current.y * 0.4;
    const y = 0.6 + parallax.current.y * 0.6;

    lookTarget.current.lerp(new THREE.Vector3(0, 0.4, 0), 0.1);
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.06);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
