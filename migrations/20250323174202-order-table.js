'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Pending'
      },
      processed: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      shipped: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivered: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      waitingDelivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      payment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paymentCode: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('Orders');
  }
};
