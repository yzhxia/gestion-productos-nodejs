const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;
    if (
        typeof nombre !== 'string' ||
        nombre.trim() === '' ||
        typeof precio !== 'number' ||
        !Number.isFinite(precio) ||
        precio < 0 ||
        !Number.isInteger(cantidad) ||
        cantidad < 0
    ) {
        return res.status(400).json({
            message: 'Los datos del producto son invalidos'
        });
    }
    next();
};
module.exports = validarProducto;