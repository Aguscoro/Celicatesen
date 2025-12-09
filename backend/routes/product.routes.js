const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// All product routes require authentication
router.get('/products', auth, productController.getProducts);
router.get('/products/:id', auth, productController.getProductById);

// Mutations require admin role
router.post('/products', auth, isAdmin, productController.createProduct);
router.put('/products/:id', auth, isAdmin, productController.updateProduct);
router.delete('/products/:id', auth, isAdmin, productController.deleteProduct);

module.exports = router;
