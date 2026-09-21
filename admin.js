// Admin panel. Reading the catalogue is public; every change goes out with
// the admin token, so the panel first has to log in.

const TOKEN_KEY = 'celicatesen.token';

let productos = [];

const loginSection = document.getElementById('loginSection');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const adminSection = document.getElementById('adminSection');
const logoutButton = document.getElementById('logoutButton');
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const formMessage = document.getElementById('formMessage');

/* Sesión ------------------------------------------------------------------ */

const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked: the session just won't survive a reload.
  }
};

function mostrarPanel(loggedIn) {
  loginSection.hidden = loggedIn;
  adminSection.hidden = !loggedIn;
}

function cerrarSesion(motivo) {
  setToken(null);
  mostrarPanel(false);
  if (motivo) mostrarMensajeLogin(motivo);
}

/* Mensajes ---------------------------------------------------------------- */

function mostrarMensaje(mensaje, tipo = 'success') {
  const caja = document.createElement('div');
  caja.className = tipo;
  caja.textContent = mensaje;
  formMessage.innerHTML = '';
  formMessage.appendChild(caja);
  setTimeout(() => {
    formMessage.innerHTML = '';
  }, 3000);
}

function mostrarMensajeLogin(mensaje) {
  const caja = document.createElement('div');
  caja.className = 'error';
  caja.textContent = mensaje;
  loginMessage.innerHTML = '';
  loginMessage.appendChild(caja);
}

function limpiarErrores() {
  document.querySelectorAll('.error').forEach((element) => {
    element.textContent = '';
  });
}

function mostrarErrores(errores) {
  Object.keys(errores).forEach((campo) => {
    const errorElement = document.getElementById(`${campo}Error`);
    if (errorElement) errorElement.textContent = errores[campo];
  });
}

/* API --------------------------------------------------------------------- */

// Every authenticated call funnels through here, so an expired token logs the
// panel out in one place instead of failing differently on each screen.
async function apiFetch(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    cerrarSesion('Tu sesión venció. Entrá de nuevo.');
    throw new Error('unauthorized');
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  return body;
}

/* Catálogo ---------------------------------------------------------------- */

const formatearPrecio = (precio) =>
  precio > 0 ? `$${Number(precio).toFixed(2)}` : 'A confirmar';

function renderizarTabla() {
  productsTableBody.innerHTML = '';

  productos.forEach((producto) => {
    const row = document.createElement('tr');

    const celdaImagen = document.createElement('td');
    const imagen = document.createElement('img');
    imagen.src = producto.imageUrl || 'imagenes/Logo.png';
    imagen.alt = producto.name;
    imagen.className = 'product-image';
    celdaImagen.appendChild(imagen);

    const celdas = [
      producto.name,
      producto.brand,
      producto.description,
      formatearPrecio(producto.price),
    ].map((valor) => {
      const celda = document.createElement('td');
      celda.textContent = valor;
      return celda;
    });

    const celdaAcciones = document.createElement('td');
    const boton = document.createElement('button');
    boton.className = 'btn btn-danger';
    boton.textContent = 'Eliminar';
    boton.addEventListener('click', () => eliminarProducto(producto._id));
    celdaAcciones.appendChild(boton);

    row.append(celdaImagen, ...celdas, celdaAcciones);
    productsTableBody.appendChild(row);
  });
}

async function cargarProductos() {
  try {
    const body = await apiFetch('/products');
    productos = body.products;
    renderizarTabla();
  } catch (error) {
    if (error.message !== 'unauthorized') {
      mostrarMensaje('No se pudo cargar el catálogo', 'error');
    }
  }
}

async function agregarProducto(datos) {
  try {
    const body = await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    productos.push(body.product);
    renderizarTabla();
    mostrarMensaje('Producto agregado exitosamente');
    productForm.reset();
  } catch (error) {
    if (error.message !== 'unauthorized') {
      mostrarMensaje(`No se pudo agregar el producto: ${error.message}`, 'error');
    }
  }
}

async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de que querés eliminar este producto?')) return;

  try {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    productos = productos.filter((producto) => producto._id !== id);
    renderizarTabla();
    mostrarMensaje('Producto eliminado exitosamente');
  } catch (error) {
    if (error.message !== 'unauthorized') {
      mostrarMensaje(`No se pudo eliminar el producto: ${error.message}`, 'error');
    }
  }
}

/* Validación -------------------------------------------------------------- */

function validarCampo(valor, campo, minLength = 1) {
  if (!valor || valor.trim().length < minLength) {
    return `El campo ${campo} es obligatorio y debe tener al menos ${minLength} caracteres`;
  }
  return '';
}

// The image can be an absolute URL or a path relative to the site, which is
// what the products seeded from the original gallery use.
function validarImagen(valor) {
  if (!valor || !valor.trim()) return 'La imagen es obligatoria';
  if (valor.startsWith('imagenes/') || valor.startsWith('/')) return '';
  try {
    new URL(valor);
    return '';
  } catch {
    return 'Poné una URL válida o una ruta que empiece con imagenes/';
  }
}

function validarFormulario(datos) {
  const errores = {};

  const sku = validarCampo(datos.sku, 'SKU', 3);
  if (sku) errores.sku = sku;
  else if (productos.some((producto) => producto.sku === datos.sku)) {
    errores.sku = 'Ese SKU ya existe, usá otro';
  }

  const name = validarCampo(datos.name, 'nombre', 3);
  if (name) errores.name = name;

  const brand = validarCampo(datos.brand, 'marca', 2);
  if (brand) errores.brand = brand;

  const description = validarCampo(datos.description, 'descripción', 10);
  if (description) errores.description = description;

  if (Number.isNaN(datos.price) || datos.price < 0) {
    errores.price = 'El precio no puede ser negativo';
  }

  if (Number.isNaN(datos.stock) || datos.stock < 0) {
    errores.stock = 'El stock no puede ser negativo';
  }

  const category = validarCampo(datos.category, 'categoría', 2);
  if (category) errores.category = category;

  const imageUrl = validarImagen(datos.imageUrl);
  if (imageUrl) errores.imageUrl = imageUrl;

  return errores;
}

/* Eventos ----------------------------------------------------------------- */

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMessage.innerHTML = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      mostrarMensajeLogin(body.message || 'No pudimos iniciar sesión');
      return;
    }
    if (!body.user?.isAdmin) {
      mostrarMensajeLogin('Esa cuenta no administra el catálogo');
      return;
    }

    setToken(body.token);
    loginForm.reset();
    mostrarPanel(true);
    cargarProductos();
  } catch {
    mostrarMensajeLogin('No pudimos contactar al servidor');
  }
});

logoutButton.addEventListener('click', () => cerrarSesion());

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  limpiarErrores();

  const datos = {
    sku: document.getElementById('sku').value.trim(),
    name: document.getElementById('name').value.trim(),
    brand: document.getElementById('brand').value.trim(),
    description: document.getElementById('description').value.trim(),
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value, 10),
    category: document.getElementById('category').value.trim(),
    imageUrl: document.getElementById('imageUrl').value.trim(),
  };

  const errores = validarFormulario(datos);
  if (Object.keys(errores).length) {
    mostrarErrores(errores);
    mostrarMensaje('Corregí los errores del formulario', 'error');
    return;
  }

  agregarProducto(datos);
});

/* Arranque ---------------------------------------------------------------- */

if (getToken()) {
  mostrarPanel(true);
  cargarProductos();
} else {
  mostrarPanel(false);
}
