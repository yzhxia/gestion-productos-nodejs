// Pruebas que generé con chat gpt
jest.mock('../models/Producto', () => jest.fn());

const Producto = require('../models/Producto');

const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productoController');

const crearResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Pruebas para obtener productos', () => {

    test('Debe obtener todos los productos', async () => {
        const productos = [{ nombre: 'Peluche', precio: 140 }];
        Producto.find = jest.fn().mockResolvedValue(productos);

        const req = {};
        const res = crearResponse();
        const next = jest.fn();

        await obtenerProductos(req, res, next);

        expect(res.json).toHaveBeenCalledWith(productos);
    });

    test('Debe manejar errores al obtener productos', async () => {
        const error = new Error('Error de consulta');
        Producto.find = jest.fn().mockRejectedValue(error);

        const req = {};
        const res = crearResponse();
        const next = jest.fn();

        await obtenerProductos(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('Pruebas para obtener un producto', () => {

    test('Debe obtener un producto por su ID', async () => {
        const producto = { nombre: 'Peluche', precio: 140 };
        Producto.findById = jest.fn().mockResolvedValue(producto);

        const req = { params: { id: '123' } };
        const res = crearResponse();
        const next = jest.fn();

        await obtenerProducto(req, res, next);

        expect(res.json).toHaveBeenCalledWith(producto);
    });

    test('Debe responder si el producto no existe', async () => {
        Producto.findById = jest.fn().mockResolvedValue(null);

        const req = { params: { id: '123' } };
        const res = crearResponse();
        const next = jest.fn();

        await obtenerProducto(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('Debe manejar errores al consultar por ID', async () => {
        const error = new Error('Error de consulta');
        Producto.findById = jest.fn().mockRejectedValue(error);

        const req = { params: { id: '123' } };
        const res = crearResponse();
        const next = jest.fn();

        await obtenerProducto(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('Pruebas para crear productos', () => {

    test('Debe crear un producto correctamente', async () => {
        const producto = {
            nombre: 'Peluche',
            descripcion: 'Peluche pequeño',
            precio: 140,
            cantidad: 10
        };

        const save = jest.fn().mockResolvedValue({});
        Producto.mockImplementation(function (datos) {
            Object.assign(this, datos);
            this.save = save;
        });
        
        const req = { body: producto };
        const res = crearResponse();
        const next = jest.fn();

        await crearProducto(req, res, next);

        expect(save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('Debe manejar errores al crear productos', async () => {
        const error = new Error('Error al guardar');

        const save = jest.fn().mockRejectedValue(error);
        Producto.mockImplementation(() => ({ save }));

        const req = {
            body: {
                nombre: 'Peluche',
                precio: 140,
                cantidad: 10
            }
        };

        const res = crearResponse();
        const next = jest.fn();

        await crearProducto(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('Pruebas para actualizar productos', () => {

    test('Debe actualizar un producto correctamente', async () => {
        const producto = { nombre: 'Peluche grande', precio: 180 };

        Producto.findByIdAndUpdate = jest.fn()
            .mockResolvedValue(producto);

        const req = {
            params: { id: '123' },
            body: producto
        };

        const res = crearResponse();
        const next = jest.fn();

        await actualizarProducto(req, res, next);

        expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith(
            '123',
            producto,
            { new: true, runValidators: true }
        );

        expect(res.json).toHaveBeenCalled();
    });

    test('Debe responder si el producto no existe', async () => {
        Producto.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

        const req = {
            params: { id: '123' },
            body: {}
        };

        const res = crearResponse();
        const next = jest.fn();

        await actualizarProducto(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('Debe manejar errores al actualizar', async () => {
        const error = new Error('Error al actualizar');
        Producto.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

        const req = {
            params: { id: '123' },
            body: {}
        };

        const res = crearResponse();
        const next = jest.fn();

        await actualizarProducto(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('Pruebas para eliminar productos', () => {

    test('Debe eliminar un producto correctamente', async () => {
        const producto = { nombre: 'Peluche' };

        Producto.findByIdAndDelete = jest.fn()
            .mockResolvedValue(producto);

        const req = { params: { id: '123' } };
        const res = crearResponse();
        const next = jest.fn();

        await eliminarProducto(req, res, next);

        expect(Producto.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto eliminado correctamente'
        });
    });

    test('Debe responder si el producto no existe', async () => {
        Producto.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        const req = { params: { id: '123' } };
        const res = crearResponse();
        const next = jest.fn();

        await eliminarProducto(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('Debe manejar errores al eliminar', async () => {
        const error = new Error('Error al eliminar');

        Producto.findByIdAndDelete = jest.fn().mockRejectedValue(error);

        const req = { params: { id: '123' } };
        const res = crearResponse();
        const next = jest.fn();

        await eliminarProducto(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});