---
tags: [roadmap]
---

# Roadmap

Kept honest: this reflects what's actually built, not the full vision. Update it as items land.

## Done

- [x] Repo scaffolding: `web/`, `flutter_shell/`, `vault/`, `AGENTS.md`
- [x] App registry stub (`web/src/config/apps.json`, [[Apps/App Registry]])
- [x] `add-app` Claude Skill
- [x] `web/` rebuilt as Next.js + React Three Fiber, adapting
      [[Decisions/2026-07-13b - Adopt robertcoffman hero scene|robertcoffman's hero scene]]
- [x] Three.js scene: center `Figure` + 9 orbiting holographic `ScreenPanel`s (`OrbitingScreens`)
- [x] Click-to-open on a screen → opens the app's live URL in a new tab (hover highlight via the
      shader's `uHover` uniform)
- [x] Purple `TopMenu` (Home, About, apps toggle)
- [x] Left-edge hover `AppDrawer`, listing every slot by app name (= repo name)
- [x] Right-side slide-in `AppDrawer` (opened from the top menu toggle) — same component, mirrored
- [x] Favicon rendered into each screen's canvas texture (`useAppScreenTexture`), with a graceful
      "empty slot" placeholder when unfilled

- [x] `web/` CI/deploy pipeline (`.github/workflows/deploy-web.yml`) — builds the static export on
      push to `sanctuary` and deploys via GitHub Pages, matching robertcoffman's `build:pages`
      script. **Needs a one-time repo setting**: Settings → Pages → Source → "GitHub Actions"
      (currently unset — the workflow will fail until that's flipped). Also installs with
      `npm install` rather than `npm ci` since no `package-lock.json` is committed yet; switch to
      `npm ci` once one exists.

## Not started

- [ ] `npm install` / `next dev` has **not** been run or verified — this environment has no Node.js
      installed, so none of the above has been build- or runtime-checked yet. Verify locally before
      trusting it.
- [ ] Move-to-focus camera animation on click (currently opens immediately, no camera pan-in)
- [ ] Live mini-preview per screen (iframe or periodic screenshot) — currently a static
      favicon+name card, not a live view of the app
- [ ] `flutter_shell/app` — actual WebView screen wired to the hosted URL
- [ ] `flutter_shell/packages/webos_webview` — real implementation (currently pubspec stub only)
- [ ] First real app registered in the grid (currently 9 empty slots)

See [[Architecture/Overview]] for how these pieces are meant to fit together, and
[[Decisions/2026-07-13 - Architecture Decisions]] / [[Decisions/2026-07-13b - Adopt robertcoffman hero scene]]
for why they're scoped this way.
