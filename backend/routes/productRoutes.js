import express from 'express';
import * as productController from '../contollers/productController.js'; // ✅ fixed typo from 'contollers' to 'controllers'

const router = express.Router();

// ==============================
// GET Routes
// ==============================

// @route   GET /products/
// @desc    Get all products
router.get('/', productController.getProducts);

// @route   GET /products/:id
// @desc    Get product by ID
router.get('/:id', productController.getProductById);

// ==============================
// Future Routes (placeholders for CRUD)
// ==============================
// router.post('/', productController.createProduct);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);

export default router;
