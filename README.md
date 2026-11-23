# Badhon EditZX — BEX Portfolio

A full rebuild of the public portfolio on a new visual system: bright white, ice-blue and cobalt, with kinetic typography, 2D motion studies and responsive editorial layouts.

## Public experience
- Responsive portfolio with English/Bangla language switching.
- Selected YouTube work, CMS-managed project cards, skills, experience timeline and Drone/Aerial interest section.
- GrabZone project feature and social profile links.
- Interactive 2D Motion Lab: kinetic type, velocity, morphing geometry and waveform study.
- Contact dialog with Netlify Forms submission and honeypot.
- Background poster and optional looping MP4/WebM video, configurable through Admin Studio.
- Reduced-motion support and CSS-first fallback artwork.

## Admin Studio and CMS
- Admin Studio: `/admin.html` and `/admin`.
- Supabase content source: `public.site_content`, row `id = 1`.
- Admin edits update the shared CMS record; public page loads the published record.
- Supports bilingual copy, poster/video URL, video links, projects, skills, timeline milestones, social links and theme values.
- Media uploads use the `badhoneditzx-media` Supabase Storage bucket.
- Browser config contains only the Supabase URL and publishable key. Never commit service-role keys or passwords.

See `SUPABASE_SETUP.md` and `security-hardening.sql` for CMS setup and permission requirements.

## Netlify
- Build command: none.
- Publish directory: `.`.
- `/admin` redirects to `/admin.html`.
- Contact form submissions are collected in Netlify Forms. Configure email notifications in the Netlify dashboard if required.

## Validation
The branch commit is source-updated. A successful Netlify deploy and live browser QA are still required before calling the website production-ready.
