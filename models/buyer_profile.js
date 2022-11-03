'use strict';
module.exports = (sequelize, DataTypes) => {
  const Buyer_Profile = sequelize.define('Buyer_Profile', {
    UserId: DataTypes.INTEGER,
    has_seller_acct: DataTypes.BOOLEAN,
    profile_description: DataTypes.STRING,
    job_type: DataTypes.STRING,
    locations: DataTypes.JSON,
    linkedAccounts: DataTypes.JSON,
    accounts: DataTypes.JSON,
    signup_date: DataTypes.DATE
  }, {});
  Buyer_Profile.associate = function(models) {
    // associations can be defined here
  };

  Buyer_Profile.getBuyerFromUserID = function(UserId, callback){
    return this.findOne({ where: {UserId: UserId} })
        .then((profile) => { return callback(null, profile);})
        .catch((error) => { return callback(error, null);});
  };
  return Buyer_Profile;
};