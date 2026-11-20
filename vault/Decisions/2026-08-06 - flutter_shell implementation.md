---
tags: [decision]
date: 2026-08-06
---

# Decision — flutter_shell implemented; scoped to Android + iOS for now

**Decision:** `flutter_shell/app` and `flutter_shell/packages/webos_webview` are real, buildable
Flutter code now, not just `pubspec.yaml` stubs. `webos_webview` wraps the official
[`webview_flutter`](https://pub.dev/packages/webview_flutter) plugin in a `WebOsWebView` widget
(loading spinner, retry-on-error), and `webos_app`'s `main.dart` is a one-screen `MaterialApp` that
renders it full-bleed, pointed at `https://web-os.cacherefresh.io`. Platform folders (`android/`,
`ios/`) were generated via `flutter create` in a scratch dir and transplanted in, rather than
hand-written — that boilerplate is meant to be tool-generated and version-matched to the installed
Flutter SDK (3.44.8 stable, checked into `.metadata`).

**Why Android + iOS only, no macOS/Windows/Linux yet:** `webview_flutter` only has official,
first-party platform implementations for Android and iOS (`webview_flutter_android`,
`webview_flutter_wkwebview`). Desktop support isn't first-party — it'd mean pulling in a different,
less-standard plugin per desktop OS. [[../Architecture/Overview]] describes `flutter_shell` as
covering "mobile/desktop distribution," but doing desktop properly deserves its own decision once
it's actually needed, not a bolted-on second WebView plugin chosen under time pressure.

**Correction (2026-08-06, same day): the macOS half of that reasoning is wrong.**
`webview_flutter_wkwebview` covers **iOS *and* macOS** — pub.dev lists both platforms, and this repo
already resolves `webview_flutter_wkwebview 3.26.0` / `webview_flutter 4.14.1` in both lockfiles. So
macOS is first-party today and needs no second plugin: it's a `flutter create --platforms=macos .`
away, generating the missing `macos/` folder the same way `android/`/`ios/` were transplanted in.
Only **Windows and Linux** still require a non-first-party plugin, and that's the part still worth
deferring. Don't cite this note as evidence that macOS is blocked.

**Verification done vs. not done:** `flutter pub get` and `flutter analyze` both pass clean in this
environment (Flutter 3.44.8 is installed here, unlike the Node.js situation for `web/`). Neither
`flutter build apk` nor `flutter build ios` were run — no Android SDK or full Xcode toolchain is
installed in this environment (`flutter doctor` confirms both are missing/incomplete). So: the Dart
compiles and type-checks, but an actual device/simulator build has **not** been verified. Do that
before shipping.

**Navigation containment (added 2026-08-06, after the rail/frame redesign):** `WebOsWebView` now
sets `onNavigationRequest` and wraps itself in a `PopScope`. This is not polish — it closes a way
for the shell to strand its user. Since
[[2026-08-06b - Rail and frame UI redesign]], web-os embeds each app *in place* rather than handing
it to `window.open`, so any outbound link inside an embedded app is a top-level navigation that
would replace the entire shell with a page having no address bar, no nav chrome, and no route back.
Main-frame navigations to a host other than `web-os.cacherefresh.io` are now prevented and handed to
the system browser via `url_launcher` (which is why `android/app/src/main/AndroidManifest.xml` gained
`http`/`https` `<queries>` intents — Android 11+ package visibility, without which the hand-off
silently no-ops). The `PopScope` maps Android's back gesture onto WebView history, falling through to
`SystemNavigator.pop()` only when there's nothing left to go back to.

**The one rule not to break there:** `onNavigationRequest` returns `NavigationDecision.navigate`
immediately for anything with `isMainFrame == false`. Every app preview and the app frame itself is
an iframe pointing at a *different* `*.cacherefresh.io` host — applying the host filter to
sub-frames would blank all nine slots and the main frame with it. If you tighten this logic later,
keep the sub-frame escape hatch first.

**How to apply:** When adding the remaining native bridging (deep links, push notifications)
mentioned in [[../Architecture/Overview]], extend `WebOsWebView`'s `NavigationDelegate` callbacks in
`webos_webview` rather than adding logic to `webos_app`'s `main.dart` — keep the app module as thin
as the name implies.
