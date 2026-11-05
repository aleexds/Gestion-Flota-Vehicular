'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CatalogoRepuesto extends Model {
    static associate(models) {
      CatalogoRepuesto.hasMany(models.DetalleRepuestoOrden, {
        foreignKey: 'repuesto_id',
        as: 'detalles_orden'
      });
    }
  }

  CatalogoRepuesto.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      codigo_parte: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      categoria_repuesto: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      precio_referencia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      stock_almacen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'CatalogoRepuesto',
      tableName: 'catalogo_repuestos',
      timestamps: true
    }
  );

  return CatalogoRepuesto;
};

