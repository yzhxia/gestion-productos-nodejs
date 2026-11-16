const errorMiddleware = (error, req, res, next) => {
    console.error('Error:', error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message || 'Error interno del servidor'
    });
};
module.exports = errorMiddleware;