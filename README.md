# Peak — landing page

Single-page landing site for the Peak peptide brand.

## Quickstart

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Edit the copy (Claude-friendly)

All headlines, section text, nav labels, and footer disclaimer live in:

- `content/siteCopy.ts`

That file is the best “single source of truth” to hand Claude for copy and layout edits.

## Project structure

- `app/page.tsx`: landing page sections (Hero, Standards/Features, Social proof placeholders, FAQ, CTA, Footer)
- `app/components/*`: small reusable UI blocks
- `content/siteCopy.ts`: centralized marketing copy + links

## Build & quality checks

```bash
npm run lint
npm run build
```

## Deploy (Vercel)

Since your GitHub repo is connected to Vercel:

- Every push to `main` triggers a production deployment
- Pull requests (if you use them) get preview deployments

Vercel should auto-detect this as a Next.js project. No env vars are required for v1.

## Workflow: Claude → local → GitHub → Vercel

1. Ask Claude to generate changes (copy, sections, components).
2. Apply changes locally in this repo.
3. Validate:
   - `npm run lint`
   - `npm run build`
4. Commit + push:

```bash
git add .
git commit -m "Update landing copy/sections"
git push
```

Vercel auto-deploys after the push.

## Notes

- The waitlist CTA is currently a `mailto:` flow (see `app/components/EmailCapture.tsx`). Swap it later for a real provider (Klaviyo, Mailchimp, ConvertKit, etc.).
- Update the disclaimer text in `content/siteCopy.ts` to match your exact positioning and compliance needs.
