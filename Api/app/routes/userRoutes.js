'use strict';

// Importa el módulo express para crear el enrutador.
const express = require('express');
// Importa el controlador de usuarios que contiene la lógica de las rutas.
const userController = require('../controllers/userController');
// Crea una nueva instancia de enrutador de express.
const apiRoutes = express.Router();
// Importa el middleware de autenticación.
const auth = require('../middlewares/auth')

/**
 * Define las rutas de la API para las operaciones relacionadas con los usuarios.
 *
 * @module apiRoutes
 */


apiRoutes.get('/getUser', async (req, res) => await userController.getUser(req, res));

apiRoutes.post('/insertUser', async (req, res) => await userController.insertUser(req, res));

apiRoutes.put('/updateUser', async (req, res) => await userController.updateUser(req, res));

apiRoutes.delete('/deleteUser', async (req, res) => await userController.deleteUser(req, res));

apiRoutes.post('/login', async (req, res) => await userController.login(req, res));

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación.
module.exports = apiRoutes;
