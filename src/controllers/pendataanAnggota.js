const { StatusCodes } = require('http-status-codes');
const axios = require('axios');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const { getUrlExcel } = require('../utils/excel');

const GetPendataanAnggotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await getUrlExcel();
    const response = await axios.get(`${url}/WFf2z4y8YIrf-YfNHgiVJ`);
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

const GetAllPendataanAnggota = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    
    const url = await getUrlExcel();
    const response = await axios.get(`${url}/WFf2z4y8YIrf-YfNHgiVJ`);
    let anggotaList = response.data;

    // Filter data berdasarkan pencarian jika ada
    if (search) {
      anggotaList = anggotaList.filter((item) => 
        item.nama.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Tambahkan nomor urut berdasarkan indeks di array
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
  GetPendataanAnggotaById,
  GetAllPendataanAnggota
};
