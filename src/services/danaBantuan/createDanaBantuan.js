const { DanaBantuan, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const CreateDanaBantuan = async (body) => {
  const transaction = await sequelize.transaction();

  try {
    // Validasi field yang diperlukan
    const { id_penerima, jenis_bantuan, bulan, tahun, jumlah_donasi } = body;

    if (!id_penerima || !jenis_bantuan || !bulan || !tahun || !jumlah_donasi) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Semua field (id_penerima, jenis_bantuan, bulan, tahun, jumlah_donasi) wajib diisi.',
      });
    }

    // Membuat record DanaBantuan dalam transaksi
    const newDanaBantuan = await DanaBantuan.create(
      {
        id_penerima,
        jenis_bantuan,
        bulan,
        tahun,
        jumlah_donasi,
      },
      { transaction }
    );

    // Commit transaksi jika berhasil
    await transaction.commit();
    return newDanaBantuan;
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await transaction.rollback();
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Gagal membuat DanaBantuan: ${error.message || error}`,
    });
  }
};

module.exports = CreateDanaBantuan;