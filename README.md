# BADHON EDITZX — Personal Portfolio

Bilingual (English/Bangla), responsive portfolio for **Md Mahim Badhon**, under the public brand **Badhon EditZX**.

## Public website and Admin Studio

- Public homepage: the repository root, published as a static Netlify site.
- Admin Studio: `/admin.html` and the short route `/admin`.
- The Admin Studio and public homepage use the same Supabase CMS record: `public.site_content`, row `id = 1`.
- The public homepage reads the published JSON content from Supabase on page load, when the tab regains focus, and through a Realtime subscription when available.
- Admin edits update the existing CMS row directly. Publishing is not a separate export or local-only save.
- Video/poster uploads use the public-read, admin-write Supabase Storage bucket `badhoneditzx-media`.

## Supabase configuration

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for the project reference, schema, RLS model, admin account setup and deployment notes.

Only the Supabase URL and publishable browser key belong in `supabase-config.js`. Never commit a service-role key, secret API key, database password, or personal access token.

## Netlify

- Build command: none.
- Publish directory: `.`.
- Production branch: `main`.
- HTML, JavaScript and CSS use revalidation headers so browsers do not keep stale Firebase-era scripts.
- `_redirects` maps `/admin` to `/admin.html`.

## Editable content

The Admin Studio manages the brand and owner identity, bilingual hero copy, intro video and poster, quote, About introduction, featured project, video links, social links, contact email and theme colors. The public homepage renders these values from the shared Supabase content record.

## Important

The Supabase project must remain active and within its plan quota for login, publishing and media uploads to work. Public site HTML can still load when the CMS is unavailable, but dynamic content will fall back to the built-in page content and the browser console will show the CMS error.

## Security baseline

- Netlify sends browser security headers on every route, including the Admin Studio: Content Security Policy, HSTS, clickjacking protection, MIME sniffing protection, referrer policy and a restrictive Permissions Policy.
- Dynamic CMS links and media URLs must use HTTPS. CMS owner-name rendering uses DOM text nodes rather than injecting database content as HTML.
- `public.site_content` has RLS enabled. Public visitors receive SELECT only (the RLS policy exposes only the published row); authenticated sessions receive SELECT and UPDATE grants, while RLS permits UPDATE only when the JWT contains the protected `app_metadata.role = admin` claim. INSERT and DELETE grants are revoked from browser roles.
- Storage remains a public-read bucket for published portfolio media. Upload, update and delete are restricted by Storage RLS policies to authenticated admin JWTs. Public media URLs are not private or secret.
- Re-run the Supabase Security Advisor after schema or policy changes. Enable Leaked Password Protection and enforce MFA for the owner/admin account in Supabase Auth settings; these are project authentication controls and are not enabled by a frontend code change.
- Keep GitHub, Netlify and Supabase owner accounts protected with unique passwords and MFA. Never commit service-role keys, database passwords or access tokens.
- The exact least-privilege grants are documented in `security-hardening.sql`.

### Contact form delivery

- The portfolio contact form posts to Netlify Forms instead of relying on a visitor's local `mailto:` application.
- Includes a honeypot field, required-field validation, message length limits, disabled/loading state, and visible success/error feedback.
- Form submissions are collected in the Netlify site's Forms inbox. Configure an email notification to `bdnemesisgaming@gmail.com` in Netlify Forms → Notifications if you want every submission delivered to the mailbox.


## Public portfolio design

The public homepage uses a bespoke editorial design system for Badhon EditZX, built with semantic HTML, responsive CSS and vanilla JavaScript. The portfolio retains its bilingual content, Supabase-powered CMS, media rendering, Netlify Forms contact flow, security headers and separate Admin Studio. The public layout is independent of the Admin Studio interface; existing CMS fields continue to populate the redesigned sections.
