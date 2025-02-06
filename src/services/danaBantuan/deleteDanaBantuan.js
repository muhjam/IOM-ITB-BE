const { DanaBantuan, Penerima, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError'); // Assuming BaseError is used for errors

const DeleteDanaBantuan = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Find dana bantuan by id
    const danaBantuan = await DanaBantuan.findByPk(id, { transaction });

    // If dana bantuan not found, throw an error
    if (!danaBantuan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Dana Bantuan not found',
      });
    }

    // Delete the dana bantuan record
    await danaBantuan.destroy({ transaction });

    // Check if there are any other dana bantuan records related to the penerima
    const penerima = await Penerima.findByPk(danaBantuan.id_penerima, { transaction });

    // If no other DanaBantuan records exist for this Penerima, delete the Penerima record
    const remainingDanaBantuan = await DanaBantuan.count({
      where: { id_penerima: danaBantuan.id_penerima },
      transaction,
    });

    if (remainingDanaBantuan === 0 && penerima) {
      await penerima.destroy({ transaction });
      console.log('Penerima deleted successfully');
    }

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Dana Bantuan and related Penerima data deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Rethrow the error using BaseError for consistent error handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to delete Dana Bantuan: ${error.message || error}`,
    });
  }
};

module.exports = DeleteDanaBantuan;
