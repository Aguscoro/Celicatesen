const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Reading is public: the storefront shows the catalogue to anonymous visitors.
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Writing is for the admin account only.
router.post('/products', auth, isAdmin, productController.createProduct);
router.put('/products/:id', auth, isAdmin, productController.updateProduct);
router.delete('/products/:id', auth, isAdmin, productController.deleteProduct);

module.exports = router;
