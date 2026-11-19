# Badhon EditZX — Supabase CMS

The portfolio uses one Supabase project as the shared content source for the Admin Studio and the public homepage.

## Project

- Project: `BadhonEditZX`
- Project ref: `mxxhjxzutxzaodcjtdrs`
- Region: `us-east-1`
- API URL: `https://mxxhjxzutxzaodcjtdrs.supabase.co`
- Content table: `public.site_content`
- Storage bucket: `badhoneditzx-media`

The browser config contains only the publishable key. Never put a `service_role` or secret key in the frontend or GitHub.

## Data flow

1. The Admin Studio authenticates with Supabase Auth.
2. Admin permission is checked using protected `app_metadata.role = admin`.
3. Admin saves update the existing `site_content` row with `id = 1`.
4. The public homepage reads the same published row on page load and refreshes on focus/visibility changes. It also subscribes to Supabase Realtime updates where enabled.
5. Video and poster uploads go to `badhoneditzx-media`; the public homepage uses their public URLs.

## First admin account

The owner account is `bdnemesisgaming@gmail.com`. Create it under Supabase Dashboard → Authentication → Users, then assign the protected role in SQL Editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"admin"}'::jsonb
where lower(email) = lower('bdnemesisgaming@gmail.com');
```

Do not set admin privileges in editable `raw_user_meta_data`. Never share the password in chat.

## Security and storage

- Public visitors can read only the published content row.
- Only authenticated users with `app_metadata.role = admin` can modify CMS content.
- The media bucket is public-read for assets used by the public portfolio; writes, updates and deletes are admin-only.
- Allowed file types: JPEG, PNG, WebP, MP4 and WebM.
- Maximum upload size: 90 MB.

## Netlify deployment

The static site publishes from repository root (`.`) with no build command. Production branch is `main`. Open the Admin Studio at `/admin.html` or `/admin`.

HTML, JavaScript and CSS have revalidation headers to avoid stale scripts. After a deployment, hard-refresh once if an old page remains in the browser cache.

## Operational requirement

The Supabase project must be active and within its plan quota. If the project is paused or over quota, authentication, content reads/writes and storage uploads can fail even when the frontend is correctly deployed.
