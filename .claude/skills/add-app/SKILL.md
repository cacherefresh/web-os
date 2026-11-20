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
- **Do not assume the subdomain matches the repo name** — `repo` and `url` are independent fields.
  `cacherefresh/YuVi_Rays` deploys to `yuvi-rays-dvs.cacherefresh.io`, not `yuvi_rays.cacherefresh.io`.
  Verify the subdomain against the **live site**: `curl -s -o /dev/null -w '%{http_code}'
  https://<subdomain>.cacherefresh.io` must return 200. Corroborate which repo it belongs to from the
  repo's homepage field, a comment/config in its deploy workflow, or the user's word.
- **Do not use the repo's `CNAME` file as the source of truth.** App repos here deploy with
  `actions/deploy-pages`, which ignores that file — the domain is set in the repo's Settings → Pages.
  The file may be missing or contain the wrong value while the site works fine (e.g.
  `America_TwoDotZero`'s says bare `cacherefresh.io`). Only if a repo deploys *from a branch*
  (e.g. `peaceiris/actions-gh-pages` or a `gh-pages` branch) does the file matter — then the
  published output must contain it, or a deploy can clear the custom domain. Mention that to the user
  if you see it.
- **Use the icon the site's own HTML declares** — read the `<link rel="icon">` /
  `<link rel="apple-touch-icon">` tags from the live page (`curl -sL <url> | grep -io '<link[^>]*icon[^>]*>'`)
  and prefer the largest PNG (usually `apple-touch-icon`, 180px — it stays sharp in the 3D panel).
  **Don't probe `/favicon.png` and stop when it returns 200:** Flutter web builds always ship the
  default Flutter-logo `favicon.png` (917 bytes) at the root even when the app declares a custom icon
  elsewhere — that's how `YuVi_Rays` ended up showing the Flutter logo instead of its dove. Look at
  the image before registering it.
- **The site must be iframe-embeddable.** web-os embeds each app — both as a live preview in the app
  rail and full-size in the app frame — so a site that sends `X-Frame-Options` or a CSP
  `frame-ancestors` directive renders blank in both places. Check before registering:
  `curl -sI -L https://<subdomain>.cacherefresh.io | grep -i -E 'x-frame-options|content-security-policy'`
  should come back empty. GitHub Pages sets neither by default, so this normally passes; if it
  doesn't, tell the user the app will need those headers relaxed to appear in the grid.

## Steps

1. Read `web/src/config/apps.json`. Find the first slot with `"status": "empty"`. If all 9 slots are
   filled, stop and tell the user the grid is full — don't silently overwrite a slot.
2. Fill that slot's fields:
   - `name`: the repo name exactly as it appears on GitHub
   - `repo`: `owner/name`
   - `url`: `https://<verified-subdomain>.cacherefresh.io` (verified live, not derived from the repo
     name)
   - `faviconUrl`: `<url>/<actual favicon filename>` (verify the extension, don't assume `.ico`)
   - `status`: `"active"`
3. Update the matching row in `vault/Apps/App Registry.md` (same slot number) so the table and the
   JSON stay in sync — fill in Name, GitHub repo, Subdomain, and set Status to `active`. Note in the
   table how the subdomain was verified (live 200 + homepage field / deploy workflow / user's word).
4. Report back which slot number was used and the final `url`/`faviconUrl`, and remind the user to
   verify the target repo actually serves a favicon at that path (a 404 there means a broken icon on
   the grid).

## Link slots

If the destination isn't an app repo and can't be framed (e.g. a payment page), it can still take a
slot as `"kind": "link"` with a `caption` and a local icon in `web/public/` — it opens in a new tab.
Slot 7 (Cash App donate) is the example. Don't overwrite it as if it were empty.

## Out of scope

Do not create or modify anything inside the app's own repo (other than advising on its Pages custom-domain
setting if asked). Do not touch `flutter_shell/` — the app grid is purely a `web/` + `vault/` concern.
