'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Buyer_Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      has_seller_acct: {
        type: Sequelize.BOOLEAN
      },
      profile_description: {
        type: Sequelize.STRING
      },
      job_type: {
        type: Sequelize.STRING
      },
      locations: {
        type: Sequelize.JSON
      },
      linkedAccounts: {
        type: Sequelize.JSON
      },
      accounts: {
        type: Sequelize.JSON
      },
      signup_date: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Buyer_Profiles');
  }
};
