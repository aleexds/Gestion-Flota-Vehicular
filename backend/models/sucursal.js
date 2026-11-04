'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sucursal extends Model {
    /**
     * Asociaciones del modelo Sucursal según el diagrama entidad-relación
     */
    static associate(models) {
      // 1. Una sucursal origina muchas rutas (origina)
      if (models.Ruta) {
        Sucursal.hasMany(models.Ruta, {
          foreignKey: 'sucursal_origen_id',
          as: 'rutas'
        });
      }

      // 2. Una sucursal emplea a muchos conductores (emplea)
      if (models.Conductor) {
        Sucursal.hasMany(models.Conductor, {
          foreignKey: 'sucursal_id',
          as: 'conductores'
        });
      }

      // 3. Una sucursal alberga a muchos vehículos (alberga)
      if (models.Vehiculo) {
        Sucursal.hasMany(models.Vehiculo, {
          foreignKey: 'sucursal_id',
          as: 'vehiculos'
        });
      }
    }
  }

  Sucursal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      telefono: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Sucursal',
      tableName: 'sucursales',
      timestamps: true
    }
  );

  return Sucursal;
};

