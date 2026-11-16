// Pruebas que generé con chat gpt
jest.mock('../models/Usuario', () => jest.fn());

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    registrarUsuario,
    iniciarSesion
} = require('../controllers/authController');

const crearResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

beforeEach(() => {
    jest.resetAllMocks();
    Usuario.findOne = undefined;

    process.env.JWT_SECRET = 'secreto-de-prueba';
    delete process.env.JWT_EXPIRES_IN;
});

describe('Pruebas del registro de usuarios', () => {

    test('Debe registrar un usuario correctamente', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('password-cifrada');

        const save = jest.fn().mockResolvedValue({});
        Usuario.mockImplementation(() => ({ save }));

        const req = {
            body: {
                username: 'pia',
                password: '123456'
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await registrarUsuario(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario registrado correctamente'
        });
        expect(save).toHaveBeenCalled();
    });

    test('No debe registrar si faltan datos', async () => {
        const req = { body: {} };
        const res = crearResponse();
        const next = jest.fn();

        await registrarUsuario(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(Usuario.findOne).toBeUndefined();
    });

    test('No debe registrar un usuario existente', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue({
            username: 'pia'
        });

        const req = {
            body: {
                username: 'pia',
                password: '123456'
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await registrarUsuario(req, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
    });

    test('Debe enviar los errores al middleware', async () => {
        const error = new Error('Error de base de datos');

        Usuario.findOne = jest.fn().mockRejectedValue(error);

        const req = {
            body: {
                username: 'pia',
                password: '123456'
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await registrarUsuario(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('Pruebas del inicio de sesión', () => {

    test('Debe iniciar sesión y generar un token', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue({
            _id: '123',
            password: 'password-cifrada'
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token-de-prueba');

        const req = {
            body: {
                username: 'pia',
                password: '123456'
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(jwt.sign).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'Inicio de sesion correcto',
            token: 'token-de-prueba'
        });
    });

    test('No debe iniciar sesión si faltan datos', async () => {
        const req = { body: {} };
        const res = crearResponse();
        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('No debe iniciar sesión con un usuario inexistente', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue(null);

        const req = {
            body: {
                username: 'desconocido',
                password: '123456'
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test('No debe iniciar sesión con una contraseña incorrecta', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue({
            username: 'pia',
            password: 'password-cifrada'
        });

        bcrypt.compare.mockResolvedValue(false);

        const req = {
            body: {
                username: 'pia',
                password: 'incorrecta'
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test('Debe enviar los errores al middleware', async () => {
        const error = new Error('Error de base de datos');

        Usuario.findOne = jest.fn().mockRejectedValue(error);

        const req = {
            body: {
                username: 'pia',
                password: '123456'
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});