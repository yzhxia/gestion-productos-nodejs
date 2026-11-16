const express = require('express');
const router = express.Router();
const {
    registrarUsuario,
    iniciarSesion
} = require('../controllers/authController');

// Registro de usuarios
router.post('/register', registrarUsuario);

// Inicio de sesion
router.post('/login', iniciarSesion);

module.exports = router;
