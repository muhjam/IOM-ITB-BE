const { DanaBantuan, Penerima, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const CreateDanaBantuan = async (body) => {
  const transaction = await sequelize.transaction();

  try {
    // Validasi field yang diperlukan
    const { nama, nim, program_studi, jenis_bantuan, bulan, tahun, jumlah_donasi } = body;

    if (!nama || !nim || !program_studi || !jenis_bantuan || !bulan || !tahun || !jumlah_donasi) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Semua field (nama, nim, program_studi, jenis_bantuan, bulan, tahun, jumlah_donasi) wajib diisi.',
      });
    }

    // Membuat record Penerima dalam transaksi
    const newPenerima = await Penerima.create(
      {
        nama,
        nim,
        program_studi,
      },
      { transaction }
    );

    // Menggunakan id_penerima yang baru dibuat untuk membuat DanaBantuan
    const newDanaBantuan = await DanaBantuan.create(
      {
        id_penerima: newPenerima.id_penerima,  // Menggunakan id_penerima yang baru dibuat
        jenis_bantuan,
        bulan,
        tahun,
        jumlah_donasi,
      },
      { transaction }
    );

    // Mengambil data DanaBantuan dengan Penerima terkait
    const danaBantuanWithPenerima = await DanaBantuan.findOne({
      where: { id_dana: newDanaBantuan.id_dana },
      include: [
        {
          model: Penerima,
          as: 'penerima',  // Pastikan alias yang digunakan di sini sama dengan yang ada di model
          attributes: ['id_penerima', 'nama', 'nim', 'program_studi'],
        },
      ],
      transaction,
    });

    // Commit transaksi jika berhasil
    await transaction.commit();
    return danaBantuanWithPenerima;
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
