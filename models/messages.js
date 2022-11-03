'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    MessageContactId: DataTypes.INTEGER,
    BuyerProfileId: DataTypes.INTEGER,
    AdzaProfileId: DataTypes.INTEGER,
    message_text: DataTypes.STRING,
    message_time: DataTypes.DATE,
    is_new: DataTypes.BOOLEAN,
    s_type: DataTypes.STRING,
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};