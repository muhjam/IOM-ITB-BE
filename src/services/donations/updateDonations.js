const { Donations, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const UpdateDonations = async (id, body) => {
  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing donation record
    const donation = await Donations.findByPk(id, { transaction });

    if (!donation) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Donation not found',
      });
    }

    const { name, email, noWhatsapp, notification, proof, nameIsHidden, amount } = body;

    if (!name && !email && !noWhatsapp && !notification && !proof && nameIsHidden === undefined && !amount) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one field (name, email, noWhatsapp, notification, amount, proof, or nameIsHidden) must be provided for update',
      });
    }

    // Update the donation with new data
    const updatedDonation = await Donations.update(
      {
        name: name || donation.name,
        email: email || donation.email,
        noWhatsapp: noWhatsapp || donation.noWhatsapp,
        notification: notification || donation.notification,
        proof: proof || donation.proof,
        amount: amount || donation.amount,
        option: {
          ...donation.option,
          nameIsHidden: nameIsHidden !== undefined ? nameIsHidden : donation.option?.nameIsHidden,
        },
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedDonation;
  } catch (error) {
    await transaction.rollback();

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update donation: ${error.message || error}`,
    });
  }
};

module.exports = UpdateDonations;
