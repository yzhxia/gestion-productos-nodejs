const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    // Obtenemos el token del encabezado de autorizacion
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No se proporciono un token de autenticacion'
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verificamos que el token sea valido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalido o expirado'
        });
    }
};
module.exports = authMiddleware;