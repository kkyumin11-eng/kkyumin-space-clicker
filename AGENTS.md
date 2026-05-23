# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Stardust Clicker is a zero-dependency, static single-page web app (incremental/idle clicker game with a space theme). The entire codebase is 3 files: `index.html`, `script.js`, `style.css`. No build tools, package managers, frameworks, or external dependencies exist.

### Running the dev server

Serve the workspace root via any static HTTP server:

```
python3 -m http.server 8080 --directory /workspace
```

Then open `http://localhost:8080/` in a browser.

### Lint / Test / Build

- **No linter** is configured in the repo.
- **No automated tests** exist.
- **No build step** is needed — the app is plain HTML/CSS/JS served as-is.

### Notes

- The UI is entirely in Korean.
- Game state is persisted via `localStorage` (key: `stardust-clicker-save-v2`).
- Audio uses the Web Audio API; no external audio files are required.
