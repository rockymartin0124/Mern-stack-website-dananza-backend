'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Adza_Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      profile_photo: {
        type: Sequelize.STRING
      },
      profile_description: {
        type: Sequelize.STRING
      },
      signup_date: {
        type: Sequelize.DATE
      },
      image_gallery: {
        type: Sequelize.JSON
      },
      audience_male_percent: {
        type: Sequelize.FLOAT
      },
      audience_age_min: {
        type: Sequelize.INTEGER
      },
      audience_age_max: {
        type: Sequelize.INTEGER
      },
      audience_locations: {
        type: Sequelize.JSON
      },
      audience_interests: {
        type: Sequelize.JSON
      },
      update_time: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Adza_Profiles');
  }
};