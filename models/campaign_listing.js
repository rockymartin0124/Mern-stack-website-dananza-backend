'use strict';
module.exports = (sequelize, DataTypes) => {
  const Campaign_Listing = sequelize.define('Campaign_Listing', {
    CampaignId: DataTypes.INTEGER,
    AdzaProfileId: DataTypes.INTEGER,
    ListingId: DataTypes.INTEGER,
    Counts: DataTypes.INTEGER,
    add_time: DataTypes.DATE
  }, {});
  Campaign_Listing.associate = function(models) {
    // associations can be defined here
  };
  return Campaign_Listing;
};