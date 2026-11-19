# BADHON EDITZX — Personal Portfolio

Bilingual (English/Bangla), responsive personal portfolio for **Md Mahim Badhon**, with the public brand **Badhon EditZX**.

## Public site
The repository root is published as a static Netlify site. No build command is required; publish directory is `.`.

## CMS admin and cinematic intro

The site includes a private editor at `/admin.html`. It can edit brand identity, bilingual hero text, background intro video, intro quote, About copy, featured project, videos, social links, contact email and accent colors. Saved content is served from Cloudflare D1 and loaded by the public website. Intro video uploads are stored in Cloudflare R2.

The cinematic hero video plays muted and loops behind the intro. Below it, a pinned three-chapter scroll sequence transitions through CREATE, BUILD and EXPLORE.

### Cloudflare provisioning (required before CMS login/publishing works)

1. In the Cloudflare account, create a D1 database named `badhon-editzx-cms`:
   `npx wrangler d1 create badhon-editzx-cms`
2. Copy the returned database ID into `worker/wrangler.toml`, replacing `REPLACE_WITH_D1_DATABASE_ID`.
3. Create the R2 bucket:
   `npx wrangler r2 bucket create badhon-editzx-media`
4. From the `worker/` directory apply the schema:
   `npx wrangler d1 migrations apply badhon-editzx-cms --remote`
5. Set private Worker secrets (never paste them into chat or frontend files):
   - `npx wrangler secret put ADMIN_PASSWORD`
   - `npx wrangler secret put SESSION_SECRET` (use a long random value)
   - Optional: `npx wrangler secret put YOUTUBE_API_KEY`
6. Ensure the domain is active in the Cloudflare zone and the custom API hostname `api.badhoneditzx.com` can be attached. Then deploy from `worker/`:
   `npx wrangler deploy`
7. Publish the repository root to Netlify and open `https://badhoneditzx.com/admin.html`.

The Worker is configured to accept browser requests only from `https://badhoneditzx.com` and `https://www.badhoneditzx.com`. Update `ALLOWED_ORIGINS` if the live site uses a different canonical host. The admin session uses an HttpOnly, Secure, SameSite cookie. Configure Cloudflare rate limiting on `/api/admin/login` before public launch.

### Existing YouTube stats proxy

The CMS Worker retains the `/youtube-channel-stats` endpoint. Set `YOUTUBE_API_KEY` as a Worker secret to enable it. No API key is exposed in browser code.

### Deployment status

The code and configuration are committed in this repository. Cloudflare D1, R2, Worker secrets, and the custom API domain are account resources and still need to be provisioned before admin authentication, video upload, and publishing can work. The static public site remains viewable without the CMS backend; until the Worker is deployed, the built-in page content is used.
