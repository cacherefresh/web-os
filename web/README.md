# web/

Next.js + React Three Fiber app — the actual web-os experience, hosted at
`web-os.cacherefresh.io`. Scene layer adapted from
[cacherefresh/robertcoffman](https://github.com/cacherefresh/robertcoffman); see
[vault/Decisions/2026-07-13b - Adopt robertcoffman hero scene.md](../vault/Decisions/2026-07-13b%20-%20Adopt%20robertcoffman%20hero%20scene.md).

```
source ~/.nvm/nvm.sh   # node is under nvm, not on PATH by default
npm install
npm run dev            # local dev server
npm run lint
npm run build:pages    # static export for GitHub Pages (sets GITHUB_PAGES=true)
```

Lint, the static export, and the running app have all been verified — the last against headless
Chromium at phone width (420×860).

## Layout

- `src/app/` — Next.js App Router: layout, global styles, the single page
- `src/components/shell/` — the OS chrome, and where navigation lives:
  - `WebOsShell` — owns `selectedSlot` / `railOpen` / `aboutOpen`
  - `RailTab` → `AppRail` — the ~12px edge sliver that expands into the app drawer
  - `AppList` → `AppListItem` — the 9-slot vertical carousel; mounts exactly one live iframe
  - `AppPreviewFrame` — reusable app embed, `fit="scale"` for thumbnails / `fit="native"` full size
  - `AppFrame` — the selected app, live, in a holographic bezel
- `src/components/scene/` — the R3F Home view and backdrop: center `Figure`,
  `OrbitingScreens`/`ScreenPanel`s, `ParticleField`, `CameraRig`, holographic shader material
- `src/components/ui/` — `AboutModal`
- `src/config/apps.json` — the 9-slot app registry (edit via the `add-app` Claude Skill)
- `src/data/apps.ts` — typed accessor over the registry, assigns per-slot accent colors

Apps are embedded in iframes, so a registered app must not send `X-Frame-Options` or a CSP
`frame-ancestors` directive.
