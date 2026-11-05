'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ordenes_mantenimiento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vehiculo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vehiculos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      taller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'talleres_proveedores',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fecha_apertura: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_cierre: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      tipo_mantenimiento: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      km_registro: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      descripcion_problema: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      costo_mano_obra: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      costo_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'abierta'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ordenes_mantenimiento');
  }
};

