'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CargaCombustible extends Model {
    static associate(models) {
      if (models.Vehiculo) {
        CargaCombustible.belongsTo(models.Vehiculo, {
          foreignKey: 'vehiculo_id',
          as: 'vehiculo'
        });
      }
      if (models.Conductor) {
        CargaCombustible.belongsTo(models.Conductor, {
          foreignKey: 'conductor_id',
          as: 'conductor'
        });
      }
    }
  }

  CargaCombustible.init(
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
      fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
      },
      litros: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      costo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      kilometraje_recarga: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      numero_factura: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'CargaCombustible',
      tableName: 'cargas_combustible',
      timestamps: true
    }
  );

  return CargaCombustible;
};

