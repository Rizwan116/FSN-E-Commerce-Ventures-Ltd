import express from 'express';
import * as orderController from '../contollers/orderController.js';

const router = express.Router();

router.get('/getOrders', orderController.getOrders);
// router.post('/', orderController.createOrder);
// router.put('/:id', orderController.updateOrder);
// router.delete('/:id', orderController.deleteOrder);
router.get('/:id', orderController.getOrderById);
router.get('/userID/:id/orders', orderController.getOrdersByUserId);
router.post('/createOrder', orderController.createOrder);
router.post('/updateOrder/:id', orderController.updateOrder);
router.post('/cancleOrder/:id', orderController.cancelOrder);
router.get('/productID/:id/orders', orderController.getOrdersByProductId);


export default router;