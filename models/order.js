'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    BuyerProfileId: DataTypes.INTEGER,
    CampaignListingId: DataTypes.INTEGER,
    order_status: DataTypes.STRING,
    order_date: DataTypes.DATE
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};