const { Merchandise, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');

const CreateMerchandise = async (body, files, path) => {
  // Start transaction
  const transaction = await sequelize.transaction();

  try {
    // Validate required fields
    const { name, price, stock } = body;

    if (!name || !price || !stock) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Name, price, and stock are required fields',
      });
    }

    // Handle image file
    const imageFile = files && files['image'] ? files['image'][0] : null;
    const imageFileName = imageFile ? `${path}/public/images/merchandise/${imageFile?.filename}` : null;

    // Create the merchandise record within a transaction
    const newMerchandise = await Merchandise.create(
      {
        name,
        image: imageFileName, // store the file name in the database or null if no image
        description: body.description || '', // optional
        price,
        stock,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return newMerchandise;
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Clean up uploaded files if any errors occur
    if (files && imageFile) {
      const imageFilePath = path.join(__dirname, '../../public/images/merchandise', imageFile.filename);
      if (fs.existsSync(imageFilePath)) {
        fs.unlinkSync(imageFilePath);
      }
    }
    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create merchandise: ${error.message || error}`,
    });
  }
};

module.exports = CreateMerchandise;
