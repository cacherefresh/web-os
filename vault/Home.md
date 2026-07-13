---
tags: [moc]
---

# web-os vault

Project knowledge base for **web-os** — the phone-sized, Three.js "operating system" screen that
hosts up to 9 independent apps, each its own GitHub repo on its own `*.cacherefresh.io` subdomain.

Open this folder directly as an Obsidian vault. It is the canonical source of project context for
both humans and AI agents — see [[../AGENTS.md|AGENTS.md]] in the repo root for the agent-facing
entry point, which links back here.

## Map of contents

- [[Architecture/Overview]] — how `web/`, `flutter_shell/`, and the app repos fit together
- [[Decisions/2026-07-13 - Architecture Decisions]] — why Flutter-as-shell, link-out apps, etc.
- [[Apps/App Registry]] — the 9 app slots: name, repo, subdomain, status
- [[Roadmap]] — what's built vs. still aspirational

## Quick facts

- Hosted at `web-os.cacherefresh.io`
- Owner: 20-year full-stack dev (Node.js, HTML5, Web Audio API, Three.js); Flutter is new, used only
  as a distribution shell
- Current state: bare scaffolding — see [[Roadmap]]
