'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamaciones_seguro', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      siniestro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'siniestros_accidentes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      poliza_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'polizas_seguro',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      numero_reclamo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      monto_reclamado: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      monto_deducible_pagado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      estado_reclamo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'en_evaluacion'
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
    await queryInterface.dropTable('reclamaciones_seguro');
  }
};

