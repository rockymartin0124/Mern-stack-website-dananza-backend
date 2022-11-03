'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    BuyerProfileId: DataTypes.INTEGER,
    adza_result_click: DataTypes.BOOLEAN,
    adza_profile_id: DataTypes.INTEGER,
    adza_page_interaction: DataTypes.BOOLEAN,
    page_action: DataTypes.STRING,
    page_addtocart: DataTypes.BOOLEAN,
    action_choose_date: DataTypes.BOOLEAN,
    ation_expandchannel: DataTypes.BOOLEAN,
    actions_expandlisting: DataTypes.BOOLEAN,
    action_galleryscroll: DataTypes.BOOLEAN,
    action_profilesaved: DataTypes.BOOLEAN,
    action_morereviews: DataTypes.BOOLEAN
  }, {});
  Session.associate = function(models) {
    // associations can be defined here
  };
  return Session;
};