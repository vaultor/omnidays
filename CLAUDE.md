# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this plugin does

OmniDays is an Obsidian plugin that renders `omnidays` code blocks, displaying the number of days since or until a specified date. Example usage in a note:

````
```omnidays
date: 2025-01-01
```
````

## Commands

```bash
pnpm dev          # Watch mode (Vite Plus, development build)
pnpm build        # Production build
pnpm run version  # Bump version: updates manifest.json + versions.json, then git adds them
pnpm prepare      # Run vp config (vite-plus setup)
```

No test framework is configured.

## Build system

Uses **vite-plus** (`vp` CLI), a wrapper around Vite that bundles TypeScript, runs type-aware ESLint, and handles formatting. Configuration lives in `vite.config.ts`.

- Output: `main.js` (CJS bundle) + `styles.css` — both in the repo root, which is where Obsidian loads them from
- `obsidian`, `electron`, all Node builtins, and CodeMirror packages are marked external (Obsidian provides them at runtime)
- Pre-commit lint hook lives at `.vite-hooks/pre-commit`
- Editor formatting uses Oxc (not Prettier); see `.vscode/settings.json`

## Architecture

The plugin follows the standard Obsidian plugin structure:

- **`src/main.ts`** — Plugin entry point. Extends `Plugin`. `onload()` registers everything; `onunload()` handles cleanup.
- **`src/settings.ts`** — `PluginSettings` interface + `SampleSettingTab` (Obsidian's `PluginSettingTab` subclass). Settings are persisted via `this.loadData()` / `this.saveData()` in `main.ts`.

To register the `omnidays` code block processor, use `this.registerMarkdownCodeBlockProcessor('omnidays', ...)` in `onload()`. The callback receives `(source, el, ctx)` — `source` is the raw code block text, `el` is the container element to render into.

## Obsidian API notes

- Import everything from `'obsidian'` — it's available at runtime and marked external in the build
- `manifest.json` drives what Obsidian shows in the plugin list; `versions.json` maps plugin versions to minimum Obsidian app versions (used by the community plugin registry)
- `minAppVersion` in `manifest.json` is currently `1.12.0`
