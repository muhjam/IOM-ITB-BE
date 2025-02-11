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
        message: 'Aktivitas tidak ditemukan.',
      });
    }

    const { title, date, description, url, image } = body;

    if (!title && !date && !description && !url && !image) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Setidaknya salah satu dari judul, tanggal, atau gambar harus diisi untuk pembaruan.',
      });
    }

    // Cek apakah URL sudah digunakan oleh aktivitas lain
    if (url && url !== activity.url) {
      const existingActivity = await Activities.findOne({ where: { url } });
      if (existingActivity) {
        throw new BaseError({
          status: StatusCodes.CONFLICT,
          message: 'URL sudah digunakan. Silakan gunakan URL yang berbeda.',
        });
      }
    }

    // Perbarui aktivitas dengan data baru
    const updatedActivity = await Activities.update(
      {
        title: title || activity.title,
        image: image || activity.image,
        description: description || activity.description,
        date: date !== undefined ? date : activity.date,
        url: url !== undefined ? url : activity.url,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedActivity;
  } catch (error) {
    await transaction.rollback(); // Rollback transaksi jika terjadi kesalahan

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Gagal memperbarui aktivitas: ${error.message || error}`,
    });
  }
};

module.exports = UpdateActivities;
