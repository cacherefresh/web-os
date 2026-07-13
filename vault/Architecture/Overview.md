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

- A futuristic Three.js scene: a center point (the "person"), with up to 9 screens arranged in an
  orbit ring around it, each bordered/framed as its own display.
- Click or move to a screen to focus/open the corresponding app.
- A purple top menu bar, always visible: **Home**, **About**.
- A left-edge hover menu that slides out, listing all configured apps by name (= their repo name).
- Alternative right-side slide-in nav as a second way to reach the same app list.
- Each orbiting screen shows a live mini-preview (iframe or periodically-captured thumbnail) of its
  app, plus the app's favicon as its icon.

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
Opening an app from web-os means navigating to (or iframing) its live URL. This keeps every app
independently deployable and keeps `web-os` itself small.
