---
tags: [decision]
date: 2026-07-13
---

# Architecture Decisions — 2026-07-13

Decisions locked in during initial scaffolding, made explicitly with the project owner before any
code was written.

## 1. Flutter is a thin shell, Three.js is the renderer

**Decision:** The Three.js scene lives in `web/` as a standalone web app hosted at
`web-os.cacherefresh.io`. `flutter_shell/` only wraps that hosted URL in a WebView for app-store
distribution.

**Why:** Three.js/WebGL only runs in a JS context; there's no native Dart equivalent. The owner's
deep strength is JS/Node/Three.js, not Dart. Embedding Three.js inside Flutter Web (via
HtmlElementView) was considered and rejected — more plumbing, no real benefit, and it would fight
the owner's existing skill set.

**How to apply:** Never propose reimplementing scene logic in Dart. `flutter_shell/` changes should
stay scoped to native concerns (WebView config, deep links, push, splash/permissions) — see
[[../Architecture/Overview]].

## 2. Apps are linked by URL, not vendored into this repo

**Decision:** The 9 app repos stay fully independent. `web-os` stores only `name`, `repo`, `url`,
`faviconUrl` per app in `web/src/config/apps.json`. No git submodules.

**Why:** Each app already deploys independently to its own `<reponame>.cacherefresh.io` subdomain.
Vendoring source would couple deploys and add repo bloat for no benefit — the whole point of the
CNAME-per-app setup is independence.

**How to apply:** Any "add an app" work only ever touches the registry (`apps.json` /
[[../Apps/App Registry]]) plus the new app's own `CNAME` file — never this repo's git history for
the app's source.

## 3. Obsidian vault, not an external memory tool, holds project knowledge

**Decision:** `vault/` is checked into this repo and formatted for Obsidian (wikilinks, tags,
folders). It is the canonical, human-editable source of architecture/decision/roadmap context.

**Why:** The owner wants project memory portable and human-readable in Obsidian directly, not locked
inside an AI tool's private memory store.

**How to apply:** Agents should read [[../Home]] first for context beyond `AGENTS.md`, and add new
decisions here (dated, same template as this note) rather than only summarizing them in chat.

## 4. First pass ships scaffolding only

**Decision:** This initial pass creates directory structure, config stubs, `AGENTS.md`, and the
vault — not a working Three.js scene, purple menu, slide-out nav, or Flutter WebView screen.

**Why:** The full UI (orbiting screens, center avatar, purple top bar, dual nav patterns, favicon
fetching) is a substantial build; the owner asked for scaffolding first so the architecture is
agreed before investing in the 3D scene.

**How to apply:** See [[../Roadmap]] for what's actually implemented vs. still open. Don't assume
UI described in `AGENTS.md`'s "Original vision" section exists yet — check the code.
