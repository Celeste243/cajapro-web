const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido o expirado' });
    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.rol !== 'Administrador') {
    return res.status(403).json({ message: 'Acceso denegado: requiere rol de Administrador' });
  }
  next();
};