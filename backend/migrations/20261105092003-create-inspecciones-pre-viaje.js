'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inspecciones_pre_viaje', {
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
      conductor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conductores',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_inspeccion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      nivel_aceite_ok: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      presion_llantas_ok: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      luces_ok: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      frenos_ok: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      resultado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'aprobado'
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
    await queryInterface.dropTable('inspecciones_pre_viaje');
  }
};

