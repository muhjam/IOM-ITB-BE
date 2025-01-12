'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Donations', 'options', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Field untuk menyimpan data tambahan dalam format JSON'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Donations', 'options');
  }
};
