'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MontajeNeumatico extends Model {
    static associate(models) {
      if (models.Vehiculo) {
        MontajeNeumatico.belongsTo(models.Vehiculo, {
          foreignKey: 'vehiculo_id',
          as: 'vehiculo'
        });
      }
      if (models.InventarioNeumatico) {
        MontajeNeumatico.belongsTo(models.InventarioNeumatico, {
          foreignKey: 'neumatico_id',
          as: 'neumatico'
        });
      }
    }
  }

  MontajeNeumatico.init(
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
      neumatico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'inventario_neumaticos',
          key: 'id'
        }
      },
      posicion_eje: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      fecha_instalacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      km_instalacion: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fecha_desmonte: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      km_desmonte: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'MontajeNeumatico',
      tableName: 'montaje_neumaticos',
      timestamps: true
    }
  );

  return MontajeNeumatico;
};

