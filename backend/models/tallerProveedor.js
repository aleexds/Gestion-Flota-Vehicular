'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TallerProveedor extends Model {
    static associate(models) {
      TallerProveedor.hasMany(models.OrdenMantenimiento, {
        foreignKey: 'taller_id',
        as: 'ordenes_mantenimiento'
      });
    }
  }

  TallerProveedor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      cedula_juridica: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre_comercial: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      telefono: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      especialidad: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'TallerProveedor',
      tableName: 'talleres_proveedores',
      timestamps: true
    }
  );

  return TallerProveedor;
};

