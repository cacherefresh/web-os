---
tags: [registry]
---

# App Registry

The 9 slots on the web-os grid. This table is the human-readable mirror of
`web/src/config/apps.json` — keep them in sync (or eventually generate one from the other).

| Slot | Name (repo name) | GitHub repo | Subdomain | Status |
|------|-------------------|-------------|-----------|--------|
| 1    | InsulinPlant      | [cacherefresh/InsulinPlant](https://github.com/cacherefresh/InsulinPlant) | insulinplant.cacherefresh.io | active — domain confirmed by the comment in `.github/workflows/ci_deploy.yml` and the live site returning 200; the repo has no CNAME file, so the domain comes from Settings → Pages |
| 2    | AI-Paladin        | [cacherefresh/AI-Paladin](https://github.com/cacherefresh/AI-Paladin) | — (no site yet) | active — temporary `"kind": "link"` to the GitHub repo (GitHub sends `x-frame-options: deny`). Icon is local: `web/public/ai-paladin.svg`. **When the site ships:** set `kind` to `"app"`, `url` to the real subdomain, and `faviconUrl` to its declared icon |
| 3    | America_TwoDotZero | [cacherefresh/America_TwoDotZero](https://github.com/cacherefresh/America_TwoDotZero) | america2dot0.cacherefresh.io | active — confirmed by the repo homepage field and the live site returning 200; the repo-root `CNAME` file says bare `cacherefresh.io`, but the Actions deploy (`actions/deploy-pages`) ignores that file |
| 4    | YuVi_Rays         | [cacherefresh/YuVi_Rays](https://github.com/cacherefresh/YuVi_Rays) | yuvi-rays-dvs.cacherefresh.io | active — live site 200; repo also has a matching `web/CNAME` (informational only — Actions deploy) |
| 5    | Guilds            | [cacherefresh/Guilds](https://github.com/cacherefresh/Guilds) | guilds.cacherefresh.io | active — domain given by owner, live site 200; no CNAME file in the repo, which is fine (Actions deploy, domain set in Settings → Pages) |
| 6    | About Me (repo `robertcoffman`) | [cacherefresh/robertcoffman](https://github.com/cacherefresh/robertcoffman) | robertcoffman.cacherefresh.io | active |
| 7    | Donate (link slot) | — (not a repo) | [cash.app/$cacherefresh](https://cash.app/$cacherefresh) | active — `"kind": "link"`: Cash App sends `X-Frame-Options: DENY`, so it opens in a new tab instead of the frame. Icon is local: `web/public/cashapp-donate.svg`. Slot 7 chosen by owner on purpose |
| 8    | —                 | —           | —         | empty  |
| 9    | —                 | —           | —         | empty  |

## Conventions per app repo

- **The subdomain does *not* have to match the repo name.** `repo` (GitHub `owner/name`) and `url`
  (the live `https://<subdomain>.cacherefresh.io`) are tracked as two independent fields in
  `apps.json` — e.g. repo `cacherefresh/YuVi_Rays` deploys to `yuvi-rays-dvs.cacherefresh.io`, not
  `yuvi_rays.cacherefresh.io`. Verify the subdomain against the live site (200) and the owner or
  the repo's homepage field / deploy workflow — never assume it by transforming the repo name.
- The repo's `CNAME` *file* is **not** required or authoritative. Every app repo here deploys via
  `actions/deploy-pages`, which ignores it; the custom domain is set in the repo's Settings → Pages,
  and routing is the GoDaddy DNS CNAME record → `cacherefresh.github.io`. The file only matters for
  branch-based Pages deploys. See [[../Decisions/2026-11-19 - CNAME file is not the source of truth]].
- `faviconUrl` should be the icon the live page's `<link rel="icon">` / `apple-touch-icon` tags
  declare (largest PNG preferred), not whatever happens to exist at `/favicon.png`. Flutter web builds
  always ship the default Flutter-logo `favicon.png` at the root, even when the app declares a custom
  icon under `icons/favicon/`; that's what made `YuVi_Rays` show the Flutter logo until 2026-11-19.
- `name` shown in the nav/UI is the literal GitHub repo name (not the subdomain) — except for
  **link slots** (`"kind": "link"` in `apps.json`), which aren't app repos: they point at an external
  URL that can't be framed, use `caption` for the second line, and open in a new tab on select.
- Owner-approved display overrides: a slot may set `name` to something other than the repo name
  (slot 6 is "About Me", repo `robertcoffman`), and an optional `tag` replaces the drawer's
  "Slot N" label verbatim in monospace (slot 6: `vm-6 ~/$ whoami`). `repo` always stays
  the real repo.

Use the `add-app` Claude Skill (`.claude/skills/add-app/`) to fill a slot — it updates this table
and `apps.json` together.
