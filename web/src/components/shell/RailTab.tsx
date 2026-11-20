"use client";

export interface RailTabProps {
  onOpen: () => void;
  hidden: boolean;
}

/**
 * The always-present sliver at the left edge — the closed state of the rail.
 *
 * It *renders* as a ~12px translucent bar, but the button box is 44px wide and
 * fully transparent past the bar, so the touch target clears the accessible
 * minimum without the visual growing to match.
 */
export function RailTab({ onOpen, hidden }: RailTabProps) {
  return (
    <button
      type="button"
      aria-label="Open app rail"
      onClick={onOpen}
      onMouseEnter={onOpen}
      className={`pointer-events-auto absolute inset-y-0 left-0 z-30 flex w-11 items-center justify-start transition-opacity duration-300 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="group relative flex h-full w-3 items-center justify-center overflow-hidden border-r border-white/15 bg-white/[0.07] backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.13]">
        {/* Vertical accent wash — the edge should read as lit, not as a plain divider. */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-400/25 via-cyan-300/15 to-purple-400/25" />

        {/* Grab indicator, centred. */}
        <span className="relative flex flex-col gap-1">
          <span className="h-1 w-1 rounded-full bg-white/70" />
          <span className="h-1 w-1 rounded-full bg-white/70" />
          <span className="h-1 w-1 rounded-full bg-white/70" />
        </span>
      </span>
    </button>
  );
}
