'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehiculo extends Model {
    static associate(models) {
      Vehiculo.belongsTo(models.CategoriaVehiculo, {
        foreignKey: 'categoria_id',
        as: 'categoria'
      });
      Vehiculo.belongsTo(models.Sucursal, {
        foreignKey: 'sucursal_id',
        as: 'sucursal'
      });
      Vehiculo.belongsTo(models.Conductor, {
        foreignKey: 'conductor_id',
        as: 'conductor_habitual'
      });
      Vehiculo.hasMany(models.AsignacionViaje, {
        foreignKey: 'vehiculo_id',
        as: 'asignaciones_viaje'
      });
      Vehiculo.hasMany(models.PolizaSeguro, {
        foreignKey: 'vehiculo_id',
        as: 'polizas_seguro'
      });
      Vehiculo.hasMany(models.OrdenMantenimiento, {
        foreignKey: 'vehiculo_id',
        as: 'ordenes_mantenimiento'
      });
    }
  }

  Vehiculo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      placa: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias_vehiculo',
          key: 'id'
        }
      },
      sucursal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'sucursales',
          key: 'id'
        }
      },
      conductor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'conductores',
          key: 'id'
        }
      },
      marca: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      modelo: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      anio: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      kilometraje_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      numero_chasis_vin: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'operativo'
      }
    },
    {
      sequelize,
      modelName: 'Vehiculo',
      tableName: 'vehiculos',
      timestamps: true
    }
  );

  return Vehiculo;
};

