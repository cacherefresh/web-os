---
name: add-app
description: Register a new app repo into an empty slot on the web-os grid (up to 9 slots). Use when the user asks to "add an app", "register a new app", or "fill a slot" in this repo.
---

# add-app

Registers one GitHub repo as an app on the web-os grid. web-os never vendors app source — this
skill only wires up metadata (see `vault/Decisions/2026-07-13 - Architecture Decisions.md`, decision
2).

## Inputs needed from the user

- GitHub repo, as `owner/name` (the repo `name` becomes the app's display name — it must be the
  literal repo name, not a nickname)
- Confirmation the target repo has a `CNAME` file containing `<name>.cacherefresh.io` (if it
  doesn't, tell the user to add one — you can offer to do it if you have access to that repo)

## Steps

1. Read `web/src/config/apps.json`. Find the first slot with `"status": "empty"`. If all 9 slots are
   filled, stop and tell the user the grid is full — don't silently overwrite a slot.
2. Fill that slot's fields:
   - `name`: the repo name exactly as it appears on GitHub
   - `repo`: `owner/name`
   - `url`: `https://<name>.cacherefresh.io`
   - `faviconUrl`: `https://<name>.cacherefresh.io/favicon.ico`
   - `status`: `"active"`
3. Update the matching row in `vault/Apps/App Registry.md` (same slot number) so the table and the
   JSON stay in sync — fill in Name, GitHub repo, Subdomain, and set Status to `active`.
4. Report back which slot number was used and the final `url`/`faviconUrl`, and remind the user to
   verify the target repo actually serves a favicon at that path (a 404 there means a broken icon on
   the grid).

## Out of scope

Do not create or modify anything inside the app's own repo (other than advising on the CNAME file if
asked). Do not touch `flutter_shell/` — the app grid is purely a `web/` + `vault/` concern.
