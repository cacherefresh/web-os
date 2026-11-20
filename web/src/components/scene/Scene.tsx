"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { isExternalLink, openExternalLink, type AppScreen } from "@/data/apps";
import { Figure } from "./Figure";
import { OrbitingScreens } from "./OrbitingScreens";
import { ParticleField } from "./ParticleField";
import { CameraRig } from "./CameraRig";

interface SceneProps {
  apps: AppScreen[];
  /** An app frame is open above the scene. */
  dimmed: boolean;
  onSelect: (slot: number) => void;
}

/** Camera flies to the clicked panel for this long before the frame opens. */
const FOCUS_FLIGHT_MS = 600;

export function Scene({ apps, dimmed, onSelect }: SceneProps) {
  // Which orbit slot the camera should fly toward. Purely a scene-local
  // animation concern — the shell only hears about the *selection*, once the
  // flight has landed.
  const [focusedSlot, setFocusedSlot] = useState<number | null>(null);
  const flightTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(flightTimer.current), []);

  const handleSelect = useCallback(
    (slot: number) => {
      // Link slots leave web-os, so skip the camera flight: the new tab has to
      // open inside this click, not from the flight timer, or it's popup-blocked.
      const app = apps.find((a) => a.slot === slot);
      if (app && isExternalLink(app)) {
        openExternalLink(app);
        return;
      }
      setFocusedSlot(slot);
      window.clearTimeout(flightTimer.current);
      flightTimer.current = window.setTimeout(() => {
        onSelect(slot);
        setFocusedSlot(null);
      }, FOCUS_FLIGHT_MS);
    },
    [apps, onSelect],
  );

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0.6, 8.6], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#040611"]} />
      {/* Pushed back with the camera — the old 8→26 range started fogging the
          far side of the ring the moment the camera moved out to 8.6. */}
      <fog attach="fog" args={["#040611", 10, 32]} />

      <ambientLight intensity={0.2} color="#5566ff" />
      <directionalLight position={[4, 6, 3]} intensity={0.5} color="#8fb3ff" />
      <pointLight position={[0, -1.5, 0]} intensity={0.4} color="#f5c451" distance={6} />

      <Suspense fallback={null}>
        <Figure dimmed={dimmed} />
        <OrbitingScreens apps={apps} dimmed={dimmed} onSelect={handleSelect} />
        <ParticleField apps={apps} />
      </Suspense>

      <CameraRig apps={apps} focusedSlot={focusedSlot} dimmed={dimmed} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.28} luminanceThreshold={0.65} luminanceSmoothing={0.1} mipmapBlur={false} radius={0.08} />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
