const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateDanaBantuan = require('../services/danaBantuan/createDanaBantuan');
const GetDanaBantuan = require('../services/danaBantuan/getDanaBantuan');
const UpdateDanaBantuan = require('../services/danaBantuan/updateDanaBantuan');
const DeleteDanaBantuan = require('../services/danaBantuan/deleteDanaBantuan');

const GetDanaBantuanById = async (req, res) => {
  try {
    const { id } = req.params;
    const danaBantuan = await GetDanaBantuan(id);

    if (!danaBantuan) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Dana Bantuan tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Dana Bantuan ditemukan',
      data: danaBantuan,
    }));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new BaseResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Terjadi kesalahan saat mengambil Dana Bantuan',
    }));
  }
};

const GetAllDanaBantuan = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const danaBantuanList = await GetDanaBantuan({
      search,
      page: pageNumber,
      limit: pageLimit,
    });

    const totalEntries = danaBantuanList.total;
    const totalPages = Math.ceil(totalEntries / pageLimit);

    const start = (pageNumber - 1) * pageLimit + 1;
    const end = Math.min(pageNumber * pageLimit, totalEntries);

    res.status(StatusCodes.OK).json({
      data: new DataTable(danaBantuanList.data)?.data,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        start,
        end,
        totalEntries,
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new BaseResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }));
  }
};

const CreateNewDanaBantuan = async (req, res) => {
  try {
    const { body } = req;
    const newDanaBantuan = await CreateDanaBantuan(body);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Dana Bantuan berhasil dibuat',
      data: newDanaBantuan,
    }));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new BaseResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Gagal membuat Dana Bantuan',
    }));
  }
};

const UpdateDanaBantuanById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedDanaBantuan = await UpdateDanaBantuan(id, body);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Dana Bantuan berhasil diperbarui',
      data: updatedDanaBantuan,
    }));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new BaseResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }));
  }
};

const DeleteDanaBantuanById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteDanaBantuan(id);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Dana Bantuan berhasil dihapus',
    }));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new BaseResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }));
  }
};

module.exports = {
  GetDanaBantuanById,
  GetAllDanaBantuan,
  CreateNewDanaBantuan,
  UpdateDanaBantuanById,
  DeleteDanaBantuanById,
};
