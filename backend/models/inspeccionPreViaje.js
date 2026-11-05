'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InspeccionPreViaje extends Model {
    static associate(models) {
      if (models.Vehiculo) {
        InspeccionPreViaje.belongsTo(models.Vehiculo, {
          foreignKey: 'vehiculo_id',
          as: 'vehiculo'
        });
      }
      if (models.Conductor) {
        InspeccionPreViaje.belongsTo(models.Conductor, {
          foreignKey: 'conductor_id',
          as: 'conductor'
        });
      }
    }
  }

  InspeccionPreViaje.init(
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
      fecha_inspeccion: {
        type: DataTypes.DATE,
        allowNull: false
      },
      nivel_aceite_ok: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      presion_llantas_ok: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      luces_ok: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      frenos_ok: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      resultado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'aprobado'
      }
    },
    {
      sequelize,
      modelName: 'InspeccionPreViaje',
      tableName: 'inspecciones_pre_viaje',
      timestamps: true
    }
  );

  return InspeccionPreViaje;
};

