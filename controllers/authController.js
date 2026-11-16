const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registramos el usuario
const registrarUsuario = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: 'El usuario y la contraseña son obligatorios'
            });
        }
        const usuarioExistente = await Usuario.findOne({ username });
        if (usuarioExistente) {
            return res.status(409).json({
                message: 'El nombre de usuario ya existe'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({
            username,
            password: hashedPassword
        });
        await nuevoUsuario.save();
        res.status(201).json({
            message: 'Usuario registrado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// Inician sesion
const iniciarSesion = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: 'El usuario y la contraseña son obligatorios'
            });
        }
        const usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(401).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );
        if (!passwordCorrecta) {
            return res.status(401).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );
        res.json({
            message: 'Inicio de sesion correcto',
            token
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};