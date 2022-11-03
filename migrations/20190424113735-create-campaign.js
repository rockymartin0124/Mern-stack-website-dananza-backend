'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BuyerProfileId: {
        type: Sequelize.INTEGER
      },
      campaign_name: {
        type: Sequelize.STRING
      },
      campaign_status: {
        type: Sequelize.STRING
      },
      campaign_price: {
        type: Sequelize.FLOAT
      },
      created_at: {
        type: Sequelize.DATE
      },
      CartId: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Campaigns');
  }
};