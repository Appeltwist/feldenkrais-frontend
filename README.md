# Feldenkrais Frontend (Next.js)

Standalone multi-site frontend for Feldenkrais Education.

## FE beta branch

The `release/fe-beta-frontend` branch targets the live FE beta frontend.

Use these values for local validation on this branch:

```bash
NEXT_PUBLIC_API_BASE=https://api.forest-lighthouse.be/api
SITE_HOSTNAME_OVERRIDE=feldenkrais-education.com
```

Beta deploys go to the `feldenkrais-frontend-beta` Vercel project and serve `beta.feldenkrais-education.com`.

The FE beta stays intentionally read-only: forms, contact requests, applications, and bookings remain disabled until launch.

## Optional local backend setup

1. Add local domains to `/etc/hosts`:

```txt
127.0.0.1 forest-lighthouse.local
127.0.0.1 feldenkrais-education.local
```

2. In the backend repo, run:

```bash
python manage.py runserver 8000
```

3. If you explicitly want to work against a local backend, ensure `.env.local` contains:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:8000/api
```

4. Start frontend:

```bash
npm run dev
```

5. Open:

- [http://forest-lighthouse.local:3000/workshops](http://forest-lighthouse.local:3000/workshops)
- [http://forest-lighthouse.local:3000/calendar](http://forest-lighthouse.local:3000/calendar)

Expected workshop sample from backend data: `Atelier Gaga`.

## Routes

- `/` Home
- `/workshops` Workshop list
- `/offer/[slug]` Offer detail
- `/calendar` Calendar range (today to +30 days)

## API behavior

- Site resolution: `GET /api/site-config?domain=<hostname>`
- Data endpoints:
  - `GET /api/offers`
  - `GET /api/offers/{slug}`
  - `GET /api/calendar`
- Frontend always sends `domain=<hostname>` for dev-friendly multi-site resolution.

## CORS note

If browser API requests fail with CORS errors, backend must allow frontend origins, including:

- `http://forest-lighthouse.local:3000`
- `http://localhost:3000`

Backend CORS config is not managed in this repository.

For FE beta deployments on Vercel, set `NEXT_PUBLIC_API_BASE=https://api.forest-lighthouse.be/api` and `SITE_HOSTNAME_OVERRIDE=feldenkrais-education.com` in the project settings. Do not rely on any localhost fallback.

## Manual verification (offer detail)

1. Open [http://forest-lighthouse.local:3000/offer/atelier-gaga](http://forest-lighthouse.local:3000/offer/atelier-gaga)
2. Confirm the page loads and at least one schedule card renders (from `schedule_cards`)
3. Confirm there are no crashes when `subtitle`, `primary_cta`, `quick_facts`, `themes`, and `sections` are empty

After adding content in Wagtail:

1. Add one theme to the offer translation
2. Fill `quick_facts.duration` and `quick_facts.languages`
3. Add one `rich_section` block in `sections`
4. Refresh the offer page and confirm theme pills, quick facts, and rich section content render
