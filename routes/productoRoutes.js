const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validarProducto = require('../middleware/validarProducto');
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productoController');
router.get('/', authMiddleware, obtenerProductos);
router.get('/:id', authMiddleware, obtenerProducto);
router.post('/', authMiddleware, validarProducto, crearProducto);
router.put('/:id', authMiddleware, validarProducto, actualizarProducto);
router.delete('/:id', authMiddleware, eliminarProducto);
module.exports = router;