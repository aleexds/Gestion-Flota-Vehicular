'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetalleRepuestoOrden extends Model {
    static associate(models) {
      DetalleRepuestoOrden.belongsTo(models.OrdenMantenimiento, {
        foreignKey: 'orden_id',
        as: 'orden'
      });
      DetalleRepuestoOrden.belongsTo(models.CatalogoRepuesto, {
        foreignKey: 'repuesto_id',
        as: 'repuesto'
      });
    }
  }

  DetalleRepuestoOrden.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      orden_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ordenes_mantenimiento',
          key: 'id'
        }
      },
      repuesto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'catalogo_repuestos',
          key: 'id'
        }
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      }
    },
    {
      sequelize,
      modelName: 'DetalleRepuestoOrden',
      tableName: 'detalle_repuestos_orden',
      timestamps: true
    }
  );

  return DetalleRepuestoOrden;
};

