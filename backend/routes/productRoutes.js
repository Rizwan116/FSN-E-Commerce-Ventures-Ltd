import express from 'express';
import { getProducts, getProductById } from '../contollers/productController.js';

const router = express.Router();

router.get('/', getProducts); // for getting all products
router.get('/:id', getProductById); // for getting a product by id


export default router;