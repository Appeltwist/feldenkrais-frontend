# Vercel Deployment

This repository is the Next.js frontend only. The Django + Wagtail backend runs separately and must be publicly reachable before deploying this app.

## Required environment variable

Set this in the Vercel project settings:

```bash
NEXT_PUBLIC_API_BASE=https://api.forest-lighthouse.be/api
```

The frontend requires `NEXT_PUBLIC_API_BASE` at build time and runtime. If it is missing, the app fails fast instead of falling back to localhost.

## Production branch

Production deployments should come from the `main` branch.

## Notes

- Vercel should detect this project as a standard Next.js app from the repository root.
- The frontend includes `app/api/` proxy routes for selected Django-backed features.
- `middleware.ts` is still supported for now, but Next.js 16 prefers `proxy.ts`. This is non-blocking for deployment.
