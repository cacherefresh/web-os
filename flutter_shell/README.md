# flutter_shell

Thin distribution wrapper around the hosted web-os experience at `web-os.cacherefresh.io`. This is
**not** where the Three.js scene lives — see [web/](../web) for that, and
[vault/Architecture/Overview.md](../vault/Architecture/Overview.md) for the full rationale.

## Modules

- `app/` — the Flutter application itself: routing, splash screen, permissions, app-store shell.
- `packages/webos_webview/` — an isolated Flutter package wrapping the WebView (and any native
  bridging: deep links, push notifications) so it's testable independently of `app/`.

## Status

Scaffolding only — `pubspec.yaml` stubs, no implementation yet. See
[vault/Roadmap.md](../vault/Roadmap.md).
