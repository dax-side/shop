# Oja Supply Co.

**Everyday goods, made to last.** An online shop for kitchen, table and house things from small workshops in Lagos and beyond.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8) ![Status](https://img.shields.io/badge/status-in_development-orange)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Security](#security)
- [How to Contribute?](#how-to-contribute)
- [What's Next?](#whats-next)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Author](#author)

---

## About

Oja Supply Co. is a storefront for household goods picked to be used every day, not kept for best. Shoppers browse a catalogue grouped by room (Kitchen, Table, Bath & Linen, Tools, Paper & Desk), view product details and finishes, add items to a bag, and check out for delivery across Nigeria or pickup from the store in Lagos.

Prices are in Naira (₦). Orders are stored in Postgres, confirmed by email, and customers can sign in with Google.

---

## Features

| Feature | Description | Status |
| --- | --- | --- |
| Home page | Hero, shop by room with room photos, catalogue with category filters, "made by hand" workshop and store photos, how it works, newsletter signup | Done |
| Product page | Image gallery, finish options, quantity, details table, "goes well with" | Done |
| Bag | Add, update and remove items with a running total | Done |
| Checkout | Delivery or pickup, contact and address details, payment method, server-validated order with server-side pricing | Done |
| Persistence | 18 products across five rooms; orders, order lines and newsletter subscribers stored in Neon Postgres | Done |
| Order page | Confirmation page for each order, linked from checkout | Done |
| Payments | Card, bank transfer and USSD through Paystack, confirmed by callback and webhook; failed payments can be retried from the order page | Done |
| Confirmation emails | Branded order confirmation (HTML and plain text) sent through Mailgun once payment succeeds | Done |
| Google sign-in | Sign in or create an account with Google, from the sign-in page or at checkout | Done |
| Account | Order history for signed-in customers; checkout details prefilled | Done |
| Terms and privacy | Terms of sale and privacy policy pages, filled from the store settings and linked at sign-in, checkout and in the footer | Done |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | [Neon](https://neon.tech) Postgres with [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [Auth.js v5](https://authjs.dev) with Google and the Drizzle adapter (database sessions) |
| Payments | [Paystack](https://paystack.com) |
| Email | [Mailgun](https://www.mailgun.com) |
| Validation | [Zod](https://zod.dev) |
| Linting | ESLint |

---

## Architecture

```text
Browser
  │
  ▼
Next.js app (server components, route handlers, server actions)
  ├── Neon Postgres ── products, orders, order items, subscribers (via Drizzle)
  ├── Paystack ─────── payments (redirect checkout, callback and webhook)
  ├── Auth.js ──────── Google OAuth (Google Cloud Console)
  └── Mailgun ──────── order confirmation emails
```

Pages render on the server. The bag lives on the client until checkout, where the server recomputes totals from database prices and saves the order as awaiting payment. The customer is sent to Paystack; when they come back (or when Paystack's webhook arrives, whichever is first) the server verifies the transaction with Paystack, checks the amount, marks the order paid and sends the confirmation email.

---

## Project Structure

```text
.
├── src/
│   ├── app/
│   │   ├── (shop)/     # Storefront routes sharing the header and footer
│   │   ├── api/auth/   # Auth.js route handlers
│   │   ├── api/paystack/ # Paystack callback and webhook
│   │   ├── checkout/   # Checkout route with its own header
│   │   ├── sign-in/    # Sign in / create account page
│   │   ├── globals.css # Design tokens (colours, fonts, display type)
│   │   └── layout.tsx  # Root layout and fonts
│   ├── auth.ts         # Auth.js config and session helpers
│   ├── components/     # Shared UI: header, footer, logo, icons, product cards
│   │   ├── auth/       # Google sign-in button
│   │   ├── bag/        # Bag state hook, bag button, add to bag, bag page view
│   │   ├── checkout/   # Checkout header, form fields, checkout form
│   │   ├── product/    # Product page gallery, purchase controls, recommendations
│   │   └── home/       # Home page sections
│   ├── db/             # Drizzle schema, connection, seed script and seed data
│   └── lib/            # Site config, queries, pricing, formatting, server actions
│       └── email/      # Mailgun client and order confirmation template
├── public/images/      # Optimised product and shop photography (WebP)
├── drizzle/            # Generated SQL migrations
├── AGENTS.md           # Rules for AI agents working on this repo
├── CLAUDE.md           # Points to AGENTS.md
├── .env.example        # Environment variable template
├── drizzle.config.ts   # Drizzle Kit config
├── vercel.json         # Vercel build command
├── eslint.config.mjs   # ESLint config
├── next.config.ts      # Next.js config
├── postcss.config.mjs  # Tailwind via PostCSS
└── tsconfig.json       # TypeScript config
```

---

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm
- A Postgres database: a free [Neon](https://neon.tech) project, or Postgres running locally

### Setup

```bash
git clone https://github.com/dax-side/shop.git
cd shop
npm install
cp .env.example .env.local   # then set DATABASE_URL
npm run db:migrate           # create the tables
npm run db:seed              # load the catalogue
npm run dev
```

To get a Neon connection string: create a project at [console.neon.tech](https://console.neon.tech), open **Connect**, and copy the pooled connection string into `DATABASE_URL`.

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate route types and run the TypeScript compiler |
| `npm run db:generate` | Generate a SQL migration after changing `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations (skips with a warning if `DATABASE_URL` is unset) |
| `npm run db:seed` | Insert or update the catalogue products (safe to re-run) |
| `npm run db:studio` | Browse the database with Drizzle Studio |
| `npm run vercel-build` | What Vercel runs: migrate, add any new catalogue products, then build |

### Deploy to Vercel

Vercel is the only thing to deploy. Neon, Paystack, Mailgun and Google are hosted services connected through environment variables.

1. **Import the repo** at [vercel.com/new](https://vercel.com/new). The Next.js preset and `vercel.json` are picked up automatically.
2. **Add Neon** from the project's **Storage** tab (Neon integration). It sets `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for you.
3. **Add the other environment variables** under **Settings → Environment Variables**: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `PAYSTACK_SECRET_KEY`, `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM` and the store details. `NEXT_PUBLIC_SITE_URL` and `AUTH_TRUST_HOST` aren't needed on Vercel.
4. **Deploy.** The build applies migrations, adds any catalogue products the database doesn't have yet, and builds the app.
5. **Point the services at your domain:**
   - Paystack webhook: `https://<your-domain>/api/paystack/webhook`
   - Google OAuth redirect URI: `https://<your-domain>/api/auth/callback/google`, and the domain as a JavaScript origin

Preview deployments work too. Google sign-in only works on domains registered with the OAuth client, so test sign-in on production or a fixed preview domain.

---

## Configuration

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Off Vercel | Public URL of the site, used in emails and payment callbacks. On Vercel it defaults to the deployment's domain |
| `DATABASE_URL` | Yes | Postgres connection string, e.g. your Neon pooled URL with `sslmode=require` |
| `STORE_ADDRESS` | No | Pickup address shown in the header, footer and emails |
| `STORE_OPENING_HOURS` | No | Store opening hours |
| `STORE_PHONE` | No | Contact phone number |
| `STORE_EMAIL` | No | Contact email address |
| `DELIVERY_DAYS` | No | Delivery time outside Lagos. Defaults to `3–5` |
| `DELIVERY_FEE` | No | Delivery fee in naira. Defaults to `3500` |
| `FREE_DELIVERY_THRESHOLD` | No | Order value in naira above which delivery is free. Defaults to `50000` |
| `RETURN_WINDOW_DAYS` | No | Number of days customers have to return items. Defaults to `14` |

Address, opening hours, phone and email are optional: any sentence or link that uses one is hidden until it's set, so no placeholder text ever shows.

### Payments (Paystack)

| Variable | Required | Description |
| --- | --- | --- |
| `PAYSTACK_SECRET_KEY` | For payments | Secret key from the Paystack dashboard. Use the `sk_test_…` key for test mode |
| `PAYSTACK_API_URL` | No | Override the API base URL, only for testing against a mock |

Paystack setup:

1. In the [Paystack dashboard](https://dashboard.paystack.com), switch to **Test Mode** and open **Settings → API Keys & Webhooks**.
2. Copy the **Test Secret Key** into `PAYSTACK_SECRET_KEY`.
3. Set the **Test Webhook URL** to `https://<your-domain>/api/paystack/webhook`.
4. Pay with one of Paystack's [test cards](https://paystack.com/docs/payments/test-payments/), e.g. `4084 0840 8408 4081`, CVV `408`, any future expiry, PIN `0000`, OTP `123456`.

The callback URL is sent with each transaction, so it needs no dashboard setting. For live payments, repeat with the live key and live webhook URL. Without `PAYSTACK_SECRET_KEY`, orders are saved as awaiting payment and the order page says payments aren't available.

### Email (Mailgun)

| Variable | Required | Description |
| --- | --- | --- |
| `MAILGUN_API_KEY` | For email | Mailgun private API key |
| `MAILGUN_DOMAIN` | For email | Your verified sending domain, e.g. `mg.yourdomain.com` |
| `MAILGUN_FROM` | For email | Sender, e.g. `Oja Supply Co. <orders@mg.yourdomain.com>` |
| `MAILGUN_API_URL` | No | `https://api.eu.mailgun.net` for EU-region domains. Defaults to the US endpoint |

Replies to confirmation emails go to `STORE_EMAIL` when it is set. Without the Mailgun variables, orders still go through and the email is skipped with a warning in the logs.

### Google sign-in (Auth.js)

| Variable | Required | Description |
| --- | --- | --- |
| `AUTH_SECRET` | For sign-in | Random secret for signing sessions. Generate with `npx auth secret` or `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | For sign-in | OAuth client ID from Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | For sign-in | OAuth client secret from Google Cloud Console |
| `AUTH_TRUST_HOST` | Off Vercel | Set to `true` when running `next start` yourself or behind a proxy |

To create the Google OAuth client:

1. In [Google Cloud Console](https://console.cloud.google.com), create or pick a project.
2. Go to **APIs & Services → OAuth consent screen**, choose **External**, and fill in the app name, support email and authorised domain.
3. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**, type **Web application**.
4. Add authorised JavaScript origins: `http://localhost:3000` and your production URL.
5. Add authorised redirect URIs: `http://localhost:3000/api/auth/callback/google` and `https://<your-domain>/api/auth/callback/google`.
6. Copy the client ID and secret into `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

Without these variables the shop still works for guests; the sign-in page says sign-in isn't set up.

---

## Security

- Secrets live in `.env.local`, which is gitignored. Only `.env.example` with placeholder values is committed.
- All form input (checkout, newsletter) is validated on the server.
- Prices and totals are always recomputed on the server; client values are never trusted. The bag in `localStorage` is display-only.
- Database access goes through Drizzle's query builder, never string-built SQL.
- Orders are saved in a single transaction; each line stores the price it was sold at.
- Customer details are HTML-escaped before going into emails, and emails are sent after the response so a Mailgun outage never blocks an order.
- Sessions are stored in the database (revocable, deleted on sign-out). Signing out also clears every cookie the site set and all browser storage, including the bag and the OAuth flow uses PKCE. Sign-in redirects only accept paths on this site.
- Payments are never trusted from the browser: every Paystack callback and webhook is verified with Paystack's API using the secret key, the amount and currency must match the order, and webhooks must carry a valid HMAC-SHA512 signature. Marking an order paid is idempotent, so the email goes out once.
- Order pages are addressed by a random UUID, are not indexed by search engines, and return 404 for malformed or unknown IDs.

To report a vulnerability, contact the author privately rather than opening a public issue.

---

## How to Contribute?

1. Fork the repo and create a branch from `main`, named after the change type, e.g. `feat/checkout-page`.
2. Keep each change small and focused.
3. Run `npm run lint`, `npm run typecheck` and `npm run build` before pushing.
4. Use commit messages in the form `type: short message`, where type is one of `feat`, `fix`, `chore`, `ci`, `refactor`. No scope.
5. Open a pull request against `main` describing what changed and why.

---

## What's Next?

- [x] Design tokens and fonts from the Oja design
- [x] Home page
- [x] Product page
- [x] Bag
- [x] Checkout page
- [x] Online payment through Paystack
- [ ] Discount codes
- [ ] Catalogue search
- [ ] Neon Postgres with Drizzle
- [ ] Mailgun order confirmation emails
- [ ] Google sign-in
- [x] CI workflow for lint, typecheck and build

---

## License

No license has been chosen yet, so all rights are reserved by the author.

---

## Acknowledgements

- [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [Drizzle ORM](https://orm.drizzle.team), [Auth.js](https://authjs.dev), [Zod](https://zod.dev)
- [Neon](https://neon.tech) and [Mailgun](https://www.mailgun.com)
- README structure based on [15 Essential Sections Every README Needs](https://dev.to/georgekobaidze/15-essential-sections-every-readme-needs-give-your-project-what-it-deserves-fie) by George Kobaidze

### Photography

Product and shop photos are from [Unsplash](https://unsplash.com/?utm_source=oja_shop&utm_medium=referral), used under the [Unsplash License](https://unsplash.com/license). Thanks to:

- [Aaron Burden](https://unsplash.com/@aaronburden?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/fountain-pen-on-spiral-book-xG8IQMqMITM?utm_source=oja_shop&utm_medium=referral)
- [Agata Ciosek](https://unsplash.com/@agataciosek?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/an-old-white-pot-sitting-in-the-grass-next-to-a-tree-HU7AOjOIHYk?utm_source=oja_shop&utm_medium=referral)
- [Alex Tyson](https://unsplash.com/@alextyson195?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-close-up-of-a-bunch-of-hooks-on-a-wall-rm7SaIVFhwI?utm_source=oja_shop&utm_medium=referral)
- [Ali Mucci](https://unsplash.com/@alimucci?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-textile-on-brown-wooden-chair-3Sz45ULJmUE?utm_source=oja_shop&utm_medium=referral)
- [Allec Gomes](https://unsplash.com/@allecgomes?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-brown-vase-sitting-on-top-of-a-table-CDuhbnnvBFA?utm_source=oja_shop&utm_medium=referral)
- [Anastasiia Grigorev](https://unsplash.com/@nasya_snap?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/person-weaving-wicker-basket-outdoors-rc3_BU_eghc?utm_source=oja_shop&utm_medium=referral)
- [Andrea Scully](https://unsplash.com/@andreacarole?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wheat-in-close-up-photography-X5xP4JmU5JA?utm_source=oja_shop&utm_medium=referral)
- [Andrew Valdivia](https://unsplash.com/@donovan_valdivia?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wooden-spoons-in-brown-wooden-cup-4lUI9_v0Sos?utm_source=oja_shop&utm_medium=referral)
- [Angelo Casto](https://unsplash.com/@jddartphotographer?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/wooden-spoons-and-a-cup-sit-under-light-_GNC1OBpwNs?utm_source=oja_shop&utm_medium=referral)
- [Annie Spratt](https://unsplash.com/@anniespratt?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-ceramic-mug-on-wooden-table-top-n42ogaQn32o?utm_source=oja_shop&utm_medium=referral)
- [C. Teacher](https://unsplash.com/@c_teacher?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wooden-brushes-B3Gg6d4vz-Q?utm_source=oja_shop&utm_medium=referral)
- [cafeconcetto](https://unsplash.com/@cafeconcetto?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-group-of-stones-on-a-white-surface-PKgE-Tw68RU?utm_source=oja_shop&utm_medium=referral)
- [Clay Banks](https://unsplash.com/@claybanks?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-wooden-table-topped-with-white-plates-and-a-vase-filled-with-flowers-5y71Otj5xek?utm_source=oja_shop&utm_medium=referral)
- [Content Pixie](https://unsplash.com/@contentpixie?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-close-up-of-a-vase-14Xl_B4Apk4?utm_source=oja_shop&utm_medium=referral)
- [Crissy Jarvis](https://unsplash.com/@crissyjarvis?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/six-piled-clear-shot-glasses-XLOx2BXzZp4?utm_source=oja_shop&utm_medium=referral)
- [Debby Hudson](https://unsplash.com/@hudsoncrafted?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/wheat-grass-and-cake-server-on-gray-textile-bTJe8Wseia0?utm_source=oja_shop&utm_medium=referral), [2](https://unsplash.com/photos/three-apples-sitting-on-top-of-a-piece-of-cloth-F8eK2h1LtAc?utm_source=oja_shop&utm_medium=referral)
- [Decima Athens](https://unsplash.com/@decimaandathens?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-bathroom-sink-with-a-gold-faucet-next-to-it-_m9IR6Wj-_I?utm_source=oja_shop&utm_medium=referral)
- [Diana Polekhina](https://unsplash.com/@diana_pole?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-notebook-with-pen-on-top-1ixT36dfuSQ?utm_source=oja_shop&utm_medium=referral)
- [Dominik Scythe](https://unsplash.com/@drscythe?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/person-using-chisel-while-curving-wood-3cIvvzjE6Lk?utm_source=oja_shop&utm_medium=referral)
- [Earl Wilcox](https://unsplash.com/@earl_plannerzone?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/person-holding-round-clay-pot--aebrWVmr80?utm_source=oja_shop&utm_medium=referral)
- [Elist Nguyen](https://unsplash.com/@hieuanhcauam?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/shelves-filled-with-various-ceramic-vases-and-pots-oQdfsQr53KE?utm_source=oja_shop&utm_medium=referral)
- [Eric Prouzet](https://unsplash.com/@eprouzet?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/shallow-focus-photo-of-broom-rZId_qIS8-c?utm_source=oja_shop&utm_medium=referral)
- [Fenghua](https://unsplash.com/@fenghua1975?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/person-preparing-food-in-a-large-mortar-and-pestle-UjQ6GxRF2qA?utm_source=oja_shop&utm_medium=referral)
- [Florencia Simonini](https://unsplash.com/@florenciasimonini?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-stack-of-towels-sitting-on-top-of-a-wooden-shelf--QObqDyjdNo?utm_source=oja_shop&utm_medium=referral)
- [Francisco Hernández](https://unsplash.com/@hernandezulloa?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-and-pink-floral-cooking-pot-on-stove-GsgeJvo9MTs?utm_source=oja_shop&utm_medium=referral)
- [Gaelle Marcel](https://unsplash.com/@gaellemarcel?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/stainless-steel-spoon-and-fork-CkInCM8e1ig?utm_source=oja_shop&utm_medium=referral)
- [Giulia Bertelli](https://unsplash.com/@giulia_bertelli?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-pile-of-old-envelopes-sitting-on-top-of-a-bed-l7fpQFnTCNY?utm_source=oja_shop&utm_medium=referral)
- [Gleb Paniotov](https://unsplash.com/@paniotovvv?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-towel-hanging-on-a-cabinet-in-a-kitchen-_nWvFy6pZGQ?utm_source=oja_shop&utm_medium=referral)
- [Hayley Maxwell](https://unsplash.com/@hayleymaxwell?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/gold-and-silver-pen-on-brown-envelope-bdvycycdu-M?utm_source=oja_shop&utm_medium=referral)
- [ilpadre](https://unsplash.com/@ilpadre?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-wall-mounted-hook-with-a-fish-design-on-it--m9xxr5Fi64?utm_source=oja_shop&utm_medium=referral)
- [Jacob Granneman](https://unsplash.com/@madhatter_granneman?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wooden-brush-on-clear-glass-jar-FrDnoB33yGA?utm_source=oja_shop&utm_medium=referral)
- [Janosch Lino](https://unsplash.com/@janoschlino?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/three-clear-drinking-glass-on-table-7b1W1mcwekw?utm_source=oja_shop&utm_medium=referral)
- [Jason Dela Cueva](https://unsplash.com/@jasondcva17?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-key-chain-and-a-key-chain-on-a-desk-NduqeuVp0sA?utm_source=oja_shop&utm_medium=referral)
- [Jocelyn Morales](https://unsplash.com/@molnj?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-ceramic-cup-on-white-ceramic-saucer-85u5oGSBJ1s?utm_source=oja_shop&utm_medium=referral)
- [John Onaeko](https://unsplash.com/@iyinoluwaonaeko?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wooden-mortar-and-pestle-oIkYZx3NyhU?utm_source=oja_shop&utm_medium=referral)
- [Julia Zolotova](https://unsplash.com/@juliazolotova?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/clear-drinking-glass-on-table-KHhhpr8_GAs?utm_source=oja_shop&utm_medium=referral)
- [Katie Rodriguez](https://unsplash.com/@katertottz?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/minimalist-photography-of-hand-tools-hanged-on-wall-NP9kbCXeVK0?utm_source=oja_shop&utm_medium=referral)
- [Katja Vogt](https://unsplash.com/@folkmade?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/two-white-ceramic-mug-CipURjPCXOo?utm_source=oja_shop&utm_medium=referral)
- [Kelly Sikkema](https://unsplash.com/@kellysikkema?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-notepad-with-a-pen-on-top-of-it-next-to-a-mug-JKFBG03gxMw?utm_source=oja_shop&utm_medium=referral), [2](https://unsplash.com/photos/white-and-gray-checked-board-q3blHqtnhog?utm_source=oja_shop&utm_medium=referral)
- [Lisa Anna](https://unsplash.com/@lisaanna195?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-coat-rack-with-hooks-and-a-coat-hanging-on-it-OcorWmWvF4w?utm_source=oja_shop&utm_medium=referral)
- [Louis Hansel](https://unsplash.com/@louishansel?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wooden-spoon-on-gray-textile-sth3hzzt7Pk?utm_source=oja_shop&utm_medium=referral)
- [MADEINEGYPT.CA](https://unsplash.com/@egycan?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-gray-towel-folded-on-top-of-a-bed-46g2RzaaxJ0?utm_source=oja_shop&utm_medium=referral)
- [Mads Leif Hansen](https://unsplash.com/@mads_leif_hansen?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/stack-of-clean-white-towels-on-a-surface-qPNgpYUCW0c?utm_source=oja_shop&utm_medium=referral)
- [Mae Mu](https://unsplash.com/@picoftasty?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/breads-on-wicker-basket-Ehtxtp9Ykvo?utm_source=oja_shop&utm_medium=referral), [2](https://unsplash.com/photos/assorted-breads-in-basket-Emhz3miT6mo?utm_source=oja_shop&utm_medium=referral)
- [Marius](https://unsplash.com/@14sica?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/cooked-potatoes-in-a-rustic-red-enamel-pot-Nz-GsKA4ziI?utm_source=oja_shop&utm_medium=referral)
- [Masha](https://unsplash.com/@mashauu?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/group-of-dried-gourds-for-sale-N2w0lxWfm5M?utm_source=oja_shop&utm_medium=referral)
- [Mediamodifier](https://unsplash.com/@mediamodifier?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-printer-paper-on-brown-envelope-ehI8qokwP7s?utm_source=oja_shop&utm_medium=referral), [2](https://unsplash.com/photos/white-printer-paper-on-brown-wooden-table-Qji5ChUkI_w?utm_source=oja_shop&utm_medium=referral)
- [Mhmd Sedky](https://unsplash.com/@sedky?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-ceramic-vase-on-white-table-cloth-7JqR7Vdv8aQ?utm_source=oja_shop&utm_medium=referral)
- [micheile henderson](https://unsplash.com/@micheile?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/assorted-textile-N_wGDmRL4hQ?utm_source=oja_shop&utm_medium=referral)
- [Moisés Fattel](https://unsplash.com/@moises_fattel?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-close-up-of-a-bowl-of-fruit-on-a-table-RtBk6Qq_tL4?utm_source=oja_shop&utm_medium=referral)
- [Nadia Storm](https://unsplash.com/@nadiastorm?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/green-grapes-on-brown-wooden-heart-shaped-tray-IAWH_Z98C38?utm_source=oja_shop&utm_medium=referral)
- [Neal E. Johnson](https://unsplash.com/@neal_johnson?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-and-black-brush-on-brown-wooden-table-V0cSTljC92k?utm_source=oja_shop&utm_medium=referral)
- [Nikolas Noonan](https://unsplash.com/@nikolasnoonan?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-cooking-pot-Sfcr4Gd-jEk?utm_source=oja_shop&utm_medium=referral)
- [Octavian-Dan Craciun](https://unsplash.com/@octadan?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wooden-mortar-YvtI0qR5KaE?utm_source=oja_shop&utm_medium=referral)
- [Peter Burdon](https://unsplash.com/@peterburdon?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-and-black-floral-textile-AFOgwEXeTVc?utm_source=oja_shop&utm_medium=referral)
- [PhotographyCourse](https://unsplash.com/@photographycoursenet?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-clay-bowls-on-black-surface-oWsOlr0_RXo?utm_source=oja_shop&utm_medium=referral)
- [Photos of Korea](https://unsplash.com/@photosofkorea?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-brass-instrument-with-a-light-2VRGNEFkRns?utm_source=oja_shop&utm_medium=referral)
- [Raghavendra V. Konkathi](https://unsplash.com/@rangokonk?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-wooden-brush-and-a-wooden-cup-on-a-white-background-sClZuSpSEzU?utm_source=oja_shop&utm_medium=referral)
- [Roberto Sorin](https://unsplash.com/@roberto_sorin?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-man-is-making-a-vase-out-of-clay-K9BCfDWFiZI?utm_source=oja_shop&utm_medium=referral)
- [Rumman Amin](https://unsplash.com/@rumanamin?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-wooden-cutting-board-sitting-on-top-of-a-rug-ujPsObMXapE?utm_source=oja_shop&utm_medium=referral), [2](https://unsplash.com/photos/turned-on-laptop-beside-phone-wallet-watch-pens-and-coins-on-top-of-wooden-tray-0pP_ekTFcvk?utm_source=oja_shop&utm_medium=referral)
- [Sabine Freiberger](https://unsplash.com/@bine_1?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-wooden-mortar-and-pestle-with-salt-uMbJ2JRdNe4?utm_source=oja_shop&utm_medium=referral)
- [Samantha Fields](https://unsplash.com/@atlsamantha2020?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-wooden-case-sitting-on-top-of-a-stone-wall-XvjX7OBHOQk?utm_source=oja_shop&utm_medium=referral)
- [Sanchit Singh](https://unsplash.com/@sanchit305?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-couple-of-empty-glasses-KCc0jge74oo?utm_source=oja_shop&utm_medium=referral)
- [Sarah Evans](https://unsplash.com/@illuztrate?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-paper-on-white-and-blue-round-plate-y3BCFNsg4QE?utm_source=oja_shop&utm_medium=referral)
- [Silke](https://unsplash.com/@_silkisilki?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-towel-on-white-metal-rack-N_7uDqHZxao?utm_source=oja_shop&utm_medium=referral)
- [Sincerely Media](https://unsplash.com/@sincerelymedia?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-and-black-chocolate-bar-7oJwvrTnNYo?utm_source=oja_shop&utm_medium=referral), [2](https://unsplash.com/photos/white-and-brown-cake-on-white-textile-gKqUuChJ83g?utm_source=oja_shop&utm_medium=referral), [3](https://unsplash.com/photos/person-holding-brown-stone-fragment-UmDfdonflT0?utm_source=oja_shop&utm_medium=referral)
- [Smoke Honest](https://unsplash.com/@smokehonest?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-pair-of-brown-leather-shoes-w1dIDaA1-IA?utm_source=oja_shop&utm_medium=referral)
- [Tadeusz Zachwieja](https://unsplash.com/@haiku_ted?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/wooden-cutting-boards-with-natural-grain-patterns-o6FqxW6IAUI?utm_source=oja_shop&utm_medium=referral)
- [Thanos Pal](https://unsplash.com/@thanospal?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-rectangular-box-on-persons-hand-v_Cc1qxKuBs?utm_source=oja_shop&utm_medium=referral)
- [the blowup](https://unsplash.com/@theblowup?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/white-bath-towel-on-white-ceramic-bathtub-4dUC7Fine5g?utm_source=oja_shop&utm_medium=referral)
- [Thom Bradley](https://unsplash.com/@thombradley?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/apple-magic-mouse-beside-apple-magic-mouse-on-brown-wooden-table-FQVjx62rzMU?utm_source=oja_shop&utm_medium=referral)
- [tommao wang](https://unsplash.com/@tommaomaoer?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/ceramic-bowls-on-wooden-display-table-ZxZeIZ_h2jY?utm_source=oja_shop&utm_medium=referral)
- [Uliana Kopanytsia](https://unsplash.com/@ulian_ka?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/two-clear-glass-jars-on-brown-wooden-floating-shelf-Exf1N6_UTZM?utm_source=oja_shop&utm_medium=referral)
- [William Boateng](https://unsplash.com/@william_boateng?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/a-close-up-of-a-feather-ZlEMCjRi7SU?utm_source=oja_shop&utm_medium=referral)
- [ZACHARY STAINES](https://unsplash.com/@zaccastravels?utm_source=oja_shop&utm_medium=referral): [1](https://unsplash.com/photos/brown-wicker-basket-lot-0kvS01RVKQI?utm_source=oja_shop&utm_medium=referral)

---

## Author

**Damola Adegbite**

- GitHub: [@dax-side](https://github.com/dax-side)
- Website: [damola.me](https://damola.me)
