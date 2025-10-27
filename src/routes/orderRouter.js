const express = require('express');
const orderController = require('../controllers/ordersController');
const route = express.Router();

route.post('/create', orderController.createOrder);
route.get('/', orderController.getAllOrders);
route.put('/status:id', orderController.updateOrderStatus);
route.put('/:id', orderController.updateOrder);
route.delete('/:id', orderController.deleteOrder);

module.exports = route;