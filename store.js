// Fills the storefront gallery from the API. If the call fails the section
// says so instead of showing an empty grid with no explanation.
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

      const image = document.createElement('img');
      image.src = product.imageUrl || 'imagenes/Logo.png';
      image.alt = product.name;
      image.loading = 'lazy';

      const name = document.createElement('h3');
      name.textContent = product.name;

      const price = document.createElement('p');
      price.className = 'producto-precio';
      price.textContent = formatPrice(product.price);

      card.append(image, name, price);
      gallery.appendChild(card);
    });
  } catch (error) {
    console.error('No se pudo cargar el catálogo', error);
    gallery.innerHTML = '<p class="galeria-aviso">No pudimos cargar el catálogo en este momento.</p>';
  }
});
