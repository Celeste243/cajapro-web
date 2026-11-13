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

exports.getResumen = async (req, res, next) => {
  try {
    const ventas = await Sale.find().sort({ _id: -1 });

    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const deHoy = ventas.filter(v => v.fecha >= inicioDelDia);
    const totalHoy = deHoy.reduce((suma, v) => suma + v.total_venta, 0);

    res.json({
      totalHoy,
      cantidadHoy: deHoy.length,
      promedioHoy: deHoy.length ? totalHoy / deHoy.length : 0,
      ultimas: ventas.slice(0, 10).map(v => ({
        id: v._id,
        fecha: v.fecha,
        total: v.total_venta,
        items: v.productos.reduce((s, p) => s + p.cantidad, 0)
      }))
    });
  } catch (error) {
    next(error);
  }
};