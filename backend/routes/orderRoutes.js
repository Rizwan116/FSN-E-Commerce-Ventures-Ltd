import express from 'express';
import * as orderController from '../contollers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders);
// router.post('/', orderController.createOrder);
// router.put('/:id', orderController.updateOrder);
// router.delete('/:id', orderController.deleteOrder);
router.get('/:id', orderController.getOrderById);
router.get('/:id/orders', orderController.getOrdersByUserId);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/:id/orders', orderController.getOrdersByProductId);


export default router;