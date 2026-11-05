'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BitacoraEstadoVehiculo extends Model {
    static associate(models) {
      if (models.Vehiculo) {
        BitacoraEstadoVehiculo.belongsTo(models.Vehiculo, {
          foreignKey: 'vehiculo_id',
          as: 'vehiculo'
        });
      }
    }
  }

  BitacoraEstadoVehiculo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      vehiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vehiculos',
          key: 'id'
        }
      },
      fecha_cambio: {
        type: DataTypes.DATE,
        allowNull: false
      },
      estado_anterior: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      estado_nuevo: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      motivo_cambio: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'BitacoraEstadoVehiculo',
      tableName: 'bitacora_estado_vehiculo',
      timestamps: true
    }
  );

  return BitacoraEstadoVehiculo;
};

