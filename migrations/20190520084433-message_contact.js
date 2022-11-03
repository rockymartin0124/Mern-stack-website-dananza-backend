'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      BuyerProfileId: {
        type: Sequelize.INTEGER
      },
      AdzaProfileId: {
        type: Sequelize.INTEGER
      },
      message_text: {
        type: Sequelize.STRING
      },
      message_time: {
        type: Sequelize.DATE
      },
      is_new: {
        type: Sequelize.BOOLEAN
      },
      s_type: {
        type: Sequelize.STRING
      },
      MessageContactId: {
        type: Sequelize.INTEGER
      },
    });
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('Messages');
  }
};
