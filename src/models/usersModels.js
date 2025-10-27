// const sequelize = require('../config/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

// const User = sequelize.define('User', {
const userSchema = new mongoose.Schema( {
  username:{
    type: String,
    require: true,
    unique: true,
  },
  gmail: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model('User', userSchema)

module.exports = User;