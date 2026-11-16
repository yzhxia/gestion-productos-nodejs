const Producto = require('../models/Producto');

// Obtenemos todos los productos
const obtenerProductos = async (req, res, next) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        next(error);
    }
};

// Obtenemos un producto por ID
const obtenerProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }
        res.json(producto);
    } catch (error) {
        next(error);
    }
};

// Creamos un producto
const crearProducto = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, cantidad } = req.body;
        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            cantidad
        });
        await nuevoProducto.save();
        res.status(201).json({
            message: 'Producto creado correctamente',
            producto: nuevoProducto
        });
    } catch (error) {
        next(error);
    }
};

// Actualizamos un producto
const actualizarProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }
        res.json({
            message: 'Producto actualizado correctamente',
            producto
        });
    } catch (error) {
        next(error);
    }
};

// Eliminamos un producto
const eliminarProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }
        res.json({
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};