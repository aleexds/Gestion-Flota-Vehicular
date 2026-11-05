'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ruta extends Model {
    static associate(models) {
      Ruta.belongsTo(models.Sucursal, {
        foreignKey: 'sucursal_origen_id',
        as: 'sucursal_origen'
      });
      Ruta.hasMany(models.AsignacionViaje, {
        foreignKey: 'ruta_id',
        as: 'asignaciones_viaje'
      });
    }
  }

  Ruta.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sucursal_origen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'sucursales',
          key: 'id'
        }
      },
      nombre_ruta: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      destino: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      distancia_estimada_km: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      duracion_estimada_horas: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00
      }
    },
    {
      sequelize,
      modelName: 'Ruta',
      tableName: 'rutas',
      timestamps: true
    }
  );

  return Ruta;
};

