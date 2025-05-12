import express from 'express';
import * as productController from '../contollers/productController.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

export default router;
