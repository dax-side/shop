<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Guidance for AI agents working on **Oja Supply Co.**, an online shop for everyday household goods (Lagos, Nigeria). The design lives in `Oja_Supply_Co._Shop_1.pdf`; match it.

## Workflow

Work in small, incremental steps. Every new feature, refactor or fix gets its own branch, PR and merge. Never batch unrelated changes.

1. Branch from the latest default branch.
2. Build the feature in small steps and **commit each change as you go**: one commit per change (a table, an endpoint, a screen, a fix), not one big commit at the end.
3. Run the project's lint, typecheck and tests before each commit.
4. Give every commit a conventional message (see below).
5. Open a PR for the feature and merge it yourself once checks pass. Use **rebase merge** so every commit lands on `main` as written. Never squash.
6. Start the next change from the updated default branch.

Branch names follow the commit type, e.g. `feat/checkout-page`, `fix/bag-total`. Never push directly to `main`; everything lands through a PR.

## Git identity

All commits are authored by the repo owner, never by an AI. Before committing, make sure the repo-local identity is set:

```bash
git config user.name "Damola Adegbite"
git config user.email "101389494+dax-side@users.noreply.github.com"
```

## Commit messages

Format: `type: short message`

Allowed types: `feat`, `fix`, `chore`, `ci`, `refactor`.

- No scope. Write `feat: add checkout page`, not `feat(checkout): ...`.
- Lowercase, imperative, no trailing period, ideally under 60 characters.
- One logical change per commit.
- No `Co-Authored-By` lines, no session links and no other AI attribution in commits or PR descriptions.

## README

Keep `README.md` current with every change that affects setup, features, configuration or structure. It must follow this section order, with a `---` rule between sections:

1. Title and Introduction
2. Table of Contents
3. About
4. Features
5. Tech Stack
6. Architecture
7. Project Structure
8. Getting Started
9. Configuration
10. Security
11. How to Contribute?
12. What's Next?
13. License
14. Acknowledgements
15. Author

Guidelines:

- Use Markdown properly (headings, tables, code blocks), not plain text.
- Features stay high level; implementation detail belongs in Architecture or Configuration.
- Getting Started steps must actually work. Test them.
- Configuration documents every environment variable, with no real secrets.
- Skip a section only if it truly does not apply.

## Stack

- Next.js (App Router, `src/` directory) with TypeScript and Tailwind CSS
- Neon Postgres with Drizzle ORM
- Auth.js with Google as the provider
- Paystack for payments (test mode with `sk_test_` keys)
- Mailgun for transactional email
- Mobile app in `mobile/`: Expo (React Native, expo-router) with its own `package.json`. It talks to the website's `/api` routes; it never reads the database directly.

Checks to run before every commit: `npm run lint`, `npm run typecheck`, `npm run build`. For changes in `mobile/`, run `npm run lint` and `npm run typecheck` inside `mobile/`.

Database changes: edit `src/db/schema.ts`, run `npm run db:generate`, and commit the new file in `drizzle/` with the change. CI fails if the schema and migrations drift apart.

## Product scope

Built from the design: home (hero, shop by room, catalogue with category filters, how it works, newsletter signup, footer), product page (gallery, finish options, quantity, add to bag, details, "goes well with"), and a bag.

The mobile app follows the app pages of the design (`Oja_Supply_Co._Shop-selection.pdf`, pages 6-10): sign-in, catalogue, product, bag (synced with the website) and account.

Planned features, each shipped as its own PR:

- Checkout page.
- Persistence in Neon Postgres via Drizzle.
- Order confirmation emails via Mailgun.
- Google sign-in via Google Cloud Console.

## Website and app share one backend

- Both clients use the same `/api` endpoints. The website authenticates with its Auth.js session cookie, the app with a `Bearer` token; both resolve to the same user through `getRequestUser()`.
- A signed-in user's bag lives in the database, so it is the same on the website and in the app. Changes reach the other client through the long-poll endpoint `/api/cart/changes`.
- Never trust the client: prices, totals and ownership checks happen on the server for both clients.

## Design rules

- Prices are in Naira (`₦`), formatted like `₦32,000`.
- Palette is warm off-white background with near-black text and a single red accent for "NEW" tags.
- Type: heavy condensed uppercase headings, italic serif for taglines, monospace for small labels and product numbers, clean sans for body.
- Placeholders in the design such as `[STORE ADDRESS]`, `[DELIVERY DAYS]`, `[RETURN WINDOW]`, `[PHONE]` and `[EMAIL]` must come from config or content, not be hardcoded.
- Layouts must work on mobile as well as desktop.

## Security

- Never commit secrets. Keep keys in `.env` (gitignored) and maintain a `.env.example` with placeholder values.
- Validate and sanitise all input on the server, including checkout and newsletter forms.
- Never trust prices or totals from the client; recompute them on the server.
- Use parameterised queries or the database client's query builder only.

## Code style

- Match the surrounding code: naming, comment density and idiom.
- Prefer small, readable components and functions.
- Do not add dependencies without a clear reason, and mention new ones in the PR.
