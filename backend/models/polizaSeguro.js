'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PolizaSeguro extends Model {
    static associate(models) {
      PolizaSeguro.belongsTo(models.Vehiculo, {
        foreignKey: 'vehiculo_id',
        as: 'vehiculo'
      });
      if (models.ReclamacionSeguro) {
        PolizaSeguro.hasMany(models.ReclamacionSeguro, {
          foreignKey: 'poliza_id',
          as: 'reclamaciones'
        });
      }
    }
  }

  PolizaSeguro.init(
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
      aseguradora: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      numero_poliza: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      cobertura: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      monto_cobertura: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'vigente'
      }
    },
    {
      sequelize,
      modelName: 'PolizaSeguro',
      tableName: 'polizas_seguro',
      timestamps: true
    }
  );

  return PolizaSeguro;
};
