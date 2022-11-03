'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    AdzaProfileId: DataTypes.INTEGER,
    media_type: DataTypes.STRING,
    follows: DataTypes.INTEGER,
    username: DataTypes.STRING,
    linked_channel: DataTypes.STRING,
    add_time: DataTypes.DATE,
    active: DataTypes.BOOLEAN    
  }, {});
  Channel.associate = function(models) {
    // associations can be defined here
  };
  return Channel;
};