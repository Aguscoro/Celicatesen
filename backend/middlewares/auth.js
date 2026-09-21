const jwt = require('jsonwebtoken');

const config = require('../config');

module.exports = function (req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ ok: false, message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res
      .status(401)
      .send({ ok: false, message: 'Invalid or expired token' });
  }
};
