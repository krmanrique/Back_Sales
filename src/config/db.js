// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://krmanriquesanchez_db_user:12345@cluster0.rec25r6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB exitosa');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); // Terminar el proceso si no se puede conectar
  }
};

module.exports = connectDB;
