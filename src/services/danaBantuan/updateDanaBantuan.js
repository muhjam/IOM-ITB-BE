const { DanaBantuan, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const UpdateDanaBantuan = async (id, body) => {
  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing record
    const danaBantuan = await DanaBantuan.findByPk(id, { transaction });

    if (!danaBantuan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Dana Bantuan not found',
      });
    }

    const { nama, email, noWhatsapp, bukti, jumlah, tanggal, bank } = body;

    if (!nama && !email && !noWhatsapp && !bukti && !jumlah && !tanggal && !bank) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one field must be provided for update',
      });
    }

    // Update the record with new data
    await DanaBantuan.update(
      {
        nama: nama || danaBantuan.nama,
        email: email || danaBantuan.email,
        noWhatsapp: noWhatsapp || danaBantuan.noWhatsapp,
        bukti: bukti || danaBantuan.bukti,
        jumlah: jumlah || danaBantuan.jumlah,
        tanggal: tanggal || danaBantuan.tanggal,
        bank: bank || danaBantuan.bank,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return { status: StatusCodes.OK, message: 'Dana Bantuan updated successfully' };
  } catch (error) {
    await transaction.rollback();

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update Dana Bantuan: ${error.message || error}`,
    });
  }
};

module.exports = UpdateDanaBantuan;
