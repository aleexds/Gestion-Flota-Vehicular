'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SancionMulta extends Model {
    static associate(models) {
      if (models.Conductor) {
        SancionMulta.belongsTo(models.Conductor, {
          foreignKey: 'conductor_id',
          as: 'conductor'
        });
      }
      if (models.Vehiculo) {
        SancionMulta.belongsTo(models.Vehiculo, {
          foreignKey: 'vehiculo_id',
          as: 'vehiculo'
        });
      }
    }
  }

  SancionMulta.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      conductor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'conductores',
          key: 'id'
        }
      },
      vehiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vehiculos',
          key: 'id'
        }
      },
      numero_boleta: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      fecha_infraccion: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      motivo: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      monto_multa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      estado_pago: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'pendiente'
      }
    },
    {
      sequelize,
      modelName: 'SancionMulta',
      tableName: 'sanciones_multas',
      timestamps: true
    }
  );

  return SancionMulta;
};

