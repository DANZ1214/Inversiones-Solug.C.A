'user strict'

// Importa las dependencias necesarias
const jwt = require('jwt-simple')
const { functionsIn, create } = require('lodash');
const moment = require('moment');

// Función para crear un token JWT a partir de un usuario
function createToken(user){
    // Crea el payload del token con la información del usuario
    const payload = {
        sub : user, // El usuario (sub) es el sujeto del token
        iat: moment().unix, // El momento en que el token fue emitido (issued at)
        exp: moment().add(15, 'days').unix() // Fecha de expiración del token (15 días después)

    }
    // Devuelve el token firmado con la clave secreta
    return jwt.encode(payload, process.env.SECRET_TOKEN);

}

// Función para decodificar un token y verificar su validez
function decodeToken(token){
    const decoded = new Promise(function(resolve, reject){
        try{
            // Decodifica el token usando la clave secreta
            const payload = jwt.decode(token, process.env.SECRET_TOKEN);
            if(payload.exp <= moment().unix()) { reject({
                status: 401, message: 'Token expired' }); }
                 // Si el token es válido, resuelve el usuario (sub) contenido en el payload
                resolve(payload.sub);
            } catch (error){
                reject({
                    status: 500,
                    message: 'Invalid token',
                    errorMessage: error.message
                });
            }
        });
        // Devuelve la promesa que se resolverá cuando el token sea decodificado o falle
        return decoded;
}

// Exporta las funciones para ser utilizadas en otras partes de la aplicación
module.exports = {createToken, decodeToken};