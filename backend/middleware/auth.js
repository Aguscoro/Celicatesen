const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token, autorización denegada' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = { id: decoded.userId, isAdmin: decoded.isAdmin };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
