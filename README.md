# Celicatesen

A storefront and admin panel for [Celicatesen](https://www.instagram.com/celicatesen_/),
a gluten-free bakery, running on a REST API of its own.

## What it does

- **Storefront** — the catalogue is fetched from the API, so the bakery's
  products are whatever the panel says they are, not hardcoded markup.
- **Admin panel** — sign in, then create and remove products. Everything that
  changes data travels with an admin token.
- **REST API** — CRUD over the product entity, with Mongoose validation,
  timestamps and meaningful HTTP status codes. Reads are public, writes are not.

## Tech stack

- Frontend: HTML, CSS and vanilla JavaScript — no framework.
- Backend: Node.js, Express and MongoDB (Mongoose).
- Auth: JSON Web Tokens, with passwords hashed through bcrypt.
- Hosting: Vercel serves the static frontend and runs the API as a serverless
  function; the database is MongoDB Atlas.

## Layout

```
index.html, admin.html, style.css   the site
config.js                           where the frontend looks for the API
store.js                            fills the storefront catalogue
admin.js                            login and product management
api/index.js                        production entry point (Vercel function)
backend/                            the Express app
backend/index.js                    local entry point (a plain Node server)
backend/seed.js                     creates the admin account and the catalogue
```

## Running it locally

```bash
npm install
cp .env.example .env    # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed            # creates the admin account and the starting products
npm run dev             # API on http://localhost:3000
```

Then serve the site itself on any static server and open it. `config.js` points
the frontend at `http://localhost:3000/api` when it runs on localhost, and at
`/api` of the same origin everywhere else, so no URL has to be edited to deploy.

There are no defaults for `MONGO_URI` and `JWT_SECRET`: the server refuses to
start without them rather than falling back to something insecure.

## API

See [`backend/README.md`](backend/README.md) for the endpoints.

## Status

Built for a working bakery as the final project of a web development course,
then wired up and deployed.
