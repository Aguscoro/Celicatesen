module.exports = function (req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'No autorizado' });
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Requiere permisos de administrador' });
  next();
};
