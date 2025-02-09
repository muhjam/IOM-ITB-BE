const { Activities } = require('../../models');
const { Op } = require('sequelize');

const GetActivities = async ({ id = null, search = '', page = 1, limit = 10 }) => {
  if (id) {
    try {
      const activity = await Activities.findByPk(id);
      if (!activity) {
        return { message: `Activity dengan id ${id} tidak ditemukan` };
      }
      return activity;
    } catch (error) {
      return { message: `Terjadi kesalahan: ${error.message}` };
    }
  }

  // Logika untuk pencarian semua activities
  const pageNumber = parseInt(page) || 1;
  const pageLimit = parseInt(limit);
  const offset = (pageNumber - 1) * pageLimit;

  const options = {
    where: {},
    limit: pageLimit,
    offset,
    order: [['createdAt', 'DESC']],
  };

  if (search) {
    options.where.title = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await Activities.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageLimit),
    };
  } catch (error) {
    throw new Error(`Gagal mengambil data activity: ${error.message}`);
  }
};

module.exports = GetActivities;
