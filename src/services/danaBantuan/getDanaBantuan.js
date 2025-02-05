const { DanaBantuan, Penerima } = require('../../models');
const { Op } = require('sequelize');

const GetDanaBantuan = async ({ id = null, search = '', page = 1, limit = 10 }) => {
  if (id) {
    try {
      const danaBantuan = await DanaBantuan.findByPk(id, {
        include: [{
          model: Penerima,
          as: 'penerima',  // Alias for the Penerima model (can be customized)
          attributes: ['id_penerima', 'nama', 'nim', 'program_studi'] // specify the fields to include
        }]
      });

      if (!danaBantuan) {
        throw new Error(`Dana Bantuan with id ${id} not found`);
      }

      return danaBantuan;
    } catch (error) {
      throw new Error(`Failed to retrieve Dana Bantuan data: ${error.message}`);
    }
  }

  const pageNumber = parseInt(page) || 1;
  const pageLimit = parseInt(limit) || 10;
  const offset = (pageNumber - 1) * pageLimit;

  const options = {
    where: {},
    limit: pageLimit,
    offset,
    order: [['tahun', 'DESC']],
    include: [{
      model: Penerima,
      as: 'penerima', // Alias for the Penerima model
      attributes: ['id_penerima', 'nama', 'nim', 'program_studi'] // fields from Penerima table
    }]
  };

  if (search) {
    options.where.name = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await DanaBantuan.findAndCountAll(options);
    return {
      data: rows,
      total: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageLimit),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve Dana Bantuan data: ${error.message}`);
  }
};

module.exports = GetDanaBantuan;
