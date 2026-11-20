"use client";

import { useEffect, useRef, useState } from "react";
import type { AppScreen } from "@/data/apps";

/**
 * The viewport we pretend the app is being rendered into when scaled down. Wide
 * enough that the embedded site lays out its *desktop* design, which is what
 * reads as a recognizable "mini version of the site" in a small preview box —
 * letting the iframe size itself to the box instead just triggers the app's own
 * mobile breakpoint, which looks like a generic column of text.
 */
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

/**
 * Third-party sites we control, embedded cross-origin. `allow-same-origin` is
 * safe here precisely because it's cross-origin — it grants the frame its own
 * origin, not ours — and the apps need it for storage/fetch to work at all.
 */
const SANDBOX = "allow-scripts allow-same-origin allow-popups allow-forms";

/** Measures the container and returns the factor that fits DESIGN_WIDTH into it. */
function useFitScale(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width > 0) setScale(width / DESIGN_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return { ref, scale };
}

/**
 * Shown for empty slots, for active apps that aren't the currently-live one,
 * and while a live frame is still loading. Mirrors the holographic card
 * language of the 3D panels (see `scene/useAppScreenTexture.ts`) so the drawer
 * and the scene read as one system.
 */
function PreviewPlaceholder({ app, loading }: { app: AppScreen; loading?: boolean }) {
  const isActive = app.status === "active";

  if (!isActive) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-[3px] border border-dashed"
        style={{ borderColor: `${app.accent}55`, backgroundColor: `${app.accent}08` }}
      >
        <span className="text-lg leading-none" style={{ color: `${app.accent}88` }}>
          +
        </span>
        <span
          className="text-[8px] font-medium uppercase tracking-[0.2em]"
          style={{ color: `${app.accent}99` }}
        >
          Slot {app.slot}
        </span>
      </div>
    );
  }

  if (app.kind === "link") {
    // Not embeddable, so the icon *is* the preview — shown large, with a hint
    // that it leaves web-os.
    return (
      <div
        className="flex h-full w-full items-center justify-center gap-2 rounded-[3px]"
        style={{ backgroundColor: `${app.accent}0f` }}
      >
        {app.faviconUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.faviconUrl} alt="" className="h-14 w-14 object-contain" />
        )}
        <span
          className="text-[8px] font-medium uppercase tracking-[0.2em]"
          style={{ color: `${app.accent}cc` }}
        >
          Opens ↗
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[3px]"
      style={{ backgroundColor: `${app.accent}0f` }}
    >
      {app.faviconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={app.faviconUrl} alt="" className="h-6 w-6 rounded object-contain opacity-80" />
      ) : (
        <span className="text-sm font-bold text-white/70">
          {(app.name ?? "?").slice(0, 1).toUpperCase()}
        </span>
      )}
      <span
        className="text-[8px] font-medium uppercase tracking-[0.2em]"
        style={{ color: `${app.accent}cc` }}
      >
        {loading ? "Linking…" : "Standby"}
      </span>
      {loading && (
        <span className="h-px w-10 animate-pulse rounded-full" style={{ backgroundColor: app.accent }} />
      )}
    </div>
  );
}

export interface AppPreviewFrameProps {
  app: AppScreen;
  /** Mount a real iframe. When false, renders the cheap placeholder card instead. */
  live: boolean;
  /** Let pointer events reach the embedded site. Off in list previews so scroll passes through. */
  interactive?: boolean;
  /**
   * `"scale"` renders a DESIGN_WIDTH-wide frame shrunk to fit (mini preview);
   * `"native"` lets the iframe fill the container at 1:1 (the main app frame).
   */
  fit?: "scale" | "native";
  className?: string;
}

/**
 * One app's viewport, at any size. Used both for the small previews inside each
 * drawer row and for the full-size frame the selected app loads into — keeping
 * a single place that knows how to embed an app.
 */
export function AppPreviewFrame({
  app,
  live,
  interactive = false,
  fit = "scale",
  className = "",
}: AppPreviewFrameProps) {
  const scaled = fit === "scale";
  const { ref, scale } = useFitScale(scaled && live);

  // Track *which* URL finished loading rather than a bare boolean, so a new URL
  // is unloaded by definition. Resetting a boolean in an effect instead would
  // cost an extra render pass and trip `react-hooks/set-state-in-effect`.
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const loaded = loadedUrl !== null && loadedUrl === app.url;

  const canEmbed = live && app.status === "active" && app.kind === "app" && Boolean(app.url);
  const measured = !scaled || scale > 0;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-[#04061199] ${
        interactive ? "" : "pointer-events-none"
      } ${className}`}
    >
      {canEmbed && measured && (
        <iframe
          src={app.url as string}
          title={app.name ?? `Slot ${app.slot}`}
          sandbox={SANDBOX}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoadedUrl(app.url ?? null)}
          className="absolute left-0 top-0 border-0"
          style={
            scaled
              ? {
                  width: `${DESIGN_WIDTH}px`,
                  height: `${DESIGN_HEIGHT}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "0 0",
                }
              : { width: "100%", height: "100%" }
          }
        />
      )}

      {/* Covers the iframe until it paints, then fades out. Kept mounted rather
          than swapped so the frame never flashes the page background. */}
      {(!canEmbed || !loaded) && (
        <div className="absolute inset-0">
          <PreviewPlaceholder app={app} loading={canEmbed} />
        </div>
      )}

      {/* Holographic wash — ties the embedded site into the scene's palette
          without obscuring it. Never intercepts pointer events. */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ backgroundColor: `${app.accent}0a` }}
      />
    </div>
  );
}
