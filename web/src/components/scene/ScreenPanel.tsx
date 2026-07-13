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
}

export function ScreenPanel({ screen, radius, height, speed, phase }: ScreenPanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useAppScreenTexture(screen);
  const color = useMemo(() => new THREE.Color(screen.accent), [screen.accent]);
  const [hovered, setHovered] = useState(false);
  const isActive = screen.status === "active";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = phase + t * speed;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = height + Math.sin(t * 0.6 + phase) * 0.15;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.y = -angle + Math.PI / 2;
      const targetScale = hovered && isActive ? 1.12 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      const targetHover = hovered && isActive ? 1 : 0;
      materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uHover.value,
        targetHover,
        0.15
      );
    }
  });

  const openApp = () => {
    if (isActive && screen.url) {
      window.open(screen.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        openApp();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (isActive) {
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
