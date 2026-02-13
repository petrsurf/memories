# Project Handoff Notes

Last updated: 2026-02-13

## Current live URL
- https://petrsurf.github.io/memories/

## Last completed work
- Moved `5047`, `5048`, `5052` media from `port-lincoln` to `blue-mountains`.
- Re-deployed GitHub Pages after media/manifest updates.
- Verified `port-lincoln` no longer contains `5047/5048/5052`.

## Important behavior implemented
- Hero card:
  - `clear hero` now truly clears and can show empty state.
  - Hero source uses selected album media only (no stale fallback image bleed).
  - Hero click opens hero-source media set, not random global gallery.
- Gallery/album UX:
  - Clicking a gallery tile jumps to and highlights the matching album card.
  - Move flow improved to select target album and scroll there after move.
- Upload editor:
  - Upload dropdown limited to albums that currently have media.
  - Added `clean local db + reload` in edit mode.

## Media source of truth
- Import config: `scripts/media-imports.json`
- Import command (clean re-import): `npm run media:import`
- Validation command: `npm run media:check`
- Manifest: `public/media/uploads/manifest.json`

## Known gotcha
- Browser local storage can override visible state.
- If local/live looks inconsistent, use:
  - edit mode -> `clean local db + reload`
  - hard refresh (`Ctrl+Shift+R`)

## Resume checklist
1. `git pull --ff-only origin main`
2. `npm run media:check`
3. `npm run dev`
4. If UI mismatch: `clean local db + reload`
