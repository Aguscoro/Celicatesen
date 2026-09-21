// Creates the single admin account and the starting catalogue.
// Safe to re-run: products are only inserted if their SKU is missing, so
// anything edited from the admin panel is left alone.
const mongoose = require('mongoose');

const config = require('./config');
const Product = require('./models/product.model');
const User = require('./models/user.model');

// Price 0 means "not set yet": the storefront shows it as "a confirmar"
// instead of a made-up number, and the real values go in from the panel.
const PLACEHOLDER = 'Descripción pendiente: editala desde el panel.';

const products = [
  {
    sku: 'CELI-001',
    name: 'Torta bombón',
    brand: 'Celicatesen',
    description: PLACEHOLDER,
    price: 0,
    stock: 0,
    category: 'tortas',
    imageUrl: 'imagenes/Torta bombon.jpg',
  },
  {
    sku: 'CELI-002',
    name: 'Brownies',
    brand: 'Celicatesen',
    description: PLACEHOLDER,
    price: 0,
    stock: 0,
    category: 'porciones',
    imageUrl: 'imagenes/Brownies.jpg',
  },
  {
    sku: 'CELI-003',
    name: 'Box dulce',
    brand: 'Celicatesen',
    description: PLACEHOLDER,
    price: 0,
    stock: 0,
    category: 'boxes',
    imageUrl: 'imagenes/Box merienda.jpg',
  },
];

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding. See .env.example.'
    );
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    // Re-seeding is how the admin password gets reset. Assigning and saving
    // runs the hashing hook; a direct update would store it in the clear.
    existing.password = ADMIN_PASSWORD;
    existing.isAdmin = true;
    await existing.save();
    console.log(`Admin ${existing.email}: password reset`);
    return;
  }

  const admin = new User({
    name: ADMIN_NAME || 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    isAdmin: true,
  });
  await admin.save();
  console.log(`Admin ${admin.email}: created`);
}

async function seedProducts() {
  for (const product of products) {
    const result = await Product.updateOne(
      { sku: product.sku },
      { $setOnInsert: product },
      { upsert: true }
    );
    const action = result.upsertedCount ? 'created' : 'already there, left as is';
    console.log(`Product ${product.sku} (${product.name}): ${action}`);
  }
}

async function main() {
  await mongoose.connect(config.mongoUri);
  try {
    await seedAdmin();
    await seedProducts();
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
