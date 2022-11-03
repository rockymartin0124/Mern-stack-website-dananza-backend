'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    post_time: DataTypes.DATE,
    featured_image: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  Blog.associate = function(models) {
    // associations can be defined here
  };
  return Blog;
};