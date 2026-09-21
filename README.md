# Celicatesen

A storefront and admin panel for [Celicatesen](https://www.instagram.com/celicatesen_/),
a gluten-free bakery, with a REST API of its own.

## What it does

- **Storefront** — a catalogue of the bakery's products.
- **Admin panel** — a separate, authenticated area to create, edit and remove
  products without touching the database by hand.
- **REST API** — full CRUD over the product entity, with Mongoose validation,
  timestamps and meaningful HTTP status codes.

## Tech stack

- Frontend: HTML, CSS and vanilla JavaScript — no framework.
- Backend: Node.js, Express and MongoDB (Mongoose).
- Auth: JSON Web Tokens, with passwords hashed through bcrypt. Only the write
  endpoints are protected.

## Running it locally

The frontend and the backend are independent. The backend has its own
[README](backend/README.md) with the full setup.

    cd backend
    npm install
    cp .env.example .env   # set MONGO_URI and JWT_SECRET
    npm run dev

Then open `index.html` in a browser.

## Status

Built for a working bakery as the final project of a web development course.
Not deployed yet — the frontend and the API will be hosted separately.
