const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, saleController.createSale);
router.get('/resumen', verifyToken, saleController.getResumen);
module.exports = router;
