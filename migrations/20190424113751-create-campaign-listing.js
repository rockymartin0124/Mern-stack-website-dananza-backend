'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Campaign_Listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CampaignId: {
        type: Sequelize.INTEGER
      },
      AdzaProfileId: {
        type: Sequelize.INTEGER
      },
      ListingId: {
        type: Sequelize.INTEGER
      },
      Counts: {
        type: Sequelize.INTEGER
      },
      add_time: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Campaign_Listings');
  }
};