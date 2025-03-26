'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MerchantRequestID: {
        type: Sequelize.STRING
      },
      CheckoutRequestID: {
        type: Sequelize.STRING
      },
      ResultCode: {
        type: Sequelize.INTEGER
      },
      ResultDesc: {
        type: Sequelize.STRING
      },
      Amount: {
        type: Sequelize.INTEGER
      },
      PhoneNumber: {
        type: Sequelize.STRING
      },
      TransactionDate: {
        type: Sequelize.BIGINT
      },
      MPesaReceiptNumber: {
        type: Sequelize.STRING
      },
      Status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};