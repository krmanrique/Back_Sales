const Order = require('../models/orderModel');
const Product = require('../models/productsModels');
const jwt = require ('jsonwebtoken');
// const User = require('../models/usersModels');

class orderController {
  constructor() {

  }

  async createOrder(req, res) {
    try {
      const { items } = req.body;
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      const decoded = jwt.verify(token, 'secretkey');
      const userId = decoded.id; 
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'El pepdido debe tener productos' });
      }

      // //Verificar si usuario existe

      // const user = await User.findById(userId);
      // if (!user) {
      //   return res.status(400).json({ error: 'El usuario no existe' });
      // }      
    
      const productId = items.map(item => item.productId);       // validar existrencia y stock de productos
      const products = await Product.find({ _id: { $in: productId } });
      const productMap = new Map(products.map(p => [String(p._id), p]));

      let totalPrice = 0;
      const orderItems = [];

      for (const item of items) {
        const product = productMap.get(String(item.productId));

        if (!product) {
          return res.status(400).json({ error: `El producto con ID ${item.productId} no existe`});
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `No hay suficiente stock ${product.name}` });
        }

        totalPrice += product.price * item.quantity;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          unitPrice: product.price
        });

        // Reducir stock
        product.stock -= item.quantity;
        await product.save();
      }

      //Crear pedido
      const newOrder = new Order({
        user: userId,
        status: 'Created',
        items: orderItems,
        totalPrice
      });

      await newOrder.save();
      res.status(201).json({ 
        message: 'Pedido creado con éxito',
        orderId: newOrder._id,
        totalPrice
      });
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({ error: 'Error al crear pedido' });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find().populate('items.product');
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ['Created', 'Confirmed', 'Cancelled'];

      console.log(status);
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado de pedido no valido' });
      }
      const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      res.status(200).json({
        message: 'Estado del pedido actualizado',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error al actualizar estado de pedido:', error);
      res.status(500).json({ error: 'Error al actualizar estado del pedido' });
    }
  }

  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const updateOrder = await Order.findByIdAndDelete(id);
      if (!updateOrder) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      res.status(200).json({
        message: 'Pedido actualizado con exito',
        data: updateOrder
      });
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const deleteOrder = await Order.findByIdAndDelete(id);

      if (!deleteOrder) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      res.status(200).json({
        message: 'Pedido eliminado con exito',
        data: deleteOrder
      });
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
      res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
  }
};

module.exports = new orderController();