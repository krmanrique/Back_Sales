const User = require ("../models/usersModels");
const jwt = require ('jsonwebtoken');

class usersController {
  constructor() {

  } 

  async registerUser(req, res) {
    try {
      // console.log('Error aqui');
      // console.log(req)
      const { username, gmail, password } = req.body;

      const userExist = await User.findOne({ gmail });
      if (userExist) return res.status(400).json({ error: 'El usuario ya existe' });
      console.log('Contraseña antes de guardar:', password);

      const newUSer = new User({ username, gmail, password });
      await newUSer.save();

      res.status(201).json({ message: 'Usuario registrado con exito' });
    } catch (e) {
      console.log('e', e)
        res.status(500).json({ e: 'Error al registrar el usuario' });
    }
  };
  
  async loginUser(req, res) {
    try {
      const { gmail, password } = req.body;
      if(!gmail || ! password) {
        return res.status(400).json({ error: 'Ingrese el gmail y contraseña correctos' });
      }

      const user = await User.findOne({ gmail });

      if (!user) {
        console.log('Usuario no encontrado:', gmail);
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      if (user.password !== password) {
        return res.status(400).json({ error: 'Contraseña incorrecta'});
      }

      // console.log('Contraseña ingresada:', password); // La contraseña usuario
      // console.log('Contraseña almacenada (en base de datos):', user.password); // La contraseña base de datos

      
      const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
      res.json({ token, isAdmin: user.isAdmin ?? false }); //Envia token al front
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en el login' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.status(200).json({
        status: 'Usuario actualizado',
        data: updatedUser
      });
    } catch (e) {
      console.error('Error al actualizar:', e);
      res.status(500).send(e.message);
    }
  } 
  
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleteUser = await User.findByIdAndDelete(id, req.body, {
        new:true
      });

      if (!deleteUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.status(200).json({
        status: 'Usuario eliminado',
        data: deleteUser
      });
    } catch (e) {
        console.error('Error al eliminar:', e);
        res.status(500).send(e).message;
    }
  }

  async getAll(req, res) {
    try {
      const data = await User.find({});
      res.status(201).json(data);
    } catch (e) {
        console.error('Error completo', e);
        res.status(500).send(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await User.findById(id);
      res.status(201).json({data});
    } catch (e) {
        console.error('Error completo', e);
        res.status(500).send(e);
    }
  }
}

module.exports = new usersController();