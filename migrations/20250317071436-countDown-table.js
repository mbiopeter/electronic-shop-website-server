'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CountDowns', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      seconds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CountDowns');
  }
};
