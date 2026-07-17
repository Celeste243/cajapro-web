const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  codigoBarra: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
