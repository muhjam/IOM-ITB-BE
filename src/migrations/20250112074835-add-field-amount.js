'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Donations', 'amount', {
      type: Sequelize.DECIMAL(10, 2), 
      allowNull: true,
      defaultValue: 0.0, // Nilai default
      comment: 'Jumlah donasi dalam format desimal'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Donations', 'amount');
  }
};
