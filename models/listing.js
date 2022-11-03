'use strict';
module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    AdzaProfileId: DataTypes.INTEGER,
    ChannelId: DataTypes.INTEGER,
    media_type: DataTypes.STRING,
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    featured_photo: DataTypes.STRING,
    description: DataTypes.STRING,
    insert_date: DataTypes.DATE
  }, {});
  Listing.associate = function(models) {
    // associations can be defined here
  };
  return Listing;
};