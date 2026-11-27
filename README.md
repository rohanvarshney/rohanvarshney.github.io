# rohanvarshney.github.io

Personal website and ROVA music portfolio hosted on GitHub Pages at [rohanvarshney.github.io](https://rohanvarshney.github.io). Built with static HTML, CSS, and vanilla JavaScript—no build step or runtime dependencies.

## Pages

- `/` (`index.html`) — Home & links
- `/dj/` (`dj/index.html`) — DJ ROVA bookings & press kit
- `/production/` (`production/index.html`) — ROVA production portfolio & audio player
- `/raas/` (`raas/index.html`) — RAS XII–XV archive & resources

## Adding Audio Tracks

1. Drop `.mp3` files into `assets/audio/mashups/` (subfolders `western/`, `indo-western-fusion/`, `desi/` sync to `production/index.html`; `raas/` syncs to `raas/index.html`), `assets/audio/remixes/`, or `assets/audio/performances/`.
2. Run the sync script (uses macOS `afinfo` and `afconvert`) to extract durations, compute 80-bar waveform peaks, and update `production/index.html` and `raas/index.html`:

```bash
node scripts/sync-audio-releases.js
```

## Tests

```bash
node --test tests/index.test.js
```
