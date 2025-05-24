import express from 'express';
import * as productController from '../contollers/productController.js';

const router = express.Router();

router.get('/getProducts', productController.getProducts);
router.get('/getAllProducts', productController.getAllProducts);
router.get('/getProduct/:id', productController.getProductById);
router.post('/createProduct', productController.createProduct);
router.post('/updateProduct/:id', productController.updateProduct);
router.post('/deleteProduct/:id', productController.deleteProduct);
router.get('/reviews/:reviewId', productController.getReviewById);
router.get('/reviews_product/:productId', productController.getReviewByProductId);
router.get('/:id/reviews', productController.getProductReviews);
router.post('/reviews/createProductReview', productController.createProductReview);
router.post('/reviews/updateProductReview/:reviewId', productController.updateProductReview);
router.post('/reviews/deleteProductReview/:reviewId', productController.deleteProductReview);
router.get('/reviews_product_user/:productId/:userId', productController.getReviewByProductId);

export default router;
