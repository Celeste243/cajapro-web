const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  productos: [{
    id_producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    cantidad: { type: Number, required: true, min: 1 }
  }],
  total_venta: { type: Number, required: true, min: 0 },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Sale', saleSchema);
