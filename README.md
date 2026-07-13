# web-os

A phone-sized, futuristic Three.js "operating system" screen — up to 9 apps orbiting a center
point, each its own independent GitHub repo hosted at `<reponame>.cacherefresh.io`. This repo itself
is hosted at `web-os.cacherefresh.io`.

Start here:

- **[AGENTS.md](AGENTS.md)** — full project vision and conventions for AI coding agents
- **[vault/Home.md](vault/Home.md)** — Obsidian vault with architecture notes, decisions, the app
  registry, and the roadmap (open `vault/` directly in Obsidian)

## Layout

```
web/            core Three.js web app (hosted standalone at web-os.cacherefresh.io)
flutter_shell/  thin Flutter WebView wrapper for app-store distribution, split into modules
vault/          Obsidian vault — project memory, kept in sync with AGENTS.md
.claude/skills/ project-local Claude Skills (e.g. add-app)
```

## Status

Scaffolding stage — see [vault/Roadmap.md](vault/Roadmap.md) for what's built vs. still open.
