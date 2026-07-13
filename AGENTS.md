# AGENTS.md — web-os

Instructions for any AI coding agent (Claude Code, or otherwise) working in this repository.

## What this repo is

`web-os` is the top-level "operating system" shell for a personal ecosystem of apps. It is a
phone-sized web page, hosted at `web-os.cacherefresh.io`, that renders a futuristic Three.js scene:
up to 9 app "screens" orbiting a center point (like a person standing in the middle of 9 floating
displays). Each screen represents one independent app that lives in its **own** GitHub repo, deployed
to its own subdomain (`<reponame>.cacherefresh.io` via CNAME). web-os does not contain app source —
it links out to them and shows a live favicon + mini preview for each.

A thin Flutter wrapper packages the hosted web app for mobile/desktop distribution.

## Original vision (as given by the project owner, 2026-07-13)

> I want this in threejs very futuristic with a border around each app circling around a center
> person, like there are 9 display screens, and they can move or click on a screen to then open
> that app. At the top there should always be a purple menu that has Home and About, and a left
> hover — a menu that slides out from the left side — where they can pick any of the apps. It
> should show the app name, which is the repo name.
>
> So either they can have a menu slide in from the right for navigation, or click on the Three.js
> spinning windows that show a mini version of navigating to each website, across the 9 different
> viewports.
>
> This web-os should look like a phone-sized webpage with up to 9 apps for now, each with an icon
> pulled from the nested repo as the favicon.
>
> I'm building a repo that will have nested repos: this repo is the main top-level repo, like a web
> operating system, that has a screen with various apps — and each app is yet another repo on
> GitHub. I have my own domain, and each repo will have a CNAME pointed at
> `<reponame>.cacherefresh.io`. This repo should be hosted at `web-os.cacherefresh.io`.
>
> This should be done as a Flutter wrapper with separate modules.

## Author context

The project owner is a 20-year full-stack developer, strong in Node.js, HTML5, the Web Audio API,
and Three.js. Flutter/Dart is a newer tool being used specifically as a distribution shell, not the
primary UI framework — do not push Dart-first patterns onto the core scene/rendering logic. Default
to idiomatic modern JS (ESM, Vite) for anything in `web/`.

## Architecture decisions (locked in — see `vault/Decisions/` for full rationale)

1. **Flutter is a thin app shell, not the renderer.** The Three.js scene is a normal web app in
   `web/`, hosted standalone at `web-os.cacherefresh.io`. `flutter_shell/` wraps that hosted URL in
   a WebView for native app-store distribution. Do not attempt to port the Three.js scene into
   Flutter widgets or Flutter Web canvas.
2. **Apps are linked, not vendored.** The 9 app repos are never checked into this repo (no
   submodules). web-os only knows each app's subdomain URL and fetches its `favicon.ico` at
   render/build time for the icon. Opening an app means navigating to (or iframing) its live
   subdomain.
3. **Project memory lives in `vault/`**, an Obsidian-vault-formatted folder checked into this repo.
   Open it directly in Obsidian for human editing. Agents should read `vault/Home.md` first when
   they need project context beyond what's in this file.
4. **`web/` is Next.js + React Three Fiber, not vanilla Three.js/Vite.** Reversed from the initial
   scaffolding pass after finding `github.com/cacherefresh/robertcoffman` (the owner's personal site,
   deployed the same way — static export + custom-domain CNAME on GitHub Pages) already has a
   production-quality implementation of exactly this pattern: a center hero `Figure`, holographic
   `ScreenPanel`s on an orbit ring, particle field, camera rig, bloom/vignette post-processing. `web/`
   ports and adapts those components directly rather than rebuilding the same thing in vanilla
   Three.js. Static-export to GitHub Pages (`next build` with `GITHUB_PAGES=true`) is the deploy
   target, matching robertcoffman's proven `next.config.ts` pattern.

## Repo structure

```
web-os/
├── AGENTS.md              # this file
├── vault/                 # Obsidian vault — architecture notes, decisions, app registry, roadmap
├── web/                   # Next.js + React Three Fiber app, hosted at web-os.cacherefresh.io
│   ├── src/app/            # Next.js app router: layout, globals.css, page.tsx
│   ├── src/components/scene/  # R3F scene: Figure (center hero), OrbitingScreens, ScreenPanel,
│   │                           # ParticleField, CameraRig, holographic shader material
│   ├── src/components/ui/     # TopMenu (purple bar), AppDrawer (left-hover + right-slide nav), AboutModal
│   ├── src/data/apps.ts       # typed accessor over the registry below
│   ├── src/config/apps.json   # the 9-app registry (name, repo, subdomain, favicon, status)
│   └── public/                 # CNAME (web-os.cacherefresh.io), .nojekyll
├── flutter_shell/         # Flutter wrapper, split into separate modules
│   ├── app/                # main Flutter application (thin shell)
│   └── packages/webos_webview/  # module that loads web-os.cacherefresh.io in a WebView
└── .claude/skills/         # project-local Claude Skills
```

## Adding a new app to the grid

Each of the 9 slots in `web/src/config/apps.json` needs: `name` (repo name, shown in the nav), `repo`
(GitHub `owner/name`), `subdomain`/`url` (`https://<reponame>.cacherefresh.io`), and `faviconUrl`
(`<url>/favicon.ico`). The new app repo itself needs a `CNAME` file containing
`<reponame>.cacherefresh.io` for GitHub Pages (or equivalent) to route correctly. There is a
`add-app` Claude Skill in `.claude/skills/add-app/` that automates registering a slot — prefer it
over hand-editing when a human asks to "add an app."

## Conventions for agents

- Keep `web/` dependency-light and framework-agnostic where reasonable (Vite + Three.js, vanilla JS
  modules) — this matches the owner's existing stack and keeps the WebView payload small.
- Treat each app repo as a black box reached only by URL. Never assume access to its source from
  within this repo.
- When you make a non-obvious architectural call, add a dated note under `vault/Decisions/` (same
  format as the existing entries) so future sessions — human or agent — know why.
- Update `vault/Roadmap.md` when scaffolding items get implemented so it stays a true source of
  "what's actually built" rather than drifting into aspiration.
