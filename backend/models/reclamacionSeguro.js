'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReclamacionSeguro extends Model {
    static associate(models) {
      if (models.SiniestroAccidente) {
        ReclamacionSeguro.belongsTo(models.SiniestroAccidente, {
          foreignKey: 'siniestro_id',
          as: 'siniestro'
        });
      }
      if (models.PolizaSeguro) {
        ReclamacionSeguro.belongsTo(models.PolizaSeguro, {
          foreignKey: 'poliza_id',
          as: 'poliza'
        });
      }
    }
  }

  ReclamacionSeguro.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      siniestro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'siniestros_accidentes',
          key: 'id'
        }
      },
      poliza_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'polizas_seguro',
          key: 'id'
        }
      },
      numero_reclamo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      monto_reclamado: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      monto_deducible_pagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      estado_reclamo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'en_evaluacion'
      }
    },
    {
      sequelize,
      modelName: 'ReclamacionSeguro',
      tableName: 'reclamaciones_seguro',
      timestamps: true
    }
  );

  return ReclamacionSeguro;
};

