# Backend de Celicatesen

Este es un backend independiente con Node.js + Express que ofrece una API REST para una única entidad (Producto) con operaciones CRUD completas y validaciones.

Características
- Modelo de Producto con al menos 7 campos y validaciones de Mongoose.
- Timestamps (`createdAt`, `updatedAt`).
- Middleware de autenticación basado en JWT (protege los endpoints de creación/actualización/eliminación).
- Manejo claro de errores y códigos HTTP significativos.

Inicio rápido

1. Copia `.env.example` a `.env` y configura `MONGO_URL` y `SECRET`.

2. Instala dependencias:

```powershell
cd backend
npm install
```

3. Ejecuta el servidor (desarrollo):

```powershell
npm run dev
```

Endpoints de la API

URL base: http://localhost:3000/api

- GET /products — listar todos los productos
- GET /products/:id — obtener un producto por id
- POST /products — crear producto (protegido — Authorization: Bearer <token>)
- PUT /products/:id — actualizar producto (protegido)
- DELETE /products/:id — eliminar producto (protegido)

Ejemplo curl (crear)

```bash
curl -X POST http://localhost:3000/api/products \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <token>" \\
  -d '{"name":"Alfajor","brand":"Corominas","description":"Delicioso alfajor","price":120,"imageUrl":"http://example.com/img.jpg","stock":10,"category":"alfajores","sku":"ALF-001"}'
```
