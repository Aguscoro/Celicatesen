// Environment is read in one place, and the process refuses to start with an
// incomplete configuration rather than falling back to insecure defaults.
require('dotenv').config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. See .env.example.`
    );
  }
  return value;
}

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
  // Empty means "any origin", which is only sensible while developing.
  corsOrigins: (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
