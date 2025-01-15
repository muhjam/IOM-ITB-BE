const { Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteMerchandises = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Cari merchandise berdasarkan id
    const merchandise = await Merchandises.findByPk(id, { transaction });

    // Jika merchandise tidak ditemukan, lemparkan error
    if (!merchandise) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Merchandise not found',
      };
    }

    // Hapus merchandise
    await merchandise.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Merchandise deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete merchandise: ${error.message || error}`);
  }
};

module.exports = DeleteMerchandises;
