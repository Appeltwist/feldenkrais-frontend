# Forest Lighthouse WordPress Media Migration

## Goal

Remove launch-critical frontend dependence on WordPress-hosted media under `forest-lighthouse.be/wp-content/...` while keeping the migration explicit and easy to unwind later when media moves into Django/Wagtail-managed storage.

## Audit Summary

### Direct WordPress media references found in the frontend repo

| File | WordPress URL / field | Usage | Launch critical |
| --- | --- | --- | --- |
| `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/components/Header.tsx` | `https://forest-lighthouse.be/wp-content/uploads/sites/12/2022/07/69289F3E-09F0-4D3A-AC4C-98B27501D6A5-e1657354348213.png` | Forest header logo | Yes |
| `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/app/api/home/route.ts` | `hero.media_url`, `main_hall.image_url`, `whats_on_preview.cards[].offer.hero_image_url` | Homepage hero + home "what's on" cards | Yes |
| `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/lib/api.ts` -> `fetchOffers()` / `fetchOfferDetail()` | `hero_image_url` from API payloads | Offer list cards, collection pages, detail-page hero media, home feature cards, calendar card images | Yes |
| `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/lib/api.ts` -> `fetchTeachersList()` / `fetchTeacherDetail()` | `photo_url` from API payloads | About people cards, practitioner pickers, schedule avatars, teacher pages | Mixed |

### Live API audit snapshot

The Forest production API currently returns WordPress-hosted media in these launch-relevant surfaces:

- `site-config`: `0` current `wp-content` refs in payload
- `home` (`fr` + `en`): `8` `wp-content` refs each
- `offers` (`fr` + `en`): `43` `wp-content` refs each
- `teachers` (`fr` + `en`): `18` `wp-content` refs each

Most of the remaining volume is teacher photos and facilitator/editorial media. For launch we migrated the high-impact visuals first.

## What Was Migrated Into The Repo

These files now live under `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/public/brands/forest-lighthouse/` and are mapped away from WordPress through `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/lib/forest-media.ts`.

### Logo

- `https://forest-lighthouse.be/wp-content/uploads/sites/12/2022/07/69289F3E-09F0-4D3A-AC4C-98B27501D6A5-e1657354348213.png`
  -> `/brands/forest-lighthouse/logo/forest-lighthouse-wordmark.png`

### Shared / homepage image

- `https://forest-lighthouse.be/wp-content/uploads/sites/12/2022/12/079A0547.jpg`
  -> `/brands/forest-lighthouse/shared/main-hall-practice.jpg`

### Offer hero images migrated for launch-critical collection/detail surfaces

- `week-end-gaga-dancer`
  -> `/brands/forest-lighthouse/offers/week-end-gaga-dancer.jpg`
- `feldenkrais-for-musicians`
  -> `/brands/forest-lighthouse/offers/feldenkrais-for-musicians.jpeg`
- `apapacha-mama`
  -> `/brands/forest-lighthouse/offers/apapacha-mama.jpg`
- `brighter-minds`
  -> `/brands/forest-lighthouse/offers/brighter-minds.jpeg`
- `children-special-needs`
  -> `/brands/forest-lighthouse/offers/children-special-needs.jpg`
- `unlearning-pain`
  -> `/brands/forest-lighthouse/offers/unlearning-pain.jpg`
- `feldenkrais-individual-session`
  -> `/brands/forest-lighthouse/offers/feldenkrais-individual-session.jpg`
- `yoga-vinyasa-space-flow`
  -> `/brands/forest-lighthouse/offers/yoga-vinyasa-space-flow.jpg`
- `vinyasa-to-yin-yoga`
  -> `/brands/forest-lighthouse/offers/vinyasa-to-yin-yoga.jpg`
- `hatha-yoga`
  -> `/brands/forest-lighthouse/offers/hatha-yoga.jpg`
- `pilates`
  -> `/brands/forest-lighthouse/offers/pilates.jpg`
- `vinyasa-flow`
  -> `/brands/forest-lighthouse/offers/vinyasa-flow.jpg`
- `feldenkrais-classes`
  -> `/brands/forest-lighthouse/offers/feldenkrais-classes.jpg`
- `bones-for-life-training`
  -> `/brands/forest-lighthouse/offers/bones-for-life-training.jpg`
