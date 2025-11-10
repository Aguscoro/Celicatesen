require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/celicatesen';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('\x1b[35mConnected to MongoDB\x1b[37m');
    app.listen(PORT, () => console.log(`\x1b[36mServer running on port ${PORT}\x1b[37m`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
