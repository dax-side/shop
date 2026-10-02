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
| Home page | Hero, shop by room, catalogue with category filters, how it works, newsletter signup | Planned |
| Product page | Image gallery, finish options, quantity, details table, "goes well with" | Planned |
| Bag | Add, update and remove items with a running total | Planned |
| Checkout | Delivery or pickup, contact and address details, order summary | Planned |
| Persistence | Products, orders and customers stored in Neon Postgres | Planned |
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
| Linting | ESLint |

---

## Architecture

```text
Browser
  │
  ▼
Next.js app (server components, route handlers, server actions)
  ├── Neon Postgres ── products, orders, customers (via Drizzle)
  ├── Auth.js ──────── Google OAuth (Google Cloud Console)
  └── Mailgun ──────── order confirmation emails
```

Pages render on the server. The bag lives on the client until checkout, where the server recomputes totals from database prices before creating the order and sending the confirmation email.

---

## Project Structure

```text
.
├── src/
│   └── app/            # App Router routes, layouts and global styles
├── AGENTS.md           # Rules for AI agents working on this repo
├── CLAUDE.md           # Points to AGENTS.md
├── .env.example        # Environment variable template
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

### Setup

```bash
git clone https://github.com/dax-side/shop.git
cd shop
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate route types and run the TypeScript compiler |

---

## Configuration

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL of the site, used in emails and auth callbacks |

Database, auth and email variables will be added here as those features land.

---

## Security

- Secrets live in `.env.local`, which is gitignored. Only `.env.example` with placeholder values is committed.
- All form input (checkout, newsletter) is validated on the server.
- Prices and totals are always recomputed on the server; client values are never trusted.
- Database access goes through Drizzle's query builder, never string-built SQL.

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

- [ ] Design tokens and fonts from the Oja design
- [ ] Home page
- [ ] Product page
- [ ] Bag
- [ ] Checkout page
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
