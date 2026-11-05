'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asignaciones_viaje', {
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
      conductor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conductores',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      ruta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rutas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fecha_salida: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fecha_retorno: {
        type: Sequelize.DATE,
        allowNull: true
      },
      km_inicial: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      km_final: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'en_curso'
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
    await queryInterface.dropTable('asignaciones_viaje');
  }
};

