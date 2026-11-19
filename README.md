# BADHON EDITZX — Personal Portfolio

Bilingual (English/Bangla), responsive personal portfolio for **Md Mahim Badhon**, with the public brand **Badhon EditZX**.

## Public site
The repository root is published as a static Netlify site. No build command is required; publish directory is `.`.

## CMS admin and cinematic intro

The site includes a private editor at `/admin.html`. It can edit brand identity, bilingual hero text, background intro video, intro quote, About copy, featured project, videos, social links, contact email and accent colors. Saved content is served from Cloudflare D1 and loaded by the public website. Intro video uploads are stored in Cloudflare R2.

The cinematic hero video plays muted and loops behind the intro. Below it, a pinned three-chapter scroll sequence transitions through CREATE, BUILD and EXPLORE.

### Cloudflare provisioning (workers.dev, no custom domain required)

The CMS Worker uses the existing Cloudflare Worker service name `badhoneditzx` and the public endpoint:

`https://badhoneditzx.nemesiseditzx984.workers.dev`

1. In the same Cloudflare account, create a **new, separate D1 database** named `badhon-editzx-cms`. Do not reuse any GrabZone database. Copy its database ID into `worker/wrangler.toml`, replacing `REPLACE_WITH_D1_DATABASE_ID`.
2. Create a **new, separate R2 bucket** named `badhon-editzx-media`. Do not reuse `grabzone-assets`.
3. Set `ALLOWED_ORIGINS` in `worker/wrangler.toml` to the exact HTTPS origin of the public portfolio hosting site (for example, the exact `https://<site>.netlify.app` address; no trailing slash). Do not use a wildcard.
4. In Cloudflare's Worker build settings, configure the GitHub deployment to use branch `feature/cms-cinematic-intro`, root directory `worker`, and deploy command `npx wrangler deploy`. Keep the build command empty. The Wrangler config is in that root directory.
5. Apply the D1 migration from the `worker/` directory: `npx wrangler d1 migrations apply badhon-editzx-cms --remote`.
6. Add these Worker secrets in the Cloudflare dashboard (Settings → Variables and Secrets):
   - `ADMIN_PASSWORD`: a strong, unique admin password.
   - `SESSION_SECRET`: a long random secret (at least 32 random bytes).
   - Optional `YOUTUBE_API_KEY`.
   Never put these secrets in GitHub, frontend files, or chat.
7. Deploy the selected branch. Verify `GET https://badhoneditzx.nemesiseditzx984.workers.dev/api/content` returns JSON.
8. Publish the frontend branch to its static host and open `/admin.html`. The admin session cookie is Secure, HttpOnly and SameSite=None because the API is on workers.dev; browser third-party-cookie restrictions can vary, so test sign-in in the target browser before launch.

Cloudflare resources, D1 database ID, Worker secrets and the exact frontend origin must be configured in the account before login, publishing and media uploads can work. Do not delete or modify GrabZone's existing Workers, D1 databases or R2 buckets.


### Existing YouTube stats proxy

The CMS Worker retains the `/youtube-channel-stats` endpoint. Set `YOUTUBE_API_KEY` as a Worker secret to enable it. No API key is exposed in browser code.

### Deployment status

The code and configuration are committed in this repository. Cloudflare D1, R2, Worker secrets, and the custom API domain are account resources and still need to be provisioned before admin authentication, video upload, and publishing can work. The static public site remains viewable without the CMS backend; until the Worker is deployed, the built-in page content is used.
