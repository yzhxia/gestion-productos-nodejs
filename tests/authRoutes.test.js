// Pruebas que generé con chat gpt
const request = require('supertest');
const app = require('../server');

const authController = require('../controllers/authController');

jest.mock('../controllers/authController', () => ({
    registrarUsuario: jest.fn((req, res) => {
        res.status(201).json({
            message: 'Usuario registrado correctamente'
        });
    }),
    iniciarSesion: jest.fn((req, res) => {
        res.status(200).json({
            message: 'Inicio de sesion correcto',
            token: 'token-de-prueba'
        });
    })
}));

describe('Pruebas de rutas de autenticacion', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/auth/register debe registrar un usuario', async () => {
        const respuesta = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'pia',
                password: '123456'
            });

        expect(respuesta.status).toBe(201);
        expect(respuesta.body.message).toBe(
            'Usuario registrado correctamente'
        );
        expect(authController.registrarUsuario).toHaveBeenCalled();
    });

    test('POST /api/auth/login debe iniciar sesion', async () => {
        const respuesta = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'pia',
                password: '123456'
            });

        expect(respuesta.status).toBe(200);
        expect(respuesta.body.token).toBe('token-de-prueba');
        expect(authController.iniciarSesion).toHaveBeenCalled();
    });

});