import express from 'express';
import * as productController from '../contollers/productController.js';

const router = express.Router();

router.get('/', productController.getProducts); // for getting all products
router.get('/:id', productController.getProductById); // for getting a product by id


export default router;