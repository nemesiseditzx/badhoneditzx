# Badhon EditZX — Supabase CMS

This branch migrates the portfolio CMS from the old Cloudflare Worker/D1/R2 implementation to a dedicated Supabase project.

## Supabase project

- Project: `BadhonEditZX`
- Project ref: `mxxhjxzutxzaodcjtdrs`
- Region: `us-east-1`
- Public API URL: `https://mxxhjxzutxzaodcjtdrs.supabase.co`
- Storage bucket: `badhoneditzx-media`
- Content table: `public.site_content`

The browser configuration in `supabase-config.js` contains only the publishable key. Never add a `service_role`, secret key, database password, or personal access token to this repository.

## CMS security model

- Public visitors can read the single published content row.
- Only a signed-in Supabase Auth user with `app_metadata.role = admin` can read drafts, publish content, or upload/modify/delete media.
- Admin authorization is checked by Postgres RLS. Do not use editable `user_metadata` for admin roles.
- The media bucket is public-read for display on the portfolio; writes remain admin-only.
- Maximum upload size is 90 MB. Allowed media: JPG, PNG, WebP, MP4, WebM.

## Create the first admin account

1. Open the Supabase Dashboard for this project: https://supabase.com/dashboard/project/mxxhjxzutxzaodcjtdrs
2. Go to **Authentication → Users → Add user** and create the owner's account with an email and password.
3. In **SQL Editor**, assign the protected admin role to that exact email (use the confirmed owner email):
   
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where lower(email) = lower('bdnemesisgaming@gmail.com');
   ```

4. Sign in at `/admin.html` with `bdnemesisgaming@gmail.com` and the password you set when creating the user.

Only project owners should be assigned the admin role. Never set the role in `raw_user_meta_data`.

## Deploying

This branch is not deployed automatically. Review and merge it only after the GitHub branch checks and admin sign-in test pass. The existing public Netlify deployment remains unchanged until a deployment is explicitly configured and approved.

## Content schema

`public.site_content` stores the portfolio's editable content as one JSONB object. The seed row preserves the current brand, bilingual intro, GrabZone project, social links, theme colors, and video showcase entries.
