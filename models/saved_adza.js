'use strict';
module.exports = (sequelize, DataTypes) => {
  const Saved_Adza = sequelize.define('Saved_Adza', {
    BuyerProfileId: DataTypes.INTEGER,
    AdzaProfileId: DataTypes.INTEGER,
    ListingId: DataTypes.INTEGER,
    save_time: DataTypes.DATE
  }, {});
  Saved_Adza.associate = function(models) {
    // associations can be defined here
  };
  return Saved_Adza;
};