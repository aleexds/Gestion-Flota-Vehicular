'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CategoriaVehiculo extends Model {
    static associate(models) {
      CategoriaVehiculo.hasMany(models.Vehiculo, {
        foreignKey: 'categoria_id',
        as: 'vehiculos'
      });
    }
  }

  CategoriaVehiculo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      requiere_licencia_tipo: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      intervalo_km_mantenimiento: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'CategoriaVehiculo',
      tableName: 'categorias_vehiculo',
      timestamps: true
    }
  );

  return CategoriaVehiculo;
};

