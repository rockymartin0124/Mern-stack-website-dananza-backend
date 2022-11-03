'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn(
      'Users',
      'secure_question',
       Sequelize.STRING
    ),queryInterface.addColumn(
      'Users',
      'secure_answer',
       Sequelize.STRING
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn(
      'Users',
      'secure_question'
    ),queryInterface.removeColumn(
      'Users',
      'secure_answer'
    );
  }
};
