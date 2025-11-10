const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ ok: false, message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'change_this_secret');
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    return res.status(401).send({ ok: false, message: 'Invalid or expired token' });
  }
};
