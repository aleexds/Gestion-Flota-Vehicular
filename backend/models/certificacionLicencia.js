'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CertificacionLicencia extends Model {
    static associate(models) {
      if (models.Conductor) {
        CertificacionLicencia.belongsTo(models.Conductor, {
          foreignKey: 'conductor_id',
          as: 'conductor'
        });
      }
    }
  }

  CertificacionLicencia.init(
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
      tipo_credencial: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      entidad_emisora: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      fecha_emision: {
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
      modelName: 'CertificacionLicencia',
      tableName: 'certificaciones_licencias',
      timestamps: true
    }
  );

  return CertificacionLicencia;
};

