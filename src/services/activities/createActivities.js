const { Activities, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const CreateActivities = async (body, path) => {
  // Start transaction
  const transaction = await sequelize.transaction();
  // Handle image file
  try {
    // Validate required fields
    const { title, date, image } = body;

    if (!title || !date || !image) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Title and date are required fields',
      });
    }

    // Create the activity record within a transaction
    const newActivity = await Activities.create(
      {
        title,
        image, // store the file name in the database or null if no image
        description: body.description || '', // optional
        date,
        url: body.url || '', // optional
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return newActivity;
  } catch (error) {
    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create activity: ${error.message || error}`,
    });
  }
};

module.exports = CreateActivities;