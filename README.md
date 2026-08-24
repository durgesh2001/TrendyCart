# The Edit — Myntra affiliate showcase

Next.js 14 (App Router) + Tailwind. $0 to build and host, permanently, on Vercel's free tier.

## Architecture, and why

- **Frontend + API**: Next.js on Vercel free tier. Server routes do the scraping server-side, so there's
  no CORS issue (that only exists in the browser).
- **"Database"**: `data/products.json`, committed to this same GitHub repo and read/written through the
  GitHub Contents API (`lib/github.ts`). No Postgres/Firebase account needed. The homepage reads the file
  straight from `raw.githubusercontent.com` with a 30s cache, so new products show up in ~30s — no redeploy
  wait.
- **Scraping**: `lib/parse.ts` reads the Myntra product page server-side and pulls data from, in order:
  1. The `schema.org/Product` JSON-LD block Myntra ships for Google (most reliable, least likely to break).
  2. `og:*` meta tags.
  3. A regex scan of Myntra's inline `window.__myx` state object, for fields (like MRP) the JSON-LD omits.
  This is best-effort — retailers change markup without notice, so the admin form always shows the parsed
  fields for a quick manual fix before saving, rather than failing silently.
- **Auth**: a single shared password (`ADMIN_PASSWORD`) gates `/admin` and the write endpoints via an
  httpOnly cookie. Fine for a one-person admin panel; not meant for multi-user access control.

### A more durable alternative to scraping

Scraping a live commerce site is inherently fragile (markup changes, rate limits, ToS considerations).
Myntra's actual affiliate program runs through networks like **Affiliate window / Awin, vCommission, or
Admitad** — join one, and you get a proper product feed/API plus tracked affiliate links, which is both more
reliable and the intended way to run an affiliate site. Treat the scraper here as a fast way to get started;
swap in a feed import (same `Product` shape) once you're accepted into a network.

## Free hosting, step by step

1. **Create the GitHub repo.** Push this project to a new *public or private* GitHub repo, e.g.
   `yourname/myntra-affiliate-edit`.
2. **Generate a GitHub token.** GitHub → Settings → Developer settings → Fine-grained tokens → generate one
   scoped to only this repo, with **Contents: Read and write** permission. Copy it.
3. **Deploy to Vercel.** Sign up at vercel.com with your GitHub account (free, no card) → "Add New Project"
   → import this repo → it auto-detects Next.js.
4. **Set environment variables** in the Vercel project settings, before or right after the first deploy:
   - `ADMIN_PASSWORD` — pick a strong password
   - `GITHUB_TOKEN` — the token from step 2
   - `GITHUB_REPO` — `yourname/myntra-affiliate-edit`
   - `GITHUB_BRANCH` — `main`
   - `NEXT_PUBLIC_AFFILIATE_ID` — your Myntra affiliate ID (powers the homepage referral-link banner)
5. **Redeploy** (Vercel → Deployments → ⋯ → Redeploy) so the new env vars take effect.
6. **Visit `/admin`**, log in, paste a Myntra product URL, click Import, review the fields, save. It'll
   appear on the homepage within ~30 seconds.
7. **Custom domain (optional, still free)**: Vercel gives you `your-project.vercel.app` for free forever.
   A custom domain needs a domain name (paid, ~$10/yr) — everything else in this stack stays at $0.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

## Routes

| Route | Renders | Notes |
|---|---|---|
| `/` | Homepage — hero, referral banner, compact product grid | All/Men/Women filter + search run client-side (`components/HomeShell.tsx`) |
| `/product/[id]` | Product detail page | Gallery, price breakdown, "Grab Deal on Myntra" CTA |
| `/other-offers` | Non-Myntra deals (cashback, bank promos, etc.) | Separate collection, never mixes with the product feed |
| `/about` | About Us | Static |
| `/contact` | Contact Us | Mock form, no backend wired up — see `app/contact/page.tsx` |
| `/admin` | Dashboard: add/manage Myntra products, add/manage Other Offers | Password-gated (`ADMIN_PASSWORD`) |
| `/admin/products` | Full Myntra product list, 20/page | Same gate, reached via "View all →" |

## Data model

Two flat JSON files, each committed to this repo and read/written through `lib/github.ts`:

- **`data/products.json`** → `Product` type — Myntra listings (existing).
- **`data/offers.json`** → `Offer` type — non-Myntra offers:
  ```ts
  type Offer = {
    id: string;
    title: string;
    image: string;
    details: string;
    steps: string[];   // rendered as a numbered "how to avail" list
    url: string;
    createdAt: string;
  };
  ```
`lib/github.ts` was refactored around a generic `readPublic` / `readWithSha` / `commit` helper so both
collections share the same read/write logic instead of duplicating it.

## Components added in this pass

- `components/ProductManager.tsx` / `components/OfferManager.tsx` — paginated list + delete, used on `/admin`
  (8/page) and `/admin/products` (20/page for products).
- `components/Pagination.tsx` — shared Prev/Next control.
- `components/AdminGate.tsx` — shared password screen, checks for an existing session via `GET /api/admin-auth`
  so navigating between admin pages doesn't re-prompt.
- `components/OfferForm.tsx` / `components/OfferCard.tsx` — Other Offers admin form and public card.

