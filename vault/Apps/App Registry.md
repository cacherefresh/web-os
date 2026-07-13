---
tags: [registry]
---

# App Registry

The 9 slots on the web-os grid. This table is the human-readable mirror of
`web/src/config/apps.json` — keep them in sync (or eventually generate one from the other).

| Slot | Name (repo name) | GitHub repo | Subdomain | Status |
|------|-------------------|-------------|-----------|--------|
| 1    | —                 | —           | —         | empty  |
| 2    | —                 | —           | —         | empty  |
| 3    | —                 | —           | —         | empty  |
| 4    | —                 | —           | —         | empty  |
| 5    | —                 | —           | —         | empty  |
| 6    | —                 | —           | —         | empty  |
| 7    | —                 | —           | —         | empty  |
| 8    | —                 | —           | —         | empty  |
| 9    | —                 | —           | —         | empty  |

## Conventions per app repo

- App repo's `CNAME` file contains exactly `<reponame>.cacherefresh.io`.
- App must serve a `favicon.ico` (or `favicon.png`) at its root — this becomes its icon in the
  web-os grid.
- `name` shown in the nav/UI is always the literal GitHub repo name.

Use the `add-app` Claude Skill (`.claude/skills/add-app/`) to fill a slot — it updates this table
and `apps.json` together.
