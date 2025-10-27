const express = require('express');
const productsController = require('../controllers/productsController');
const route = express.Router();

route.post('/create', productsController.createProduct);
route.get('/:id', productsController.getOne);
route.get('/', productsController.getAll);
route.put('/:id', productsController.updateProduct);
route.delete('/:id', productsController.deleteProduct);

module.exports = route;