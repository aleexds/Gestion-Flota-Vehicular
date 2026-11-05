'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AsignacionViaje extends Model {
    static associate(models) {
      AsignacionViaje.belongsTo(models.Vehiculo, {
        foreignKey: 'vehiculo_id',
        as: 'vehiculo'
      });
      AsignacionViaje.belongsTo(models.Conductor, {
        foreignKey: 'conductor_id',
        as: 'conductor'
      });
      AsignacionViaje.belongsTo(models.Ruta, {
        foreignKey: 'ruta_id',
        as: 'ruta'
      });
    }
  }

  AsignacionViaje.init(
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
      conductor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'conductores',
          key: 'id'
        }
      },
      ruta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'rutas',
          key: 'id'
        }
      },
      fecha_salida: {
        type: DataTypes.DATE,
        allowNull: false
      },
      fecha_retorno: {
        type: DataTypes.DATE,
        allowNull: true
      },
      km_inicial: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      km_final: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'en_curso'
      }
    },
    {
      sequelize,
      modelName: 'AsignacionViaje',
      tableName: 'asignaciones_viaje',
      timestamps: true
    }
  );

  return AsignacionViaje;
};

