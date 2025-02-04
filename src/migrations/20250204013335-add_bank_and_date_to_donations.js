'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Donations', 'date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'bank', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Donations', 'date');
    await queryInterface.removeColumn('Donations', 'bank');
  },
};

