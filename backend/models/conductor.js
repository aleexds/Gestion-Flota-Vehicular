'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conductor extends Model {
    static associate(models) {
      Conductor.belongsTo(models.Sucursal, {
        foreignKey: 'sucursal_id',
        as: 'sucursal'
      });
      Conductor.hasMany(models.Vehiculo, {
        foreignKey: 'conductor_id',
        as: 'vehiculos_asignados'
      });
      Conductor.hasMany(models.AsignacionViaje, {
        foreignKey: 'conductor_id',
        as: 'asignaciones_viaje'
      });
      if (models.CertificacionLicencia) {
        Conductor.hasMany(models.CertificacionLicencia, {
          foreignKey: 'conductor_id',
          as: 'certificaciones'
        });
      }
      if (models.InspeccionPreViaje) {
        Conductor.hasMany(models.InspeccionPreViaje, {
          foreignKey: 'conductor_id',
          as: 'inspecciones'
        });
      }
      if (models.CargaCombustible) {
        Conductor.hasMany(models.CargaCombustible, {
          foreignKey: 'conductor_id',
          as: 'cargas_combustible'
        });
      }
      if (models.SiniestroAccidente) {
        Conductor.hasMany(models.SiniestroAccidente, {
          foreignKey: 'conductor_id',
          as: 'siniestros'
        });
      }
      if (models.SancionMulta) {
        Conductor.hasMany(models.SancionMulta, {
          foreignKey: 'conductor_id',
          as: 'sanciones'
        });
      }
    }
  }

  Conductor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sucursal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'sucursales',
          key: 'id'
        }
      },
      cedula: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre_completo: {
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
      licencia_tipo: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      licencia_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'activo'
      }
    },
    {
      sequelize,
      modelName: 'Conductor',
      tableName: 'conductores',
      timestamps: true
    }
  );

  return Conductor;
};
