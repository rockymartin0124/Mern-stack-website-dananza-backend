'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Channels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AdzaProfileId: {
        type: Sequelize.INTEGER
      },
      media_type: {
        type: Sequelize.STRING
      },
      follows: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      linked_channel: {
        type: Sequelize.STRING
      },
      add_time: {
        type: Sequelize.DATE
      },
      active: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Channels');
  }
};