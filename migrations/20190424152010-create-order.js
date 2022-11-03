'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BuyerProfileId: {
        type: Sequelize.INTEGER
      },
      CampaignListingId: {
        type: Sequelize.INTEGER
      },
      order_status: {
        type: Sequelize.STRING
      },
      order_date: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Orders');
  }
};