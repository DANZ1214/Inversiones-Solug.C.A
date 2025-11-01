'use strict'

// Importa el servicio para manejar la autenticación y tokensv
const srv = require('../services/service');

// Middleware para verificar si el usuario está autenticado
function isAuth(req, res, next){
    // Verifica si el encabezado de autorización está presente
    if(!req.headers.authorization) return res.status(403).send
    ({message: "No autorizado"});
    // Extrae el token del encabezado
    const token = req.headers.authorization.split(' ')[1];
    // Decodifica y valida el token
    srv.decodeToken(token)
    .then(result => {
        req.body.userId = result // Agrega el ID de usuario al cuerpo de la solicitud
        next(); // Continúa con la siguiente función en la cadena de middleware

    }).catch(error => {
        res.status(403).send({ message: error.message}); // Responde con error si el token no es válido
    })

}

// Función pendiente de implementación para identificar al usuario
function whoAmI(){
}

// Exporta las funciones para su uso en otras partes de la aplicación
module.exports = { isAuth, whoAmI };