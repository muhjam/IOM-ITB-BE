const { StatusCodes } = require('http-status-codes');
const axios = require('axios');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const { getUrlExcel } = require('../utils/excel');

const GetExcelById = async (req, res, next, token) => {
  try {
    const { id } = req.params;
    const url = await getUrlExcel();
    const response = await axios.get(`${url}/${token}`);
    const anggota = response.data.find((item) => item.id === id);

    if (!anggota) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Anggota tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Anggota ditemukan',
      data: anggota,
    }));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new BaseResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Terjadi kesalahan saat mengambil data anggota',
    }));
  }
};

const GetAllExcel = async (req, res, next, token) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    
    const url = await getUrlExcel();
    const response = await axios.get(`${url}?${token}`);
    let anggotaList = response.data.data;

    // Filter data berdasarkan pencarian jika ada
    if (search) {
      anggotaList = anggotaList.filter((item) => 
        item.nama.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Urutkan berdasarkan "Submitted at" (terbaru ke terlama)
    anggotaList = anggotaList.sort((a, b) => 
      new Date(b["Submitted at"]) - new Date(a["Submitted at"])
    );

    // Tambahkan nomor urut berdasarkan indeks di array setelah sorting
    anggotaList = anggotaList.map((item, index) => ({
      ...item,
      no: index + 1, // Nomor urut mulai dari 1
    }));

    const totalEntries = anggotaList.length;
    const totalPages = Math.ceil(totalEntries / pageLimit);
    const startIndex = (pageNumber - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    const paginatedData = anggotaList.slice(startIndex, endIndex);

    res.status(StatusCodes.OK).json({
      data: new DataTable(paginatedData, totalEntries).data,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        start: startIndex + 1,
        end: Math.min(endIndex, totalEntries),
        totalEntries,
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new BaseResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Terjadi kesalahan saat mengambil data anggota',
    }));
  }
};

module.exports = {
  GetExcelById,
  GetAllExcel
};
