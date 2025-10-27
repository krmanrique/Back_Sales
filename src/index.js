// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const orderRouter = require('./routes/orderRouter');
const app = express();
const bodyParser = require('body-parser')

// Middleware
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

// Conectar a la base de datos
// console.log('validando rutas', usersRouter);

mongoose.connect('mongodb://localhost:27017/usuariosDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Usar las rutas de autenticación
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', orderRouter);

// app.use('*', (req, res) => console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`));

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
