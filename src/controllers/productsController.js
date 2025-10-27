const Product = require('../models/productsModels');

class productsController {
  constructor() {

  }

  async createProduct(req, res) {
    try {
      const { name, price, stock, imageUrl, available } = req.body;

      const productExist = await Product.findOne({ name });
      if (productExist) return res.status(400).json({ error: 'El producto ya existe' });
      console.log('creando producto:', name);
      
      const newProduct = new Product({ name, price, stock, imageUrl, available });
      await newProduct.save();
      res.status(201).json({ message: 'Producto creado con exito' });
    } catch (e) {
      console.log('e', e)
        res.status(500).json({ e: 'Error al crear producto' });
    }
  };

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true
      });

      if (!updateProduct) {
        return res.status(404).json({ error: 'producto no encontrado' });
      }

      res.status(200).json({
        status: 'Producto actualizado',
        data: updateProduct
      });
    } catch (e) {
      console.error('Error al actualizar:', e);
      res.status(500).send(e.message);
    }
  };

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleteProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true
      });

      if(!deleteProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.status(200).json({
        status: 'Producto eliminado',
        data: deleteProduct
      });
    } catch (e) {
        console.error('Error al eliminar:', e);
        res.status(500).send(e).message;
    }
  };

  async getAll(req, res) {
    try {
      const data = await Product.find({});
      res.status(201).json(data);
    } catch (e) {
        console.error('Error completo', e);
        res.status(500).send(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await Product.findById(id);
      res.status(201).json({data});
    } catch (e) {
        console.error('Error completo', e);
        res.status(500).send(e);
    }
  }
};

module.exports = new productsController();