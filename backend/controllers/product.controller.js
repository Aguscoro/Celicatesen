const Product = require('../models/product.model');

async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).send({ ok: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, message: 'Error getting products' });
  }
}

async function getProductById(req, res) {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return res.status(404).send({ ok: false, message: 'Product not found' });
    res.status(200).send({ ok: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, message: 'Error getting product' });
  }
}

async function createProduct(req, res) {
  try {
    const data = req.body;
    const product = new Product(data);
    const saved = await product.save();
    res.status(201).send({ ok: true, product: saved });
  } catch (error) {
    console.error(error);
    // Validation errors from mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).send({ ok: false, message: 'Validation error', details: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).send({ ok: false, message: 'Duplicate key error', details: error.keyValue });
    }
    res.status(500).send({ ok: false, message: 'Error creating product' });
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updated = await Product.findByIdAndUpdate(id, newData, { new: true, runValidators: true });
    if (!updated) return res.status(404).send({ ok: false, message: 'Product not found' });
    res.status(200).send({ ok: true, product: updated });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).send({ ok: false, message: 'Validation error', details: error.errors });
    }
    res.status(500).send({ ok: false, message: 'Error updating product' });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ ok: false, message: 'Product not found' });
    res.status(200).send({ ok: true, message: 'Product deleted', product: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, message: 'Error deleting product' });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
