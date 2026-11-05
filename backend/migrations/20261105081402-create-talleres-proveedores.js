'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('talleres_proveedores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cedula_juridica: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre_comercial: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      correo: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      especialidad: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable('talleres_proveedores');
  }
};

