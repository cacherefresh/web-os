# web/

Next.js + React Three Fiber app — the actual web-os experience, hosted at
`web-os.cacherefresh.io`. Scene layer adapted from
[cacherefresh/robertcoffman](https://github.com/cacherefresh/robertcoffman); see
[vault/Decisions/2026-07-13b - Adopt robertcoffman hero scene.md](../vault/Decisions/2026-07-13b%20-%20Adopt%20robertcoffman%20hero%20scene.md).

```
npm install
npm run dev      # local dev server
npm run build:pages   # static export for GitHub Pages (sets GITHUB_PAGES=true)
```

This has not yet been run in this environment (no Node.js installed here) — run `npm install && npm
run dev` locally and sanity-check before relying on it.

## Layout

- `src/app/` — Next.js App Router: layout, global styles, the single page
- `src/components/scene/` — the R3F scene: center `Figure`, `OrbitingScreens`/`ScreenPanel`s,
  `ParticleField`, `CameraRig`, holographic shader material
- `src/components/ui/` — DOM chrome: purple `TopMenu`, `AppDrawer` (left-hover + right-slide, same
  component), `AboutModal`
- `src/config/apps.json` — the 9-slot app registry (edit via the `add-app` Claude Skill)
- `src/data/apps.ts` — typed accessor over the registry, assigns per-slot accent colors
