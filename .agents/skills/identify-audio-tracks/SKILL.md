---
name: identify-audio-tracks
description: >-
  Identify songs, stems, and artists inside .mp3 mashups, remixes, and
  performance mixes under assets/audio/, present an aggregated review table for
  user sign-off, and enrich release card metadata in scripts/sync-audio-releases.js.
  Use when the user adds new audio files, asks to identify songs in tracks, or
  wants to update track credits and descriptions.
---

# Identify Audio Tracks & Enrich Release Metadata

Multimodal workflow for auditing `.mp3` files in `assets/audio/`, identifying all source songs and artists, getting user sign-off, and syncing enriched descriptions into `production/index.html` and `raas/index.html`.

## Steps

1. **Find target tracks**
   - List all `.mp3` files under `assets/audio/` (`find assets/audio -name '*.mp3' | sort`) and compare against `CURATED_TRACKS` in `scripts/sync-audio-releases.js`.
   - Default to new or uncurated tracks unless the user explicitly asks for a full re-audit.

2. **Listen in parallel batches**
   - Split target `.mp3` files into batches of 4–6 tracks and invoke parallel `research` subagents (`Model: "inherit"`) so binary audio does not overflow the main context window.
   - Instruct each subagent to:
     - Call `read_file` on each `.mp3` file and listen from start to finish.
     - Identify every song used (vocals, instrumentals, drops, and samples) along with primary artist(s).
     - Verify exact song titles and artists via `search_web` when needed.
     - Report confidence (`High`, `Medium`, `Low`) per item and explicitly flag anything uncertain rather than guessing.

3. **Present review table before editing**
   - Aggregate all subagent findings into grouped markdown tables (`Mashups — Pure USA`, `Mashups — Fusion`, `Mashups — Pure Desi`, `Mashups — Raas`, `Remixes`, `Performances`).
   - Include a top checklist highlighting any `Low`/`Medium` confidence items, unidentified backing instrumentals, or unconfirmed regional/traditional recording artists.
   - Pause for the user to confirm or correct before editing `scripts/sync-audio-releases.js`.

4. **Update `CURATED_TRACKS` metadata**
   - Update `CURATED_TRACKS` in `scripts/sync-audio-releases.js` using the repo's formatting conventions:
     - **Mashups:** `Song A (Artist A) × Song B (Artist B)` (or `Song A × Song B (Shared Artist)` when both tracks share the same artist).
     - **Remixes / Performances:** `Song (Artist) · Edit/Routine Label`
     - Use ASCII `-` in duo/trio names (`Vishal-Shekhar`, `Sachin-Jigar`) and Unicode `×` / `·` (HTML-escaped automatically by `escapeHtml` during sync).

5. **Sync HTML & verify**
   - Run `node scripts/sync-audio-releases.js` to extract durations, compute 80-bar waveform peaks, and update `production/index.html` and `raas/index.html`.
   - If `.mp3` files were added, removed, or moved between `raas/` and production folders, update the expected track count assertions in `tests/index.test.js`.
   - Run `node tests/index.test.js` and confirm all tests pass.
