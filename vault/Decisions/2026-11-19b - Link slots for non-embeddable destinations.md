---
tags: [decision]
date: 2026-11-19
---

# Link slots for non-embeddable destinations

## Context

The owner wanted a donate slot that goes to their Cash App (`cash.app/$cacherefresh`), in slot 7
specifically ("lucky number 7"), with a Cash App–style "Donate" icon. Cash App sends
`X-Frame-Options: DENY`, so it can't load in the preview or the app frame the way every other slot
does (decision 5 in `AGENTS.md`).

## Decision

- A slot can be `"kind": "link"` in `apps.json` (default `"app"`). Link slots have no repo. They
  have a `caption` for the second line and a local icon (`web/public/cashapp-donate.svg`).
- Selecting one opens its URL in a new tab and never becomes the selection or loads in the frame.
  The drawer and the 3D ring both behave this way, and the owner picked it over a donate panel
  with a QR code.
- The 3D ring skips its 600ms camera flight for link slots and opens the tab inside the click.
  Opening it from the flight timer would get it popup-blocked, especially on Safari and iOS.
- Link slots never compete for the drawer's one live iframe. Their preview is just the big icon.

## Notes

The icon is a hand-made SVG in Cash App's green with a `$` and "DONATE". It is not Cash App's
official asset. Swap in the official mark or the owner's Cash App QR code by replacing that file.
