'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InventarioNeumatico extends Model {
    static associate(models) {
      if (models.MontajeNeumatico) {
        InventarioNeumatico.hasMany(models.MontajeNeumatico, {
          foreignKey: 'neumatico_id',
          as: 'montajes'
        });
      }
    }
  }

  InventarioNeumatico.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      codigo_serie: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      marca: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      medida: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      profundidad_huella_mm: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'nuevo'
      }
    },
    {
      sequelize,
      modelName: 'InventarioNeumatico',
      tableName: 'inventario_neumaticos',
      timestamps: true
    }
  );

  return InventarioNeumatico;
};

