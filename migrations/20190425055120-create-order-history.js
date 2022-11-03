'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Order_Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        type: Sequelize.INTEGER
      },
      order_comment: {
        type: Sequelize.STRING
      },
      order_status: {
        type: Sequelize.STRING
      },
      update_time: {
        type: Sequelize.DATE
      },
      order_type: {
        type: Sequelize.STRING
      },
      order_attachment: {
        type: Sequelize.JSON
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Order_Histories');
  }
};