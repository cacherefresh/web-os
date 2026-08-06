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
- [x] Move-to-focus camera animation on click — `CameraRig` now takes `apps`/`focusedSlot`, and on
      click a `ScreenPanel` sets focus (camera flies to stand off from the screen's live orbit
      position and looks at it), opens the app's URL ~650ms in, then releases focus back to the
      idle auto-orbit ~900ms after that.
- [x] First real app registered: slot 1 is `robertcoffman` (`cacherefresh/robertcoffman`,
      `robertcoffman.cacherefresh.io`) — the same repo the hero scene was ported from.
- [x] Slots 2–3 registered: `Guilds` (`cacherefresh/Guilds` → `guilds.cacherefresh.io`) and
      `YuVi_Rays` (`cacherefresh/YuVi_Rays` → `yuvi-rays-dvs.cacherefresh.io`) — repo name and
      subdomain intentionally differ for `YuVi_Rays`, confirmed against its own `web/CNAME`. `Guilds`
      has **no CNAME file anywhere in the repo** (checked root, `flutter_app/web/`, and all
      branches) — the domain came from the owner directly, not repo-verified; add one there so
      GitHub Pages actually routes it. This also caught (and fixed) a wrong assumption baked into
      `add-app`/AGENTS.md: subdomain ≠ repo name in general, and favicon extension isn't always
      `.ico` (both `Guilds` and `YuVi_Rays` serve `favicon.png`, Flutter web's default).
- [x] `flutter_shell/app` + `flutter_shell/packages/webos_webview` — real implementation, not just
      pubspec stubs. `WebOsWebView` wraps `webview_flutter` (loading spinner, retry-on-error),
      `main.dart` renders it full-bleed pointed at `web-os.cacherefresh.io`. Android/iOS platform
      folders generated via `flutter create` and transplanted in. `flutter pub get` +
      `flutter analyze` both pass clean (Flutter 3.44.8 stable is installed in this environment).
      Scoped to Android + iOS only for now — see
      [[Decisions/2026-08-06 - flutter_shell implementation]] for why, and what's still unverified
      (no actual device/simulator build — no Android SDK or full Xcode installed here).
- [x] PR-triggered CI: `.github/workflows/ci-web.yml` (lint + the same `build:pages` build
      `deploy-web.yml` runs, on every PR touching `web/`) and `.github/workflows/ci-flutter.yml`
      (`flutter analyze` on both modules + a real `flutter build apk --debug` on every PR touching
      `flutter_shell/`, since GitHub-hosted `ubuntu-latest` runners ship with the Android SDK this
      local environment lacks). Both trigger on `pull_request` targeting `sanctuary`, which checks
      out the merge commit by default — i.e. what would actually land, not just the PR branch alone.
      iOS build intentionally left at `flutter analyze` only (a real `flutter build ios` needs a
      pricier macOS runner) — see the comment in `ci-flutter.yml` if that's worth changing.
      **Also fixed a bug found while adding this**: `deploy-web.yml`'s `setup-node` step had
      `cache: npm` pointed at a `package-lock.json` that doesn't exist yet, which hard-fails the
      cache step. Removed until a lockfile is committed (same `npm install`-not-`npm ci` situation as
      before).

## Not started

- [ ] `npm install` / `next dev` has **not** been run or verified — this environment has no Node.js
      installed, so `web/` has not been build- or runtime-checked yet. Verify locally before
      trusting it. The new `ci-web.yml` will verify it on the first PR that touches `web/`, though.
- [ ] `flutter build ios` — not run anywhere yet (CI or locally); only `flutter analyze` covers iOS.
- [ ] Live mini-preview per screen (iframe or periodic screenshot) — currently a static
      favicon+name card, not a live view of the app
- [ ] Desktop (macOS/Windows/Linux) support for `flutter_shell` — deferred, needs a different WebView
      plugin than the Android/iOS-only `webview_flutter`
- [ ] Native bridging in `webos_webview` (deep links, push notifications) — not started
- [ ] `Guilds` needs an actual `CNAME` file committed in-repo — domain is registered here on the
      owner's word, not verified against the repo
- [ ] Slots 4–9 still empty

See [[Architecture/Overview]] for how these pieces are meant to fit together, and
[[Decisions/2026-07-13 - Architecture Decisions]] / [[Decisions/2026-07-13b - Adopt robertcoffman hero scene]] /
[[Decisions/2026-08-06 - flutter_shell implementation]] for why they're scoped this way.
