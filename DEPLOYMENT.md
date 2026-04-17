# FE Beta Vercel Deployment

This repository is the Next.js frontend only. The Django + Wagtail backend runs separately and must be publicly reachable before deploying this app.

## Beta target

FE beta deploys target:

- Vercel project: `feldenkrais-frontend-beta`
- Custom domain: `beta.feldenkrais-education.com`
- Branch: `release/fe-beta-frontend`

## Required environment variables

Set these in the Vercel project settings:

```bash
NEXT_PUBLIC_API_BASE=https://api.forest-lighthouse.be/api
SITE_HOSTNAME_OVERRIDE=feldenkrais-education.com
```

The frontend requires `NEXT_PUBLIC_API_BASE` at build time and runtime. If it is missing, the app fails fast instead of falling back to localhost.

`SITE_HOSTNAME_OVERRIDE=feldenkrais-education.com` makes the frontend identify itself to the shared production backend as the canonical FE site, even when the deployment is served from a temporary `*.vercel.app` preview hostname.

## Notes

- The FE beta uses the shared production backend at `https://api.forest-lighthouse.be/api`.
- The shared CMS/admin remains `https://admin.neurosomatic.cloud`.
- The FE beta is intentionally read-only until launch.
- Vercel should detect this project as a standard Next.js app from the repository root.
- The frontend includes `app/api/` proxy routes for selected Django-backed features.
- `middleware.ts` is still supported for now, but Next.js 16 prefers `proxy.ts`. This is non-blocking for deployment.
