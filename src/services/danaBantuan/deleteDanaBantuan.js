const { DanaBantuan, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteDanaBantuan = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Find dana bantuan by id
    const danaBantuan = await DanaBantuan.findByPk(id, { transaction });

    // If dana bantuan not found, throw an error
    if (!danaBantuan) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Dana Bantuan not found',
      };
    }

    // Get the previous proof file path
    const previousProofPath = danaBantuan.bukti_transfer;
    if (previousProofPath) {
      const previousProofFileName = path.basename(previousProofPath);
      const previousProofFilePath = path.join(__dirname, '../../uploads', previousProofFileName);

      // Check if the file exists and delete it
      if (fs.existsSync(previousProofFilePath)) {
        console.log('Deleting file:', previousProofFilePath); // Log file path being deleted
        fs.unlinkSync(previousProofFilePath);
        console.log('Deleted');
      } else {
        console.log('File does not exist:', previousProofFilePath); // Log if file does not exist
      }
    }

    // Delete the dana bantuan record
    await danaBantuan.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Dana Bantuan deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete Dana Bantuan: ${error.message || error}`);
  }
};

module.exports = DeleteDanaBantuan;