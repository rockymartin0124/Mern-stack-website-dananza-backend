'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message_Contact = sequelize.define('Message_Contact', {
    BuyerProfileId: DataTypes.INTEGER,
    AdzaProfileId: DataTypes.INTEGER,
    connect_time: DataTypes.DATE
  }, {});
  Message_Contact.associate = function(models) {
    // associations can be defined here
  };
  return Message_Contact;
};