import express from "express";
const router = express.Router();

import {
    addOrderItems,
    getMyOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
} from "../controllers/orderController.js";

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.get('/mine', protect, getMyOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/paid', protect, updateOrderToPaid);
router.put('/:id/delivered', protect, admin, updateOrderToDelivered);

export default router;