const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public: list items
router.get('/', productController.getItems);

// Protected: get single (requires auth)
router.get('/:id', auth, productController.getItemById);

// Protected: create item (requires auth)
router.post('/', auth, productController.createItem);

// Protected: update item (requires auth)
router.put('/:id', auth, productController.updateItem);

// Protected: delete item (requires auth + admin)
router.delete('/:id', auth, isAdmin, productController.deleteItem);

module.exports = router;
