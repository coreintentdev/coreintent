# ZynRip first — then build

**Rule:** Run ZynRip (organize + MAP) on the machine where your real files live **before** asking an agent to “build the tool” or redesign flows. ZynRip surfaces paths, scans, handovers, and audio in one tree; the agent reads the MAP and stops guessing.

## Why

- Agents in the cloud **cannot see your Desktop or registrar exports**.
- Building on empty context wastes cycles and repeats arguments (e.g. domain counts vs what’s in code).
- After `ZYNRIP_MAP_*.md` exists, paste the map path (or the first 200 lines) into the session — that *is* the inventory pass.

## Order of operations

1. **Pull repo** (get `scripts/zynrip-organize.sh` v3).
2. **Dry-run:** `bash scripts/zynrip-organize.sh` (or set `--desktop` on Windows Git Bash).
3. **Review** printed `DRY:` lines.
4. **Apply:** `bash scripts/zynrip-organize.sh --apply --yes`
5. **Open** `ZYNTHIO_MASTER/MAP/ZYNRIP_MAP_<timestamp>.md` and feed it to the next agent turn.
6. **Then** build: APIs, Commander commands, domain JSON sync, deploy — using paths and filenames from the map.

## Cross-platform

- macOS / Linux: auto-detects `~/Desktop` when present.
- Windows: Git Bash or WSL; pass `--desktop "$USERPROFILE/Desktop"` if needed.
- Extra music roots: `--music "D:/Music"` or `ZYNRIP_MUSIC_DIRS=/path/one:/path/two`.

## Commander (web terminal)

The in-app “AI pro” shell is **CoreIntent Commander** in `components/Terminal.tsx`. It consumes APIs; it does not replace ZynRip on disk. ZynRip = **file reality**; Commander = **control surface** after reality is mapped.
