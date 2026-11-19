# BADHON EDITZX — Personal Portfolio

Bilingual (English/Bangla), responsive personal portfolio for **Md Mahim Badhon**, with the public brand **Badhon EditZX**.

## Public site

The repository root is published as a static Netlify site. No build command is required; publish directory is `.`.

## Admin CMS — Firebase

The private content editor is available at `/admin.html`. It uses:
- **Firebase Authentication** (Email/Password) for admin sign-in.
- **Cloud Firestore** document `site/content` for editable portfolio content.
- **Cloud Storage for Firebase** for intro video uploads.
- Netlify continues to host the existing static website.

The editor manages brand identity, bilingual hero and About text, background intro video, featured project, video and social links, contact email and theme colors. Publishing writes the content document; the public site reads it and applies the changes.

### Firebase setup

1. Create a Firebase project in the Firebase Console and register a Web app.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create one admin user under **Authentication → Users → Add user**. Do not enable public sign-up.
4. Create a **Cloud Firestore** database. Start in production mode.
5. Create a **Cloud Storage** bucket if you want direct video uploads.
6. Copy the Web app configuration into `firebase-config.js`. Replace every `REPLACE_...` placeholder. Set `adminEmail` to the exact admin email created in step 3.
7. In both `firestore.rules` and `storage.rules`, replace `REPLACE_WITH_ADMIN_EMAIL` with that same admin email. Publish the rules in the Firebase Console.
8. Publish the Netlify site from the `feature/firebase-cms` branch for testing. Open `/admin.html`, sign in, and test a small text change before uploading a video.

### Important billing note

As of February 3, 2026, Firebase Cloud Storage requires the Firebase project to be on the **Blaze pay-as-you-go plan**. No-cost usage allowances may still apply, but a linked billing account is required and usage beyond allowances can be charged. Firestore and Authentication can be tested without enabling Storage uploads. Do not enable billing until you are comfortable with the billing account and usage limits.

### Security

- The Firebase web config is intended to be public; it is not an admin credential.
- Firestore and Storage rules allow public reads only for the portfolio content/media, and restrict writes to the single configured admin email.
- Never put service-account private keys or other server credentials in this repository or browser code.
- Do not enable anonymous or public user registration for this single-admin portfolio.

### Cloudflare migration status

The previous Cloudflare Worker/D1/R2 implementation is retained in the `worker/` directory for reference only. The Firebase frontend no longer calls it. Do not deploy or merge the old Cloudflare CMS configuration. The existing Cloudflare resources created during setup are not needed by this Firebase version; leave them untouched until the Firebase version has been tested and the user explicitly chooses to clean them up.

### Cinematic experience

The homepage includes a muted looping hero-video layer and a pinned three-chapter scroll sequence: CREATE, BUILD and EXPLORE.
