---
tags: [registry]
---

# App Registry

The 9 slots on the web-os grid. This table is the human-readable mirror of
`web/src/config/apps.json` — keep them in sync (or eventually generate one from the other).

| Slot | Name (repo name) | GitHub repo | Subdomain | Status |
|------|-------------------|-------------|-----------|--------|
| 1    | robertcoffman     | [cacherefresh/robertcoffman](https://github.com/cacherefresh/robertcoffman) | robertcoffman.cacherefresh.io | active |
| 2    | Guilds            | [cacherefresh/Guilds](https://github.com/cacherefresh/Guilds) | guilds.cacherefresh.io | active — **no CNAME file found in the repo** (checked all branches); domain given by owner, not yet verified in-repo |
| 3    | YuVi_Rays         | [cacherefresh/YuVi_Rays](https://github.com/cacherefresh/YuVi_Rays) | yuvi-rays-dvs.cacherefresh.io | active — verified via `web/CNAME` in the repo |
| 4    | —                 | —           | —         | empty  |
| 5    | —                 | —           | —         | empty  |
| 6    | —                 | —           | —         | empty  |
| 7    | —                 | —           | —         | empty  |
| 8    | —                 | —           | —         | empty  |
| 9    | —                 | —           | —         | empty  |

## Conventions per app repo

- **The subdomain does *not* have to match the repo name.** `repo` (GitHub `owner/name`) and `url`
  (the live `https://<subdomain>.cacherefresh.io`) are tracked as two independent fields in
  `apps.json` — e.g. repo `cacherefresh/YuVi_Rays` deploys to `yuvi-rays-dvs.cacherefresh.io`, not
  `yuvi_rays.cacherefresh.io`. Always get the actual subdomain from the repo's own `CNAME` file (or
  the owner directly) — never assume it by transforming the repo name.
- App repo needs a `CNAME` file (wherever its Pages source root is — e.g. `web/CNAME` for a Flutter
  web build, repo root for a static site) containing the exact subdomain it serves.
- App must serve a favicon at its site root — `.ico` or `.png`, whatever the app actually publishes
  (Flutter web's default template ships `favicon.png`; Next.js's default is `favicon.ico`). Check
  before assuming the extension.
- `name` shown in the nav/UI is the literal GitHub repo name (not the subdomain).

Use the `add-app` Claude Skill (`.claude/skills/add-app/`) to fill a slot — it updates this table
and `apps.json` together.
