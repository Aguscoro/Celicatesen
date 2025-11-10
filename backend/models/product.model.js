const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100, trim: true },
  brand: { type: String, required: true, minlength: 2, maxlength: 60 },
  description: { type: String, required: true, minlength: 10, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: false, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true, maxlength: 50, default: 'general' },
  sku: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
