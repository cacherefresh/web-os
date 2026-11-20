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
- [x] Favicon rendered into each screen's canvas texture (`useAppScreenTexture`), with a graceful
      "empty slot" placeholder when unfilled

- [x] **UI redesign — rail + in-place app frame** (`web/src/components/shell/`). Replaces the purple
      `TopMenu` and both `AppDrawer`s, all three now deleted, along with `Chrome.tsx` and
      `siteConfig.nav`. A ~12px translucent sliver (`RailTab`) sits at the left edge; touching it
      expands `AppRail` into a drawer holding a vertical snap carousel of all 9 slots (`AppList`).
      Each row (`AppListItem`) is name top-left, favicon bottom-left, live preview right. Selecting
      loads the app in place in `AppFrame`; the sliver stays reachable to switch. Home/About moved
      into the rail. `WebOsShell` owns `selectedSlot`/`railOpen`/`aboutOpen`. See
      [[Decisions/2026-08-06b - Rail and frame UI redesign]].
- [x] **Live mini-previews** — the "not started" item below, now delivered. `AppPreviewFrame` is one
      reusable component used at both sizes: `fit="scale"` renders the app's 1280px-wide desktop
      layout shrunk into a thumbnail (so previews look like the real site rather than its mobile
      breakpoint), `fit="native"` fills the app frame. **Exactly one iframe is mounted at a time** —
      the row nearest the scroll centre or the hovered row — since nine concurrent embeds, several
      of them WebGL sites, would stutter scrolling on a phone. Verified against all three live app
      subdomains: none send `X-Frame-Options` or CSP `frame-ancestors`, so embedding works.
- [x] Click-to-select on a 3D screen — a panel click now loads the app into the frame instead of
      `window.open`ing a tab, and the ring/figure fade back (reusing the shader's existing
      `uOpacity` uniform) while the particle field keeps running. Retired two `setTimeout`s that
      were never cleared on unmount and a deferred `window.open` that popup blockers would eat.
- [x] Scene recomposed for the portrait viewport — orbit radii pulled in, figure scaled to 0.72,
      idle camera out to 8.6, fog to 10→32. At `max-w-md` the horizontal FOV is only ~23°, so the
      ported desktop framing put the whole ring off-screen and cropped the figure's wings.
- [x] **Navigation containment in `webos_webview`** — `WebOsWebView` now sets `onNavigationRequest`
      and wraps itself in a `PopScope`. Fixes a hole the rail/frame redesign opened: because apps
      are now embedded *in place* instead of handed to `window.open`, an outbound link inside an
      embedded app was a top-level navigation that replaced the whole shell with a page having no
      address bar and no way back (and Android's back button exits the app rather than walking
      WebView history). Off-host main-frame navigations are now prevented and handed to the system
      browser via `url_launcher`; `AndroidManifest.xml` gained `http`/`https` `<queries>` intents,
      without which that hand-off silently no-ops on Android 11+. **Sub-frame requests are always
      allowed through** — every preview and the app frame is an iframe on a different
      `*.cacherefresh.io` host, so host-filtering them would blank all nine slots. `flutter analyze`
      clean on both modules; `flutter build apk` still unrunnable here (no Android SDK — CI covers
      it). See [[Decisions/2026-08-06 - flutter_shell implementation]].
- [x] Verified in a real headless Chromium at phone width (420×860): rail opens, carousel scrolls
      with exactly one live iframe, apps load in the frame, rail reopens over it, zero console
      errors. Also fixed `globals.css` hardcoding `font-family: Arial`, which had been silently
      overriding the Geist faces `layout.tsx` loads.

- [x] `web/` CI/deploy pipeline (`.github/workflows/deploy-web.yml`) — builds the static export on
      push to `sanctuary` and deploys via GitHub Pages, matching robertcoffman's `build:pages`
      script. **Still needs a one-time repo setting**: Settings → Pages → Source → "GitHub Actions"
      — confirmed still unset (`GET /repos/cacherefresh/web-os/pages` returns 404), so the workflow
      will fail until that's flipped, and `web-os.cacherefresh.io` needs a GoDaddy CNAME record
      pointing at `cacherefresh.github.io`. A `package-lock.json` **is** now committed, so both
      workflows can switch from `npm install` to `npm ci` and re-enable `setup-node`'s `cache: npm`
      (with `cache-dependency-path: web/package-lock.json`).
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

