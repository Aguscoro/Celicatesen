# API de Celicatesen

API REST en Node.js + Express sobre MongoDB, con una entidad (Producto),
validaciones de Mongoose y autenticación por JWT.

La app vive acá y se sirve de dos maneras: `backend/index.js` la levanta como
servidor Node para desarrollo, y `api/index.js` la expone como función
serverless en Vercel. Es el mismo Express en los dos casos.

## Características

- Modelo de Producto con siete campos y validaciones de Mongoose.
- Timestamps (`createdAt`, `updatedAt`).
- Lectura pública; creación, edición y borrado sólo para el admin.
- No hay registro abierto: la cuenta de administrador la crea `npm run seed`.
- Manejo de errores con códigos HTTP significativos.

## Variables de entorno

Se configuran en la raíz del proyecto. Ver `.env.example`.

| Variable | Para qué |
|---|---|
| `MONGO_URI` | Conexión a MongoDB. Obligatoria. |
| `JWT_SECRET` | Firma y verificación de los tokens. Obligatoria, sin valor por defecto. |
| `PORT` | Puerto del servidor local. Por defecto 3000. |
| `CORS_ORIGIN` | Orígenes permitidos, separados por coma. Vacío = cualquiera. |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Sólo los lee `npm run seed`. |

Si falta `MONGO_URI` o `JWT_SECRET`, el proceso no arranca.

## Inicio rápido

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

`npm run seed` se puede volver a correr: crea el admin si no existe, le
resetea la contraseña si ya existe, e inserta sólo los productos cuyo SKU
todavía no esté en la base, así no pisa lo que se haya editado desde el panel.

## Endpoints

URL base: `http://localhost:3000/api` en local, `/api` en producción.

| Método | Ruta | Acceso |
|---|---|---|
| `POST` | `/login` | Público |
| `GET` | `/products` | Público |
| `GET` | `/products/:id` | Público |
| `POST` | `/products` | Admin |
| `PUT` | `/products/:id` | Admin |
| `DELETE` | `/products/:id` | Admin |
| `GET` | `/health` | Público |

Los endpoints protegidos esperan `Authorization: Bearer <token>`, con el token
que devuelve `/login`.

## Ejemplo

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"..."}'

# Crear un producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Brownie","brand":"Celicatesen","description":"Brownie sin gluten","price":3500,"imageUrl":"imagenes/Brownies.jpg","stock":10,"category":"porciones","sku":"CELI-010"}'
```
