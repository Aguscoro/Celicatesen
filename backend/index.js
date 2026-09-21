// Local entry point: a plain Node server. In production the same app is
// served by api/index.js as a serverless function instead.
const mongoose = require('mongoose');

const config = require('./config');
const app = require('./app');

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () =>
      console.log(`Server running on port ${config.port}`)
    );
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
