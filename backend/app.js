const express = require('express');
const app = express();

const productRoutes = require('./routes/product.routes');

app.use(express.json());

app.use('/api', productRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.send({ ok: true, message: 'Celicatesen Backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send({ ok: false, message: 'Route not found' });
});

module.exports = app;
