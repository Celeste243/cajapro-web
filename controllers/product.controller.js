const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ activo: true });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // Baja lógica: no borramos el producto, lo desactivamos para no romper el historial de ventas
    await Product.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ message: 'Producto deshabilitado correctamente (Baja lógica)' });
  } catch (error) {
    next(error);
  }
};