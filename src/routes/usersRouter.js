const express = require('express');
const usersController = require('../controllers/userController');
const route = express.Router();

route.post('/register', usersController.registerUser);
route.post('/login', usersController.loginUser);
route.get('/:id', usersController.getOne);
route.get('/', usersController.getAll);
route.put('/:id', usersController.update);
route.delete('/:id', usersController.delete);

module.exports = route;