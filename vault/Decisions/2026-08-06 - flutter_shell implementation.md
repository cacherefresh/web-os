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

**Verification done vs. not done:** `flutter pub get` and `flutter analyze` both pass clean in this
environment (Flutter 3.44.8 is installed here, unlike the Node.js situation for `web/`). Neither
`flutter build apk` nor `flutter build ios` were run — no Android SDK or full Xcode toolchain is
installed in this environment (`flutter doctor` confirms both are missing/incomplete). So: the Dart
compiles and type-checks, but an actual device/simulator build has **not** been verified. Do that
before shipping.

**How to apply:** When adding native bridging (deep links, push notifications) mentioned in
[[../Architecture/Overview]], extend `WebOsWebView`'s `NavigationDelegate` callbacks in
`webos_webview` rather than adding logic to `webos_app`'s `main.dart` — keep the app module as thin
as the name implies.
