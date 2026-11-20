"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getWingTexture } from "./wingTexture";

/**
 * Shared 0→1 fade driver. The figure's glow is the brightest thing on screen,
 * so it has to come down hard when an app frame opens or it reads straight
 * through the frame's translucent bezel.
 */
const DIMMED_FACTOR = 0.15;

function Wing({ side, dim }: { side: 1 | -1; dim: RefObject<number> }) {
  const texture = useMemo(() => getWingTexture(), []);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = side * (0.18 + Math.sin(t * 0.6) * 0.05);
      groupRef.current.rotation.x = 0.1 + Math.sin(t * 0.9 + side) * 0.03;
    }
    if (materialRef.current) {
      materialRef.current.opacity = (0.4 + Math.sin(t * 1.4 + side) * 0.1) * dim.current;
    }
  });

  return (
    <group ref={groupRef} position={[side * 0.15, 0.35, -0.25]}>
      <mesh scale={[side, 1, 1]} position={[side * 1.1, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          color="#f5c451"
        />
      </mesh>
    </group>
  );
}

function BodySilhouette({ dim }: { dim: RefObject<number> }) {
  const rimRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (rimRef.current) {
      const material = rimRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (0.22 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08) * dim.current;
    }
  });

  return (
    <group>
      {/* core silhouette */}
      <mesh position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
        <meshStandardMaterial color="#0a0e1a" emissive="#f5c451" emissiveIntensity={0.25} roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#0a0e1a" emissive="#f5c451" emissiveIntensity={0.3} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* arms */}
      <mesh position={[0.38, 0.65, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.08, 0.55, 6, 12]} />
        <meshStandardMaterial color="#0a0e1a" emissive="#f5c451" emissiveIntensity={0.2} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[-0.38, 0.65, 0]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.08, 0.55, 6, 12]} />
        <meshStandardMaterial color="#0a0e1a" emissive="#f5c451" emissiveIntensity={0.2} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* legs */}
      <mesh position={[0.14, -0.25, 0]}>
        <capsuleGeometry args={[0.1, 0.6, 6, 12]} />
        <meshStandardMaterial color="#0a0e1a" emissive="#f5c451" emissiveIntensity={0.15} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[-0.14, -0.25, 0]}>
        <capsuleGeometry args={[0.1, 0.6, 6, 12]} />
        <meshStandardMaterial color="#0a0e1a" emissive="#f5c451" emissiveIntensity={0.15} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* outer rim glow shell */}
      <mesh ref={rimRef} position={[0, 0.55, 0]} scale={1.12}>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
        <meshBasicMaterial color="#f5c451" transparent opacity={0.22} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function Figure({ dimmed }: { dimmed: boolean }) {
  const floatRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  // Eased here once and read by every child, so the whole figure fades as one
  // body rather than each material easing on its own schedule.
  const dim = useRef(1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    dim.current = THREE.MathUtils.lerp(dim.current, dimmed ? DIMMED_FACTOR : 1, 0.06);

    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(t * 0.5) * 0.12;
      floatRef.current.rotation.y = Math.sin(t * 0.15) * 0.25;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 * dim.current;
    }
  });

  return (
    // Scaled down as a whole: at full size the wingspan overflows the portrait
    // viewport's narrow horizontal FOV and the wings get sliced off at both
    // edges. See the radius note in `orbitLayout.ts` — same constraint.
    <group ref={floatRef} scale={0.72}>
      <Wing side={1} dim={dim} />
      <Wing side={-1} dim={dim} />
      <BodySilhouette dim={dim} />
      <pointLight ref={lightRef} position={[0, 0.8, 0.6]} intensity={0.5} color="#f5c451" distance={3} />
    </group>
  );
}
