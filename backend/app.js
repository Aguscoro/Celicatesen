const express = require('express');
const cors = require('cors');

const config = require('./config');
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// The storefront is served from a different origin than the API, so the
// browser needs this to make any call at all.
app.use(
  cors({
    origin: config.corsOrigins.length ? config.corsOrigins : true,
  })
);

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', productRoutes);

app.get('/api/health', (req, res) => {
  res.send({ ok: true, message: 'Celicatesen API is running' });
});

app.use((req, res) => {
  res.status(404).send({ ok: false, message: 'Route not found' });
});

module.exports = app;
