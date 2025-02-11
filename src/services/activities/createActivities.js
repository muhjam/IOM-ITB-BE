const { Activities, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const CreateActivities = async (body, path) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, date, image, url } = body;

    if (!title || !date || !image) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Judul, tanggal, dan gambar wajib diisi.',
      });
    }

    // Cek apakah URL sudah digunakan
    if (url) {
      const existingActivity = await Activities.findOne({ where: { url } });
      if (existingActivity) {
        throw new BaseError({
          status: StatusCodes.CONFLICT,
          message: 'URL sudah digunakan. Silakan gunakan URL yang berbeda.',
        });
      }
    }

    const newActivity = await Activities.create(
      {
        title,
        image,
        description: body.description || '',
        date,
        url: url || '',
      },
      { transaction }
    );

    await transaction.commit();
    return newActivity;
  } catch (error) {
    await transaction.rollback(); // Rollback transaksi jika terjadi kesalahan

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Gagal membuat aktivitas: ${error.message || error}`,
    });
  }
};

module.exports = CreateActivities;
