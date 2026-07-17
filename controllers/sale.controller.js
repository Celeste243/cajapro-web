const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createSale = async (req, res, next) => {
  try {
    const { productos } = req.body; // Array de { id_producto, cantidad }
    let total = 0;

    // Verificar stock y calcular total
    for (let item of productos) {
      const prod = await Product.findById(item.id_producto);
      if (!prod) return res.status(404).json({ message: `Producto ${item.id_producto} no encontrado` });
      if (prod.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para: ${prod.nombre}` });
      }
      total += prod.precio * item.cantidad;

      // Descontar del inventario
      prod.stock -= item.cantidad;
      await prod.save();
    }

    const newSale = new Sale({
      productos,
      total_venta: total,
      id_usuario: req.user.id
    });

    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    next(error);
  }
};