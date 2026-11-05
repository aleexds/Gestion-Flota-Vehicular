'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrdenMantenimiento extends Model {
    static associate(models) {
      OrdenMantenimiento.belongsTo(models.Vehiculo, {
        foreignKey: 'vehiculo_id',
        as: 'vehiculo'
      });
      OrdenMantenimiento.belongsTo(models.TallerProveedor, {
        foreignKey: 'taller_id',
        as: 'taller'
      });
      OrdenMantenimiento.hasMany(models.DetalleRepuestoOrden, {
        foreignKey: 'orden_id',
        as: 'detalles_repuestos'
      });
    }
  }

  OrdenMantenimiento.init(
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
      taller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'talleres_proveedores',
          key: 'id'
        }
      },
      fecha_apertura: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      fecha_cierre: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      tipo_mantenimiento: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      km_registro: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      descripcion_problema: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      costo_mano_obra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      costo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'abierta'
      }
    },
    {
      sequelize,
      modelName: 'OrdenMantenimiento',
      tableName: 'ordenes_mantenimiento',
      timestamps: true
    }
  );

  return OrdenMantenimiento;
};

