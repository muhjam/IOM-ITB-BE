const { Activities, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const UpdateActivities = async (id, body) => {
  const transaction = await sequelize.transaction();

  try {
    const activity = await Activities.findByPk(id, { transaction });

    if (!activity) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Activity not found',
      });
    }

    const { title, date, description, url, image } = body;

    if (!title && !date && !description && !url && !image) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one of title, date, or image must be provided for update',
      });
    }

    // Update activity with new data
    const updatedActivity = await Activities.update(
      {
        title: title || activity.title,
        image: image || activity.image,
        description: body.description || activity.description,
        date: date !== undefined ? date : activity.date,
        url: body.url !== undefined ? body.url : activity.url,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedActivity;
  } catch (error) {

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update activity: ${error.message || error}`,
    });
  }
};

module.exports = UpdateActivities;