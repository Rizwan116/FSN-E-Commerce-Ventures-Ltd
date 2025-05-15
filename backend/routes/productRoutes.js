import express from 'express';
import * as productController from '../contollers/productController.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id/reviews/:reviewId', productController.getReviewById);
router.get('/:id/reviews', productController.getProductReviews);
router.post('/:id/reviews', productController.createProductReview);
router.put('/:id/reviews/:reviewId', productController.updateProductReview);
router.delete('/:id/reviews/:reviewId', productController.deleteProductReview);

export default router;
