"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AppScreen } from "@/data/apps";
import { useAppScreenTexture } from "./useAppScreenTexture";
import "./holographicMaterial";

interface ScreenPanelProps {
  screen: AppScreen;
  radius: number;
  height: number;
  speed: number;
  phase: number;
  /** An app frame is open — recede into the background and stop taking clicks. */
  dimmed: boolean;
  onSelect: (slot: number) => void;
}

/** How far down the panels fade once an app frame is covering the scene. */
const DIMMED_OPACITY = 0.12;

export function ScreenPanel({
  screen,
  radius,
  height,
  speed,
  phase,
  dimmed,
  onSelect,
}: ScreenPanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scratchScale = useRef(new THREE.Vector3());
  const texture = useAppScreenTexture(screen);
  const color = useMemo(() => new THREE.Color(screen.accent), [screen.accent]);
  const [hovered, setHovered] = useState(false);
  const isActive = screen.status === "active";
  const interactive = isActive && !dimmed;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = phase + t * speed;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = height + Math.sin(t * 0.6 + phase) * 0.15;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.y = -angle + Math.PI / 2;
      const targetScale = hovered && interactive ? 1.12 : 1;
      groupRef.current.scale.lerp(scratchScale.current.setScalar(targetScale), 0.15);
    }
    if (materialRef.current) {
      const uniforms = materialRef.current.uniforms;
      uniforms.uTime.value = t;

      const targetHover = hovered && interactive ? 1 : 0;
      uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, targetHover, 0.15);

      // Reuses the shader's existing opacity uniform to fade the whole ring
      // back behind an open app frame — no shader change needed.
      const baseOpacity = isActive ? 1 : 0.55;
      const targetOpacity = dimmed ? DIMMED_OPACITY : baseOpacity;
      uniforms.uOpacity.value = THREE.MathUtils.lerp(uniforms.uOpacity.value, targetOpacity, 0.08);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        // Selecting loads the app into the frame in place. It deliberately no
        // longer opens a tab — web-os is the shell, not a launcher.
        if (interactive) onSelect(screen.slot);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (interactive) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <mesh>
        <planeGeometry args={[1.6, 1, 1, 1]} />
        <holographicMaterialImpl
          ref={materialRef}
          uColor={color}
          uMap={texture}
          uOpacity={isActive ? 1 : 0.55}
          transparent
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
