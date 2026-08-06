import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import type { AppScreen } from "@/data/apps";

const WIDTH = 512;
const HEIGHT = 320;

function drawEmptySlot(ctx: CanvasRenderingContext2D, screen: AppScreen) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = screen.accent;
  ctx.globalAlpha = 0.35;
  ctx.setLineDash([10, 10]);
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, WIDTH - 12, HEIGHT - 12);
  ctx.setLineDash([]);

  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = screen.accent;
  ctx.lineWidth = 4;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2 - 10;
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy);
  ctx.lineTo(cx + 24, cy);
  ctx.moveTo(cx, cy - 24);
  ctx.lineTo(cx, cy + 24);
  ctx.stroke();

  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 20px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`SLOT ${screen.slot} · OPEN`, cx, cy + 56);
  ctx.textAlign = "left";
}

function drawApp(ctx: CanvasRenderingContext2D, screen: AppScreen, icon: HTMLImageElement | null) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const iconSize = 64;
  const iconX = 28;
  const iconY = 26;
  if (icon) {
    ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
  } else {
    ctx.fillStyle = screen.accent;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(iconX, iconY, iconSize, iconSize);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 32px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText((screen.name ?? "?").slice(0, 1).toUpperCase(), iconX + iconSize / 2, iconY + iconSize / 2 + 12);
    ctx.textAlign = "left";
  }

  ctx.fillStyle = screen.accent;
  ctx.globalAlpha = 0.9;
  ctx.font = "600 18px 'Segoe UI', sans-serif";
  ctx.fillText("ACTIVE", iconX + iconSize + 20, iconY + 8);

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 34px 'Segoe UI', sans-serif";
  ctx.fillText(screen.name ?? "", iconX + iconSize + 20, iconY + 42);

  ctx.font = "400 18px 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(screen.repo ?? "", iconX, iconY + iconSize + 30);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("tap to open →", iconX, HEIGHT - 40);

  ctx.strokeStyle = screen.accent;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, WIDTH - 8, HEIGHT - 8);
}

export function useAppScreenTexture(screen: AppScreen) {
  const [loadedIcon, setLoadedIcon] = useState<{ url: string; img: HTMLImageElement } | null>(null);

  useEffect(() => {
    if (screen.status !== "active" || !screen.faviconUrl) {
      return;
    }
    let cancelled = false;
    const url = screen.faviconUrl;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!cancelled) setLoadedIcon({ url, img });
    };
    img.onerror = () => {
      if (!cancelled) setLoadedIcon(null);
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [screen.status, screen.faviconUrl]);

  // Ignore a stale icon from a previous screen/faviconUrl instead of
  // resetting it via setState in the effect above (react-hooks/set-state-in-effect).
  const icon = loadedIcon && loadedIcon.url === screen.faviconUrl ? loadedIcon.img : null;

  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (screen.status === "active") {
        drawApp(ctx, screen, icon);
      } else {
        drawEmptySlot(ctx, screen);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    // Plane normals face outward (away from the cylinder axis), so the
    // front face is seen mirrored in U; flip it back here.
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.offset.x = 1;
    texture.needsUpdate = true;
    return texture;
  }, [screen, icon]);
}
