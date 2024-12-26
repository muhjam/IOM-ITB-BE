const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateDonation = require('../services/donations/createDonations');
const GetDonation = require('../services/donations/getDonations');
const UpdateDonation = require('../services/donations/updateDonations');
const DeleteDonation = require('../services/donations/deleteDonations');

const GetDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await GetDonation(id);

    if (!donation) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Donation tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Donation ditemukan',
      data: donation,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil Donation',
    }));
  }
};

const GetDonationByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const donation = await GetDonation({ email });

    if (!donation) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Donation tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Donation ditemukan',
      data: donation,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil Donation',
    }));
  }
};

const GetAllDonations = async (req, res) => {
  try {
    const { search } = req.query;

    const donations = await GetDonation(null, search);

    res.status(StatusCodes.OK).json(new DataTable(donations.data, donations.total));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const CreateNewDonation = async (req, res) => {
  try {
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const newDonation = await CreateDonation(body, files, baseUrl);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Donation created successfully',
      data: newDonation,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create Donation',
    }));
  }
};

const UpdateDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const updatedDonation = await UpdateDonation(id, body, files, baseUrl);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Donation berhasil diperbarui',
      data: updatedDonation,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const DeleteDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteDonation(id);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: result.message,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

module.exports = {
  GetDonationById,
  GetDonationByEmail,
  GetAllDonations,
  CreateNewDonation,
  UpdateDonationById,
  DeleteDonationById,
};