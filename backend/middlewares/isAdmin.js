module.exports = function (req, res, next) {
  if (!req.user) return res.status(401).send({ ok: false, message: 'Not authenticated' });
  if (!req.user.isAdmin) return res.status(403).send({ ok: false, message: 'Requires admin role' });
  next();
};
