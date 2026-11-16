require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarDB = require('./config/database');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Las rutas principal
app.get('/', (req, res) => {
    res.send('API de gestion de productos funcionando correctamente');
});

// Nuestras rutas de autenticacion
app.use('/api/auth', authRoutes);

// Nuestras rutas de productos
app.use('/api/productos', productoRoutes);

// El middleware para manejar errores
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await conectarDB();
        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor.');
        process.exit(1);
    }
};

if (require.main === module) {
    iniciarServidor();
}

module.exports = app;