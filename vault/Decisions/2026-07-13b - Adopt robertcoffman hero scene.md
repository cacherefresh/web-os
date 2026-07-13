---
tags: [decision]
date: 2026-07-13
---

# Decision — Adopt robertcoffman's hero scene as the basis for web-os

Supersedes part of [[2026-07-13 - Architecture Decisions]] (point 4, "scaffolding only") and revises
the original "vanilla Three.js/Vite" call in that same note (point 1's sibling, the `web/` tech
choice) — see [[../Architecture/Overview]] for the current state.

**Decision:** `web/` is rebuilt as Next.js + React Three Fiber (+ drei, postprocessing,
framer-motion, Tailwind v4), not vanilla Three.js/Vite. The center hero (`Figure`), orbit ring
(`OrbitingScreens`/`ScreenPanel`/`orbitLayout`), holographic shader material, particle field, camera
rig, and bloom/vignette post-processing are ported and adapted from
`github.com/cacherefresh/robertcoffman` (the owner's personal site).

**Why:** That repo, inspected directly, already implements almost exactly the visual concept
described for web-os — a glowing center figure with screens orbiting on a ring, holographic panel
shaders, particle streams, auto-orbiting camera with pointer parallax — at production quality. It
also already deploys the same way we need (`next build` static export + `public/CNAME` + GitHub
Pages custom domain), which de-risks our own deploy story for free. Rebuilding the same visual
system from scratch in vanilla Three.js would have been strictly worse: more time, no proven deploy
path, and a worse result than what already exists one repo over.

**What changed from the ported version:**
- `careerScreens` (work-history content) → `apps.ts`/`apps.json`, the 9-slot app registry
- `ScreenPanel` gained click-to-open (`window.open` to the app's live URL) and hover state
  (reusing the shader's existing `uHover` uniform) — the original had neither, since it wasn't
  meant to navigate anywhere
- `useScreenTexture` → `useAppScreenTexture`: draws the app's favicon + name + repo instead of
  career bullet text, and renders a distinct dashed "empty slot" placeholder for unfilled slots
- Added the purple `TopMenu` (Home/About + apps toggle), `AppDrawer` (shared left-hover /
  right-click-controlled slide-out nav), and `AboutModal` — none of these existed in the source;
  robertcoffman's `HeroOverlay` was a single static nav bar, not a full OS chrome layer
- Page is fixed phone-sized viewport (`max-w-md`, `h-dvh`, no scroll) instead of a scrolling
  portfolio page

**How to apply:** When extending the scene (new interactions, camera focus-on-click, etc.), check
`github.com/cacherefresh/robertcoffman`'s `src/components/hero/` first — it may already have a
pattern worth reusing the same way. Don't reinvent shader/particle work that already exists there in
working form.
