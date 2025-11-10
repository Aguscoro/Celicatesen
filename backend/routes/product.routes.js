const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middlewares/auth');

// Public routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Protected routes (create/update/delete require a valid token)
router.post('/products', auth, productController.createProduct);
router.put('/products/:id', auth, productController.updateProduct);
router.delete('/products/:id', auth, productController.deleteProduct);

module.exports = router;
