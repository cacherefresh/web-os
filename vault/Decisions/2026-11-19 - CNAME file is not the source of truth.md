---
tags: [decision]
date: 2026-11-19
---

# CNAME file is not the source of truth for an app's subdomain

## Context

`AGENTS.md`, the `add-app` skill, and the App Registry all told agents to read each app's subdomain
from the `CNAME` file in its repo. Registering `InsulinPlant` and `America_TwoDotZero` showed that
this doesn't hold:

- `InsulinPlant` has no `CNAME` file, but `insulinplant.cacherefresh.io` serves fine.
- `America_TwoDotZero`'s root `CNAME` says bare `cacherefresh.io`, but the site serves at
  `america2dot0.cacherefresh.io`.
- `Guilds` has no file either, and works.

All five registered app repos (and web-os itself) deploy through GitHub Actions
(`actions/upload-pages-artifact` + `actions/deploy-pages`). With that deploy method GitHub ignores
the `CNAME` file and takes the custom domain from the repo's **Settings → Pages**.

## How the pieces fit

1. **GoDaddy DNS CNAME record** (`<sub>` → `cacherefresh.github.io`) sends traffic to GitHub Pages.
   This one is required.
2. **Settings → Pages → Custom domain** tells GitHub which repo answers for that hostname. This one
   is also required.
3. **`CNAME` file in the repo** is just another way to set (2). It's only read by branch-based Pages
   deploys, where a deploy whose output lacks it can clear the custom domain.

## Decision

Verify an app's subdomain against the live site (HTTP 200), corroborated by the owner, the repo's
homepage field, or its deploy workflow. Record the file's presence or contents only as information.
Flag a missing or wrong file only when the repo deploys from a branch.
