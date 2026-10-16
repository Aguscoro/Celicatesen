// Fills the storefront gallery from the API. If the call fails the section
// says so instead of showing an empty grid with no explanation.

// Description backend/seed.js gives new products. It is a note for the
// admin, not copy for customers, so the storefront treats it as empty.
const SEED_PLACEHOLDER = 'Descripción pendiente: editala desde el panel.';
document.addEventListener('DOMContentLoaded', async () => {
  const gallery = document.getElementById('galeria');
  if (!gallery) return;

  const formatPrice = (price) =>
    price > 0
      ? new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0,
        }).format(price)
      : 'Precio a confirmar';

  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const body = await response.json();
    const products = body.products;

    if (!products || !products.length) {
      gallery.innerHTML = '<p class="galeria-aviso">Estamos cargando el catálogo. Volvé en un rato.</p>';
      return;
    }

    gallery.innerHTML = '';
    products.forEach((product) => {
      const card = document.createElement('div');
      card.className = 'producto';

      const photo = document.createElement('div');
      photo.className = 'producto-foto';

      const image = document.createElement('img');
      image.src = product.imageUrl || 'imagenes/Logo.png';
      image.alt = product.name;
      image.loading = 'lazy';
      photo.append(image);

      const description = (product.description || '').trim();
      if (description && description !== SEED_PLACEHOLDER) {
        const overlay = document.createElement('div');
        overlay.className = 'producto-descripcion';
        const overlayText = document.createElement('p');
        overlayText.textContent = description;
        overlay.append(overlayText);
        photo.append(overlay);

        // Hover shows it on desktop (CSS). Touch screens have no hover, so a
        // tap on the photo toggles it, and Tab reaches it from the keyboard.
        photo.tabIndex = 0;
        photo.setAttribute('aria-label', `${product.name}: ${description}`);
        photo.addEventListener('click', () => photo.classList.toggle('abierta'));
        card.addEventListener('mouseleave', () => photo.classList.remove('abierta'));
      }

      const info = document.createElement('div');
      info.className = 'producto-info';

      const text = document.createElement('div');
      const name = document.createElement('h3');
      name.textContent = product.name;
      const price = document.createElement('p');
      price.className = 'producto-precio';
      price.textContent = formatPrice(product.price);
      text.append(name, price);

      // No orders on the site: each product opens a chat that already
      // names it.
      const ask = document.createElement('a');
      ask.className = 'producto-consultar';
      ask.dataset.wa = `¡Hola! Quería consultar por: ${product.name}.`;
      ask.innerHTML = '<span class="contacto-icono"></span>Consultar';

      info.append(text, ask);
      card.append(photo, info);
      gallery.appendChild(card);
    });
    applyContactLinks(gallery);
  } catch (error) {
    console.error('No se pudo cargar el catálogo', error);
    gallery.innerHTML = '<p class="galeria-aviso">No pudimos cargar el catálogo en este momento.</p>';
  }
});
