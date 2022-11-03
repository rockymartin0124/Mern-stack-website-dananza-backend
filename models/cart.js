'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    CampaignId: DataTypes.INTEGER,
    subtotal: DataTypes.FLOAT,
    BuyerProfileId: DataTypes.INTEGER,
  }, {});
 	
 	Cart.associate = function(models) {
    	// associations can be defined here
  	};
  	
  	return Cart;
};