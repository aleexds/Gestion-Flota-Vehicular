'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventario_neumaticos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo_serie: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      marca: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      medida: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      profundidad_huella_mm: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'nuevo'
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
    await queryInterface.dropTable('inventario_neumaticos');
  }
};

