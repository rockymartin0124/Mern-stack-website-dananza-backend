'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Message_Contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BuyerProfileId: {
        type: Sequelize.INTEGER
      },
      AdzaProfileId: {
        type: Sequelize.INTEGER
      },
      connect_time: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Message_Contacts');
  }
};