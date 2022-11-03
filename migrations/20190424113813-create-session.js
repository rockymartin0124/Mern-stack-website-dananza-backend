'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BuyerProfileId: {
        type: Sequelize.INTEGER
      },
      adza_result_click: {
        type: Sequelize.BOOLEAN
      },
      adza_profile_id: {
        type: Sequelize.INTEGER
      },
      adza_page_interaction: {
        type: Sequelize.BOOLEAN
      },
      page_action: {
        type: Sequelize.STRING
      },
      page_addtocart: {
        type: Sequelize.BOOLEAN
      },
      action_choose_date: {
        type: Sequelize.BOOLEAN
      },
      ation_expandchannel: {
        type: Sequelize.BOOLEAN
      },
      actions_expandlisting: {
        type: Sequelize.BOOLEAN
      },
      action_galleryscroll: {
        type: Sequelize.BOOLEAN
      },
      action_profilesaved: {
        type: Sequelize.BOOLEAN
      },
      action_morereviews: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sessions');
  }
};