const mongoose = require('mongoose');
const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'La cantidad debe ser un numero entero'
        }
    }
}, {
    timestamps: true
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;