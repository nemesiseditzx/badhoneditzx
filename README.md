# BADHON EDITZX — Personal Portfolio

Bilingual (English/Bangla), responsive personal portfolio for Md Mahim Badhon.

## Deploy on Netlify
This repository is configured to publish the repository root. The root contains `index.html`, `styles.css`, `app.js`, and `assets/`.
- Build command: leave empty
- Publish directory: `.`
- Base directory: leave empty

No build step is required. Netlify can deploy this as a static site.

## Local preview
Run `python -m http.server 5173` from the repository root and open http://localhost:5173.

## Current channel statistics
The site displays 933 subscribers as a manually supplied figure. It is not live API data. Views and video totals remain unreported until verified.

## Optional future YouTube API
A Cloudflare Worker is included in `worker/`. To enable it later, configure the `YOUTUBE_API_KEY` secret in Cloudflare, deploy the Worker, and set `window.BADHON_STATS_ENDPOINT` in `index.html`. Never place API keys in public frontend files.

## Project structure
- `index.html` — website markup
- `styles.css` — responsive visual design
- `app.js` — navigation, language switch, reveal animations and optional stats fetch
- `assets/` — logo and cinematic hero artwork
- `worker/` — optional secure YouTube statistics proxy
