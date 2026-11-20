---
tags: [decision]
date: 2026-08-06
---

# Decision — navigation moves out of the 3D scene into a left rail and an in-place app frame

Supersedes the navigation half of [[2026-07-13b - Adopt robertcoffman hero scene]]. The ported scene
components stay; what changed is that they are no longer how you get anywhere.

**Decision:** web-os navigates through DOM chrome, not through the orbit ring. A ~12px translucent
sliver (`RailTab`) sits permanently at the left edge; touching it expands `AppRail` into a
translucent drawer holding a vertically snap-scrolling carousel of all 9 slots (`AppList`). Each row
(`AppListItem`) is name top-left, icon bottom-left, and a **live preview window** of the app on the
right. Selecting a row loads that site into `AppFrame` — a holographic-bezelled iframe filling the
viewport — while the sliver stays reachable to switch apps. The Three.js scene becomes the Home/idle
view and the permanent particle atmosphere behind the frame; the purple `TopMenu` is gone, with Home
and About folded into the rail.

**Why the scene stopped being the navigation:** the owner's verdict on the orbiting-panel UI was
blunt — "looks bad." Structurally it also never delivered the original vision's "mini version of
navigating to each website": the panels rendered a static favicon+name canvas texture, and clicking
one `window.open`ed a new tab, so the one thing web-os is *for* — being the shell those apps live
inside — was the one thing it didn't do. A holographic ring is atmosphere; it is a poor list widget,
especially at phone width where most of it is off-screen anyway.

**Why this was safe to build at all:** the whole design rests on being able to iframe the app
subdomains. Checked before writing any code — `robertcoffman`, `guilds`, and `yuvi-rays-dvs` all
return 200 from GitHub Pages with **no `X-Frame-Options` and no CSP `frame-ancestors`**. GitHub Pages
sets neither by default, so this should hold for future slots, but it is now a real constraint on
what can be registered (see [[../Apps/App Registry]]).

**Only one iframe is live at a time.** `AppList` picks the row nearest the scroll centre (or the
hovered row) via an `IntersectionObserver` and mounts a real iframe only there; the other eight
render cheap holographic placeholder cards. Nine concurrent embeds — several of them WebGL sites —
would stutter scrolling on a phone. The observer deliberately only watches rows marked
`data-active="true"`: an empty slot has nothing to embed, and letting one win the "centred" contest
blanked the preview entirely for as long as it stayed centred. That was a real bug caught in the
browser, not in review — 6 of the 9 slots are empty today, so the centred row usually *is* one.

**`previewSlot` intentionally does not live in the shell.** `WebOsShell` owns `selectedSlot`,
`railOpen`, and `aboutOpen` only. Which row is previewing changes on every scroll tick; hoisting it
would re-render the R3F `<Canvas>` subtree throughout a drag.

**Composition had to be retuned for portrait.** The scene was ported from a desktop-width hero, and
in web-os's phone-shaped viewport (`max-w-md`) the *horizontal* FOV is only ~23° — the ring fell
entirely outside the frame and Home rendered as the figure, cropped, over an empty starfield. Orbit
radii came in (`3.4 + ring*0.9` → `2.8 + ring*0.7` in `orbitLayout.ts`), the figure is scaled to
0.72, the idle camera moved out to 8.6, and fog moved back to 10→32 to match. Trying to fit the
*whole* ring is geometrically hopeless at this aspect ratio; panels sweeping through shot is the
achievable version.

**What else changed while in here:**
- `ScreenPanel`'s click now selects into the frame rather than opening a tab. This also retires two
  `setTimeout`s that were never cleared on unmount and a deferred `window.open` that sat outside the
  user-gesture window, where popup blockers eat it. The camera-flight timer moved up to `Scene`,
  where it has a cleanup.
- Dimming reuses the holographic shader's existing `uOpacity` uniform — no shader edit needed.
- `globals.css` had `body { font-family: Arial … }`, silently overriding the Geist faces `layout.tsx`
  loads and exposes as `--font-sans`. Fixed.
- Deleted `TopMenu.tsx`, `AppDrawer.tsx`, `Chrome.tsx`, and `siteConfig.nav`.

**How to apply:** build new shell UI in `web/src/components/shell/`; `web/src/components/ui/` now
holds only `AboutModal`. Reuse `AppPreviewFrame` for anything that needs to show an app — it is the
single place that knows how to embed one, and it renders at any size (`fit="scale"` shrinks a
1280px-wide desktop layout into a thumbnail, `fit="native"` fills its container). Don't reintroduce
navigation into the 3D scene; clicking a panel is a shortcut to a selection, not a separate path.
