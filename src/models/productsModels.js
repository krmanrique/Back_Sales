const mongoose = require('mongoose');

const productSchema = new mongoose.Schema( {
  name: {
    type: String,
    require: true,
    unique: true,
  },
  price: {
    type: Number,
    require: true,
    min: 0,   
  },
  stock: {
    type: Number,
    require: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema)

module.exports = Product;