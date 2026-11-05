'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SiniestroAccidente extends Model {
    static associate(models) {
      if (models.Vehiculo) {
        SiniestroAccidente.belongsTo(models.Vehiculo, {
          foreignKey: 'vehiculo_id',
          as: 'vehiculo'
        });
      }
      if (models.Conductor) {
        SiniestroAccidente.belongsTo(models.Conductor, {
          foreignKey: 'conductor_id',
          as: 'conductor'
        });
      }
      if (models.ReclamacionSeguro) {
        SiniestroAccidente.hasMany(models.ReclamacionSeguro, {
          foreignKey: 'siniestro_id',
          as: 'reclamaciones'
        });
      }
    }
  }

  SiniestroAccidente.init(
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
      conductor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'conductores',
          key: 'id'
        }
      },
      fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
      },
      lugar_evento: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descripcion_danos: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      monto_estimado_danos: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      terceros_involucrados: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'SiniestroAccidente',
      tableName: 'siniestros_accidentes',
      timestamps: true
    }
  );

  return SiniestroAccidente;
};

