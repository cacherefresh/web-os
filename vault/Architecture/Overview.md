---
tags: [architecture]
---

# Architecture Overview

Three layers, deliberately decoupled:

## 1. `web/` — the core experience

A standalone Next.js app (App Router, static-exported) using React Three Fiber + drei +
postprocessing for the 3D layer and Tailwind + framer-motion for the DOM chrome, hosted at
`web-os.cacherefresh.io`. Its scene layer is adapted from `github.com/cacherefresh/robertcoffman` —
see [[../Decisions/2026-07-13b - Adopt robertcoffman hero scene]]. This is where all the
visual/interaction design lives:

Navigation lives in the DOM chrome (`src/components/shell/`), not in the 3D scene — see
[[../Decisions/2026-08-06b - Rail and frame UI redesign]]:

- A ~12px translucent sliver pinned to the left edge at all times (`RailTab`). Touching it expands
  `AppRail` into a translucent drawer; picking an app collapses it back to the sliver.
- The drawer holds a vertically snap-scrolling carousel of all 9 slots (`AppList`). Each row
  (`AppListItem`) is the app name top-left, its favicon bottom-left, and a live preview window of
  the app on the right. Exactly one row mounts a real iframe at a time — the one nearest the scroll
  centre, or the hovered one.
- Selecting a row loads that app in place, full-viewport, inside a holographic bezel (`AppFrame`).
  The sliver stays reachable over it to switch apps.
- **Home** and **About** live in the rail's header and footer. There is no top menu bar.

The Three.js scene (`src/components/scene/`) is the Home/idle view and the permanent atmosphere: a
center figure with up to 9 holographic screens on an orbit ring, plus a particle field that keeps
running behind an open app frame. Clicking a panel is a shortcut to selecting that app, not a
separate navigation path; when a frame is open the ring and figure fade back.

This layer has zero knowledge of Flutter and should run standalone in any modern browser.

## 2. `flutter_shell/` — distribution wrapper

A thin Flutter app whose only job is to open `web-os.cacherefresh.io` in a WebView, so the same
experience can ship through app stores / as a desktop app. Split into modules:

- `app/` — the actual Flutter application (routing, splash, permissions).
- `packages/webos_webview/` — an isolated package wrapping the WebView + any native bridging
  (deep links, push notifications, etc.) so it can be reasoned about/tested independently of `app/`.

No Three.js/Dart interop, no attempt to reimplement the scene in Flutter widgets. See
[[../Decisions/2026-07-13 - Architecture Decisions]] for why.

## 3. The app repos (external)

Each app is a fully independent GitHub repo with its own deploy and its own CNAME record:
`<reponame>.cacherefresh.io`. `web-os` never vendors their source — it only stores, per app, a
`name`, `repo`, `url`, and `faviconUrl` in [[../Apps/App Registry]] / `web/src/config/apps.json`.
Opening an app from web-os means iframing its live URL. This keeps every app independently
deployable and keeps `web-os` itself small.

One constraint follows from the iframe: an app repo must not serve `X-Frame-Options` or a CSP
`frame-ancestors` directive, or both its drawer preview and its app frame render blank. GitHub Pages
sets neither by default, so the current three are fine — but it has to be checked when registering a
new slot.
