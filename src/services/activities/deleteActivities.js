const { Activities, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteActivities = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Find activity by id
    const activity = await Activities.findByPk(id, { transaction });

    // If activity not found, throw an error
    if (!activity) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Activity not found',
      };
    }

    // Delete the activity
    await activity.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Activity deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete activity: ${error.message || error}`);
  }
};

module.exports = DeleteActivities;
