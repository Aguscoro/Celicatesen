const Product = require('../models/Product');

exports.getItems = async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const data = req.body;
    const item = new Product(data);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};
