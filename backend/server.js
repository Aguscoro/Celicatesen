const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/items', productRoutes);

app.get('/', (req, res) => res.send('API funcionando'));

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/projectdb';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
  } catch (err) {
    console.error('Error al iniciar servidor:', err);
    process.exit(1);
  }
}

start();
