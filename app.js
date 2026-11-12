const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const saleRoutes = require('./routes/sale.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();
app.use(express.json());

// Sirve el front (HTML/CSS/JS de la carpeta public)
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a Base de Datos
connectDB();

// Rutas API REST
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// Manejo de errores global
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));