- [ ] `flutter build ios` — not run anywhere yet (CI or locally); only `flutter analyze` covers iOS.
- [ ] Live preview in the *3D* panels — the orbiting `ScreenPanel`s still draw a favicon+name canvas
      texture. Live previews exist in the rail and the app frame (DOM iframes); putting one on a
      WebGL plane needs a different mechanism entirely and may not be worth it now that the ring is
      atmosphere rather than navigation.
- [ ] **macOS** support for `flutter_shell` — cheaper than this list previously claimed. The old
      entry said `webview_flutter` was Android/iOS-only and desktop needed a different plugin; that
      is wrong for macOS. `webview_flutter_wkwebview` covers iOS **and** macOS, and both lockfiles
      already resolve `webview_flutter_wkwebview 3.26.0` / `webview_flutter 4.14.1`. All that's
      missing is the `macos/` platform folder — `flutter create --platforms=macos .`, same
      transplant as `android/`/`ios/`. Correction recorded in
      [[Decisions/2026-08-06 - flutter_shell implementation]].
- [ ] **Windows/Linux** support for `flutter_shell` — this part of the old entry stands: neither has
      a first-party `webview_flutter` implementation, so each needs a non-standard plugin. Still
      worth deferring until there's a real reason.
- [ ] Remaining native bridging in `webos_webview` — deep links and push notifications. Note that
      the *containment* half of this item is now done (see Done above); what's left is genuinely
      optional, unlike what shipped.
- [x] ~~`Guilds` needs an actual `CNAME` file committed in-repo.~~ Resolved 2026-11-19: not needed.
      Guilds (like every app repo here) deploys via `actions/deploy-pages`, which ignores the file —
      the branch-deploy risk below doesn't apply. See
      [[Decisions/2026-11-19 - CNAME file is not the source of truth]]. Original note: **The old rationale here was wrong**
      — it said the file was needed "so GitHub Pages actually routes it," but the domain already
      routes: `guilds.cacherefresh.io` returns 200. The custom domain lives in the repo's Pages
      settings server-side, independent of the file. What confirms the file is genuinely absent is
      that `guilds.cacherefresh.io/CNAME` 404s while `robertcoffman` and `yuvi-rays-dvs` both serve
      theirs at 200. The real risk is durability, not routing: if Guilds deploys from a branch, a
      deploy whose output lacks `CNAME` lets GitHub clear the custom-domain setting and the
      subdomain silently drops. Guilds is also the only one of the three with no repo-verified
      deploy config, so its iframe-embeddability is worth re-checking whenever it redeploys
      (currently fine — no `X-Frame-Options`, no CSP `frame-ancestors`).
- [x] Slots 1–5 filled and reordered to the owner's requested order (2026-11-19): `InsulinPlant`
      (`insulinplant.cacherefresh.io`), `America_TwoDotZero` (`america2dot0.cacherefresh.io`),
      `YuVi_Rays`, `Guilds`, then `robertcoffman`. All five verified live (200), iframe-embeddable,
      and serving their registered favicon.
- [x] Slot 7 is a Cash App donate link (`cash.app/$cacherefresh`) — first `"kind": "link"` slot,
      opens in a new tab since Cash App can't be framed (2026-11-19). See
      [[Decisions/2026-11-19b - Link slots for non-embeddable destinations]].
- [x] Slots reordered (2026-11-19): 1 `InsulinPlant`, 2 `AI-Paladin`, 3 `America_TwoDotZero`,
      4 `YuVi_Rays`, 5 `Guilds`, 6 `robertcoffman`, 7 Donate.
- [ ] `AI-Paladin` (slot 2) has no site yet — it's a temporary link slot to its GitHub repo with a
      placeholder logo (`web/public/ai-paladin.svg`). When it deploys, switch it to `"kind": "app"`
      with its real subdomain and declared favicon.
- [ ] `America_TwoDotZero` and `Guilds` still declare Flutter's default favicon on their own sites —
      replace `web/favicon.png` + `web/icons/` in those repos (web-os picks it up automatically).
- [ ] Slots 8, 9 still empty

See [[Architecture/Overview]] for how these pieces are meant to fit together, and
[[Decisions/2026-07-13 - Architecture Decisions]] / [[Decisions/2026-07-13b - Adopt robertcoffman hero scene]] /
[[Decisions/2026-08-06 - flutter_shell implementation]] for why they're scoped this way.
