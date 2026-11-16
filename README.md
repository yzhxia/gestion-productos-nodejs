# Gestión de Productos - Node.js
Es una aplicación para gestionar productos con operaciones de crear, consultar, actualizar y eliminar.

El proyecto usa Node.js, Express y MongoDB para el manejo de datos, además de autenticación con JWT.

## Cosas que tiene:
- Registro e inicio de sesión de usuarios.
- Autenticación con JWT.
- Creación de productos.
- Consulta de productos registrados.
- Actualización de productos.
- Eliminación de productos.
- Validación de datos.
- Manejo de errores.

## Tecnologías que usé en el trabajo:
- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript
- JSON Web Tokens (JWT)
- Jest
- Supertest
- HTML y CSS

## Instalación

1. Clonar el repositorio:
   `bash
   git clone https://github.com/yzhxia/gestion-productos-nodejs.git
   `

2. Entrar a la carpeta:
   `bash
   cd gestion-productos-nodejs
   `

3. Instalar las dependencias:
   `bash
   npm install
   `

4. Hacer un archivo `.env` con las variables de entorno necesarias:
   `env
   MONGODB_URI=tu_conexion_mongodb
   JWT_SECRET=tu_clave_secreta
   JWT_EXPIRES_IN=1d
   PORT=3000
   `

5. Iniciar el servidor:
   `bash
   npm start
   `

## Pruebas

Para ejecutar las pruebas automatizadas:
`bash
npm test
`

Para consultar el reporte de cobertura:
`bash
npm test -- --coverage
`
