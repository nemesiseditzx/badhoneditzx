# BADHON EDITZX — Personal Portfolio

A bilingual (English/Bangla), responsive personal portfolio built from scratch with plain HTML, CSS and JavaScript. No framework or build step is required.

## Included
- Responsive desktop, tablet and mobile layouts
- English/Bangla language switch
- Animated hero, scroll reveal, scroll progress and mobile navigation
- Badhon EditZX brand artwork and cinematic silhouette visual
- About, creative interests, journey, selected projects, sports and contact sections
- Six unique YouTube video links and GrabZone project link
- Optional secure YouTube channel statistics API using a Cloudflare Worker
- Reduced-motion accessibility support

## Run locally
From this folder, run any static server. For example:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Configure live YouTube statistics
The site initially shows the last subscriber count provided (933). It does not pretend that this is live data. To enable live stats:

1. Create a YouTube Data API v3 key in Google Cloud Console and restrict it to the YouTube Data API v3.
2. Install Wrangler and log in to Cloudflare.
3. From the `worker` directory, set the API key as a secret:

   ```bash
   npx wrangler secret put YOUTUBE_API_KEY
   ```

4. Deploy the Worker:

   ```bash
   npx wrangler deploy
   ```

5. In `app.js`, set `window.BADHON_STATS_ENDPOINT` before the app script is loaded, using your deployed Worker URL. For example, add this in `index.html` immediately before `<script src="app.js"></script>`:

   ```html
   <script>window.BADHON_STATS_ENDPOINT = 'https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev';</script>
   ```

6. Update `ALLOWED_ORIGIN` in `worker/wrangler.toml` to your actual production domain. If you are testing locally, temporarily use `*`, then restrict it again for production.

The Worker caches successful results for approximately five minutes. YouTube may round public subscriber counts; the API does not guarantee an exact displayed count.

## Deploy the website
Upload the contents of this folder to any static host such as Cloudflare Pages. Connect `badhoneditzx.com` to the hosting provider only after confirming domain ownership and DNS settings. No DNS changes are made by this project.

## Before public launch
- Confirm the displayed name, biography and project descriptions.
- Replace the generated silhouette with a real video/photo only if desired.
- Confirm all YouTube video links and choose preferred display order.
- Configure the live stats Worker and test it on the final domain.
- Add a privacy notice if analytics, cookies, or third-party tracking are introduced.
