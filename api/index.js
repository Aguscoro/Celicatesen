// Production entry point: the same Express app, served by Vercel as a
// serverless function. Every invocation may land on a cold container, so the
// Mongoose connection is cached on the global object and reused.
const mongoose = require('mongoose');

const config = require('../backend/config');
const app = require('../backend/app');

function connect() {
  if (!global.__celicatesenMongo) {
    global.__celicatesenMongo = mongoose
      .connect(config.mongoUri, { bufferCommands: false })
      .catch((err) => {
        // Don't cache a failed attempt: the next request should retry.
        global.__celicatesenMongo = undefined;
        throw err;
      });
  }
  return global.__celicatesenMongo;
}

module.exports = async (req, res) => {
  try {
    await connect();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    return res
      .status(503)
      .send({ ok: false, message: 'Database unavailable' });
  }
  return app(req, res);
};
