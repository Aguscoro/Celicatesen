# Celicatesen Backend

This is a standalone Node.js + Express backend providing a REST API for a single entity (Product) with full CRUD operations and validations.

Features
- Product model with at least 7 fields and Mongoose validations.
- Timestamps (`createdAt`, `updatedAt`).
- JWT-based auth middleware (protects create/update/delete endpoints).
- Clear error handling and meaningful HTTP status codes.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URL` and `SECRET`.

2. Install dependencies:

```powershell
cd backend
npm install
```

3. Run the server (development):

```powershell
npm run dev
```

API endpoints

Base URL: http://localhost:3000/api

- GET /products — list all products
- GET /products/:id — get a product by id
- POST /products — create product (protected — Authorization: Bearer <token>)
- PUT /products/:id — update product (protected)
- DELETE /products/:id — delete product (protected)

Example curl (create)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Alfajor","brand":"Corominas","description":"Delicioso alfajor","price":120,"imageUrl":"http://example.com/img.jpg","stock":10,"category":"alfajores","sku":"ALF-001"}'
```
