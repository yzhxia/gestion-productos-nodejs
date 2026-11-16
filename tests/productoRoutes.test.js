// Pruebas que generé con chat gpt
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

const productoController = require('../controllers/productoController');

jest.mock('../controllers/productoController', () => ({
    obtenerProductos: jest.fn((req, res) => {
        res.status(200).json([]);
    }),
    obtenerProducto: jest.fn((req, res) => {
        res.status(200).json({ nombre: 'Producto de prueba' });
    }),
    crearProducto: jest.fn((req, res) => {
        res.status(201).json({
            message: 'Producto creado correctamente'
        });
    }),
    actualizarProducto: jest.fn((req, res) => {
        res.status(200).json({
            message: 'Producto actualizado correctamente'
        });
    }),
    eliminarProducto: jest.fn((req, res) => {
        res.status(200).json({
            message: 'Producto eliminado correctamente'
        });
    })
}));

describe('Pruebas de rutas de productos', () => {

    let token;

    beforeAll(() => {
        process.env.JWT_SECRET = 'secreto-de-prueba';
    });

    beforeEach(() => {
        jest.clearAllMocks();
        token = jwt.sign(
            { id: '123' },
            process.env.JWT_SECRET
        );
    });

    test('GET /api/productos debe permitir acceso con token', async () => {
        const respuesta = await request(app)
            .get('/api/productos')
            .set('Authorization', `Bearer ${token}`);

        expect(respuesta.status).toBe(200);
        expect(productoController.obtenerProductos).toHaveBeenCalled();
    });

    test('GET /api/productos debe rechazar solicitudes sin token', async () => {
        const respuesta = await request(app)
            .get('/api/productos');

        expect(respuesta.status).toBe(401);
        expect(productoController.obtenerProductos).not.toHaveBeenCalled();
    });

    test('GET /api/productos debe rechazar un token invalido', async () => {
        const respuesta = await request(app)
            .get('/api/productos')
            .set('Authorization', 'Bearer token-invalido');

        expect(respuesta.status).toBe(401);
    });

    test('POST /api/productos debe crear un producto con datos validos', async () => {
        const respuesta = await request(app)
            .post('/api/productos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Teclado',
                descripcion: 'Teclado mecanico',
                precio: 500,
                cantidad: 10
            });

        expect(respuesta.status).toBe(201);
        expect(productoController.crearProducto).toHaveBeenCalled();
    });

    test('POST /api/productos debe rechazar datos invalidos', async () => {
        const respuesta = await request(app)
            .post('/api/productos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: '',
                precio: -10,
                cantidad: 2
            });

        expect(respuesta.status).toBe(400);
        expect(productoController.crearProducto).not.toHaveBeenCalled();
    });

    test('PUT /api/productos/:id debe actualizar un producto', async () => {
        const respuesta = await request(app)
            .put('/api/productos/123')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Mouse',
                precio: 200,
                cantidad: 5
            });

        expect(respuesta.status).toBe(200);
        expect(productoController.actualizarProducto).toHaveBeenCalled();
    });

    test('PUT /api/productos/:id debe rechazar datos invalidos', async () => {
        const respuesta = await request(app)
            .put('/api/productos/123')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Mouse',
                precio: -5,
                cantidad: 2
            });

        expect(respuesta.status).toBe(400);
        expect(productoController.actualizarProducto).not.toHaveBeenCalled();
    });

    test('DELETE /api/productos/:id debe eliminar un producto', async () => {
        const respuesta = await request(app)
            .delete('/api/productos/123')
            .set('Authorization', `Bearer ${token}`);

        expect(respuesta.status).toBe(200);
        expect(productoController.eliminarProducto).toHaveBeenCalled();
    });

});