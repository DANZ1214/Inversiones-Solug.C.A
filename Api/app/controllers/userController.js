'use strict'

const db = require('../config/db')
const user = db.user; // ahora coincide con el modelo definido en userModels.js

// Obtener todos los usuarios activos (userest = 'activo')
async function getUser(req, res) {
    user.findAll({ where: { userest: 'activo' } })
    .then(result => {
        res.status(200).json(result)
    })
    .catch(error => {
        res.status(500).json({ message: error.message || "Sucedió un error inesperado" })
    });
}

// Insertar un nuevo usuario
async function insertUser(req, res) {
    // esperar campos con nombres reales
    const { userus, usercorreo, usercontra, usernum, userdirecol, usernom, userape, userrol } = req.body;

    if (!userus || !usercorreo || !usercontra || userrol === undefined) {
        return res.status(400).send({ message: "Campos requeridos: userus, usercorreo, usercontra, userrol" });
    }

    user.create({ userus, usercorreo, usercontra, usernum, userdirecol, usernom, userape, userrol, userest: 'activo' })
    .then(result => {
        res.status(201).send({ message: "Usuario creado exitosamente", result });
    })
    .catch(error => {
        res.status(500).send({ message: error.message || "Error al insertar usuario" });
    });
}

// "Eliminar" un usuario existente (cambiar userest a 'inactivo')
async function deleteUser(req, res) {
    const { userus, iduser } = req.body;

    if (!userus && !iduser) {
        return res.status(400).send({ message: "Se requiere userus o iduser" });
    }

    const where = iduser ? { iduser, userest: 'activo' } : { userus, userest: 'activo' };

    user.update(
        { userest: 'inactivo' },
        { where }
    )
    .then(([rowsUpdated]) => {
        if (rowsUpdated > 0) {
            res.status(200).send({ message: "Usuario desactivado exitosamente" });
        } else {
            res.status(404).send({ message: "Usuario no encontrado o ya está inactivo" });
        }
    })
    .catch(error => {
        res.status(500).send({ message: error.message || "Error al desactivar usuario" });
    });
}

// Actualizar datos de un usuario existente
async function updateUser(req, res) {
    const { iduser, userus, usercorreo, usernum, userdirecol, usernom, userape, userrol } = req.body;

    if (!iduser && !userus) {
        return res.status(400).send({ message: "Se requiere iduser o userus para identificar al usuario" });
    }

    const where = iduser ? { iduser, userest: 'activo' } : { userus, userest: 'activo' };

    const toUpdate = {};
    if (userus !== undefined) toUpdate.userus = userus;
    if (usercorreo !== undefined) toUpdate.usercorreo = usercorreo;
    if (usernum !== undefined) toUpdate.usernum = usernum;
    if (userdirecol !== undefined) toUpdate.userdirecol = userdirecol;
    if (usernom !== undefined) toUpdate.usernom = usernom;
    if (userape !== undefined) toUpdate.userape = userape;
    if (userrol !== undefined) toUpdate.userrol = userrol;

    if (Object.keys(toUpdate).length === 0) {
        return res.status(400).send({ message: "No hay campos para actualizar" });
    }

    user.update(
        toUpdate,
        { where }
    )
    .then(([rowsUpdated]) => {
        if (rowsUpdated > 0) {
            res.status(200).send({ message: "Usuario actualizado exitosamente" });
        } else {
            res.status(404).send({ message: "Usuario no encontrado o está inactivo" });
        }
    })
    .catch(error => {
        res.status(500).send({ message: error.message || "Error al actualizar usuario" });
    });
}

// Inicio de sesión: busca solo usuarios con userest = 'activo'
// acepta identificador (userus o usercorreo) y contraseña usercontra
async function login(req, res) {
    const identifier = req.body.userId || req.body.username || req.body.userus || req.body.usercorreo;
    const pass = req.body.pass || req.body.password || req.body.usercontra;

    if (!identifier || !pass) {
        return res.status(400).json({ success: false, message: "Usuario y contraseña requeridos" });
    }

    try {
        // Primero buscar por userus
        let userFound = await user.findOne({ where: { userus: identifier, usercontra: pass, userest: 'activo' } });

        // Si no, buscar por usercorreo
        if (!userFound) {
            userFound = await user.findOne({ where: { usercorreo: identifier, usercontra: pass, userest: 'activo' } });
        }

        if (!userFound) {
            return res.status(401).json({ success: false, message: "Credenciales incorrectas o usuario inactivo" });
        }

        // Determinar rol según campo userrol (1=admin,2=trab,3=user)
        const role = Number(userFound.userrol) || 3;

        return res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso",
            role,
            user: {
                iduser: userFound.iduser,
                userus: userFound.userus,
                usernom: userFound.usernom,
                userape: userFound.userape
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ success: false, message: error.message || "Error en el servidor" });
    }
}

module.exports = {
    getUser,
    insertUser,
    deleteUser,
    updateUser,
    login
}