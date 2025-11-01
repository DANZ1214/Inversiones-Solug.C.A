'use strict'

const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const attributes = {
        iduser: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userus: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        usercorreo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        usercontra: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        usernum: {
            type: DataTypes.STRING(15)
        },
        userdirecol: {
            type: DataTypes.STRING(105)
        },
        usernom: {
            type: DataTypes.STRING(45)
        },
        userape: {
            type: DataTypes.STRING(45)
        },
        userrol: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userest: {
            type: DataTypes.ENUM('activo', 'inactivo', 'bloqueado'),
            defaultValue: 'activo'
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }

    const options = {
        defaultScope: {
            attributes: { exclude: ['updatedAt'] }
        },
        tableName: 'usuarios',
        timestamps: false
    }

    // Definir el modelo con nombre 'user' para que en db.user esté disponible
    return sequelize.define('user', attributes, options)
}