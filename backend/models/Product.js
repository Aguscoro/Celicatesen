const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String },
  precio: { type: Number, required: true },
  categoria: { type: String },
  estado: { type: String, default: 'activo' },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