- `feldenkrais-bxl-4`
  -> `/brands/forest-lighthouse/offers/feldenkrais-bxl-4.jpg`

Notes:

- Some `fr` / `en` payloads pointed to different WordPress files for the same offer. Those were intentionally normalized to one stable local asset per offer.
- `brighter-minds` now also uses the same local image in `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/lib/forest-excerpts.ts`.

### Curated people images migrated for the About page / key practitioner surfaces

- Betzabel Falfan
  -> `/brands/forest-lighthouse/people/betzabel-falfan.jpg`
- Nikos Appelqvist
  -> `/brands/forest-lighthouse/people/nikos-appelqvist.jpg`
- Yvo Mentens
  -> `/brands/forest-lighthouse/people/yvo-mentens.jpg`
- Pia Appelqvist
  -> `/brands/forest-lighthouse/people/pia-appelqvist.jpg`
- Alan Questel
  -> `/brands/forest-lighthouse/people/alan-questel.jpg`

### Second-pass teacher and gallery fixes for live launch

To remove the remaining broken-image icons that appeared after the domain cutover, a second pass migrated or substituted these additional WordPress media URLs:

- Ana Victoria Iommi
  -> `/brands/forest-lighthouse/people/ana-victoria-iommi.jpg`
- Chen-Wei Lee
  -> `/brands/forest-lighthouse/people/chen-wei-lee.png`
- Jelila Laouiti
  -> `/brands/forest-lighthouse/people/jelila-laouiti.jpg`
- Joy Albano
  -> `/brands/forest-lighthouse/people/joy-albano.jpg`
- Juan Martinez
  -> `/brands/forest-lighthouse/people/juan-martinez.jpg`
- Lara Liu
  -> `/brands/forest-lighthouse/people/lara-liu.jpeg`
- Orazio Giurdanella
  -> `/brands/forest-lighthouse/people/orazio-giurdanella.jpeg`
- Sabine Boone
  -> `/brands/forest-lighthouse/people/sabine-boone.jpeg`
- Sacha Kocic
  -> `/brands/forest-lighthouse/people/sacha-kocic.jpeg`
- Scott Clark
  -> `/brands/forest-lighthouse/people/scott-clark.jpg`
- Tara Appriou
  -> `/brands/forest-lighthouse/people/tara-appriou.jpg`
- Bones for Life gallery images
  -> local Forest assets under `/brands/forest-lighthouse/offers/` and `/brands/forest-lighthouse/people/`

For `Gaspard Rozenwajn`, no trustworthy local portrait was available in the launch asset pack, so his legacy URL is currently forced to a clean empty value to trigger the UI initials fallback instead of showing a broken-image icon.

## Code Changes

### Centralized mapping

- Added `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/lib/forest-media.ts`
- This file:
  - records the migrated legacy WordPress URLs
  - maps them to local repo paths
  - rewrites JSON payloads recursively

### Rewired surfaces

- `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/components/Header.tsx`
  - logo now points directly to the local repo asset
- `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/app/api/home/route.ts`
  - rewrites Forest homepage payload media before returning JSON
- `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/lib/api.ts`
  - rewrites Forest offer / teacher / calendar / site-config payloads before normalization
- `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/app/about/page.tsx`
  - curated About people now prefer repo-owned images
- `/Users/nicosdalton/Documents/CODEX/fe-next-clean-preview/lib/forest-about-content.ts`
  - added local image paths for curated About people

## Intentionally Left For Later

These still depend on WordPress-hosted media today and should move to Django/Wagtail-managed storage later rather than becoming a large permanent repo asset dump:

- teacher photos outside the curated About-page subset
- teacher detail page portraits
- facilitator portraits in offer details
- offer gallery images
- other editorial media that changes regularly

Examples still left on WordPress or needing a proper CMS-media migration:

- editorial teacher portraits not yet recovered from the original source files
- offer-detail gallery sets beyond the launch-critical ones patched here
- rich-text editorial media embedded inside CMS HTML blocks

## Long-Term Boundary

### Keep in repo

- logo
- decorative visuals
- stable brand photography
- fallback images
- launch-critical curated landing visuals

### Move later to Django/Wagtail media

- teacher photos
- offer hero images
- galleries
- editorial media that changes regularly

This migration is intentionally a launch-safe bridge, not the final media architecture.
