import express from 'express';
import * as orderController from '../contollers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders);
// router.post('/', orderController.createOrder);
// router.put('/:id', orderController.updateOrder);
// router.delete('/:id', orderController.deleteOrder);

export default router;