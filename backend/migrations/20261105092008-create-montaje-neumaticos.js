'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('montaje_neumaticos', {
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
        onDelete: 'CASCADE'
      },
      neumatico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'inventario_neumaticos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      posicion_eje: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      fecha_instalacion: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      km_instalacion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fecha_desmonte: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      km_desmonte: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.dropTable('montaje_neumaticos');
  }
};

