const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = { id: user._id, email: user.email, isAdmin: user.isAdmin };
  return jwt.sign(payload, process.env.SECRET || 'change_this_secret', { expiresIn: '8h' });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send({ ok: false, message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send({ ok: false, message: 'Email already registered' });

    const user = new User({ name, email, password });
    const saved = await user.save();
    const token = generateToken(saved);
    res.status(201).send({ ok: true, user: { id: saved._id, name: saved.name, email: saved.email, isAdmin: saved.isAdmin }, token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, message: 'Error registering user' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ ok: false, message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ ok: false, message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).send({ ok: false, message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).send({ ok: true, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, message: 'Error logging in' });
  }
}

module.exports = { register, login };
