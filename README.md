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
| Home page | Hero, shop by room, catalogue with category filters, how it works, newsletter signup | Done |
| Product page | Image gallery, finish options, quantity, details table, "goes well with" | Done |
| Bag | Add, update and remove items with a running total | Done |
| Checkout | Delivery or pickup, contact and address details, payment method, server-validated order with server-side pricing | Done |
| Persistence | Products, orders, order lines and newsletter subscribers stored in Neon Postgres | Done |
| Order page | Confirmation page for each order, linked from checkout | Done |
| Confirmation emails | Order confirmation sent through Mailgun | Planned |
| Google sign-in | Sign in with a Google account | Planned |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | [Neon](https://neon.tech) Postgres with [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [Auth.js](https://authjs.dev) with Google |
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
  ├── Auth.js ──────── Google OAuth (Google Cloud Console)
  └── Mailgun ──────── order confirmation emails
```

Pages render on the server. The bag lives on the client until checkout, where the server recomputes totals from database prices before creating the order and sending the confirmation email.

---

## Project Structure

```text
.
├── src/
│   ├── app/
│   │   ├── (shop)/     # Storefront routes sharing the header and footer
│   │   ├── checkout/   # Checkout route with its own header
│   │   ├── globals.css # Design tokens (colours, fonts, display type)
│   │   └── layout.tsx  # Root layout and fonts
│   ├── components/     # Shared UI: header, footer, logo, icons, product cards
│   │   ├── bag/        # Bag state hook, bag button, add to bag, bag page view
│   │   ├── checkout/   # Checkout header, form fields, checkout form
│   │   ├── product/    # Product page gallery, purchase controls, recommendations
│   │   └── home/       # Home page sections
│   ├── db/             # Drizzle schema, connection, seed script and seed data
│   └── lib/            # Site config, queries, pricing, formatting, server actions
├── drizzle/            # Generated SQL migrations
├── AGENTS.md           # Rules for AI agents working on this repo
├── CLAUDE.md           # Points to AGENTS.md
├── .env.example        # Environment variable template
├── drizzle.config.ts   # Drizzle Kit config
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
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Insert or update the catalogue products (safe to re-run) |
| `npm run db:studio` | Browse the database with Drizzle Studio |

---

## Configuration

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL of the site, used in emails and auth callbacks |
| `DATABASE_URL` | Yes | Postgres connection string, e.g. your Neon pooled URL with `sslmode=require` |
| `STORE_ADDRESS` | No | Pickup address shown in the header, footer and emails |
| `STORE_OPENING_HOURS` | No | Store opening hours |
| `STORE_PHONE` | No | Contact phone number |
| `STORE_EMAIL` | No | Contact email address |
| `DELIVERY_DAYS` | No | Delivery time outside Lagos, e.g. `3–5` |
| `DELIVERY_FEE` | No | Delivery fee in naira. Defaults to `3500` |
| `FREE_DELIVERY_THRESHOLD` | No | Order value in naira above which delivery is free. Defaults to `50000` |
| `PAYMENT_PROVIDER` | No | Payment provider name shown at checkout |
| `RETURN_WINDOW_DAYS` | No | Number of days customers have to return items |

Store details fall back to bracketed placeholders such as `[STORE ADDRESS]` when unset, matching the design.

Auth and email variables will be added here as those features land.

---

## Security

- Secrets live in `.env.local`, which is gitignored. Only `.env.example` with placeholder values is committed.
- All form input (checkout, newsletter) is validated on the server.
- Prices and totals are always recomputed on the server; client values are never trusted. The bag in `localStorage` is display-only.
- Database access goes through Drizzle's query builder, never string-built SQL.
- Orders are saved in a single transaction; each line stores the price it was sold at.
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
- [ ] Online payment through a provider such as Paystack or Flutterwave
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

- [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [Drizzle ORM](https://orm.drizzle.team), [Auth.js](https://authjs.dev)
- [Neon](https://neon.tech) and [Mailgun](https://www.mailgun.com)
- README structure based on [15 Essential Sections Every README Needs](https://dev.to/georgekobaidze/15-essential-sections-every-readme-needs-give-your-project-what-it-deserves-fie) by George Kobaidze

---

## Author

**Damola Adegbite**

- GitHub: [@dax-side](https://github.com/dax-side)
- Website: [damola.me](https://damola.me)
