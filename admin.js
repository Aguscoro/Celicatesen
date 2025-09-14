
const ENDPOINT = 'https://68c60049442c663bd02611a0.mockapi.io/Productos';
let productos = [];

// Obtener productos desde MockAPI al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch(ENDPOINT);
        productos = await response.json();
        renderizarTabla();
    } catch (error) {
        mostrarMensaje('Error al cargar productos desde MockAPI', 'error');
    }
});

// Elementos del DOM
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const formMessage = document.getElementById('formMessage');

// validar ID único
function validarId(id) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return 'El ID debe ser un número mayor a 0';
    }
    
    // el ID ya existe
    if (productos.some(p => p.id === parseInt(id))) {
        return 'El ID ya existe, por favor usa otro';
    }
    
    return '';
}

// validar campos
function validarCampo(valor, campo, minLength = 1) {
    if (!valor || valor.trim().length < minLength) {
        return `El campo ${campo} es obligatorio y debe tener al menos ${minLength} caracteres`;
    }
    return '';
}

function validarPrecio(precio) {
    if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
        return 'El precio debe ser un número mayor a 0';
    }
    return '';
}

function validarURL(url) {
    try {
        new URL(url);
        return '';
    } catch {
        return 'La URL de la imagen no es válida';
    }
}

// limpiar mensaje errores
function limpiarErrores() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// mostrar mensaje exito o erorr
function mostrarMensaje(mensaje, tipo = 'success') {
    formMessage.innerHTML = `<div class="${tipo}">${mensaje}</div>`;
    setTimeout(() => {
        formMessage.innerHTML = '';
    }, 3000);
}

// recorrer array y agregar cada fila a la tabla
function renderizarTabla() {
    productsTableBody.innerHTML = '';
    
    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" 
                     onerror="this.src='imagenes/default-product.jpg'">
            </td>
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>${producto.descripcion}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">
                    Eliminar
                </button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

// agregar producto
async function agregarProducto(productoData) {
    const nuevoProducto = {
        nombre: productoData.nombre,
        marca: productoData.marca,
        descripcion: productoData.descripcion,
        precio: productoData.precio,
        imagen: productoData.imagen
    };

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        });
        const productoCreado = await response.json();
        productos.push(productoCreado);
        renderizarTabla();
        mostrarMensaje('Producto agregado exitosamente');
    } catch (error) {
        mostrarMensaje('Error al agregar producto en MockAPI', 'error');
    }
}

// eliminar producto
async function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
            productos = productos.filter(p => p.id != id);
            renderizarTabla();
            mostrarMensaje('Producto eliminado exitosamente');
        } catch (error) {
            mostrarMensaje('Error al eliminar producto en MockAPI', 'error');
        }
    }
}

// valida datos ingresados en el formulario
function validarFormulario(formData) {
    const errores = {};
    
    const errorId = validarId(formData.productoId);
    if (errorId) errores.productoId = errorId;
    
    const errorNombre = validarCampo(formData.nombre, 'nombre', 3);
    if (errorNombre) errores.nombre = errorNombre;
    
    const errorMarca = validarCampo(formData.marca, 'marca', 2);
    if (errorMarca) errores.marca = errorMarca;

    const errorDescripcion = validarCampo(formData.descripcion, 'descripción', 10);
    if (errorDescripcion) errores.descripcion = errorDescripcion;
    
    const errorPrecio = validarPrecio(formData.precio);
    if (errorPrecio) errores.precio = errorPrecio;

    const errorImagen = validarURL(formData.imagen);
    if (errorImagen) errores.imagen = errorImagen;
    
    return errores;
}

//mostrar errores en el formulario
function mostrarErrores(errores) {
    Object.keys(errores).forEach(campo => {
        const errorElement = document.getElementById(`${campo}Error`);
        if (errorElement) {
            errorElement.textContent = errores[campo];
        }
    });
}

// Event listener validar todos los campos y si hay eror mostrarlo // agrega producto y resetea el formulario
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    limpiarErrores();
    
    const formData = {
        productoId: document.getElementById('productoId').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        marca: document.getElementById('marca').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        imagen: document.getElementById('imagen').value.trim()
    };
    
    const errores = validarFormulario(formData);
    
    if (Object.keys(errores).length > 0) {
        mostrarErrores(errores);
        mostrarMensaje('Por favor, corrige los errores en el formulario', 'error');
        return;
    }
    
    agregarProducto(formData);

    productForm.reset();
});

// Inicializa la tabla al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderizarTabla();
});


