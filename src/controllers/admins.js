const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const BaseResponse = require('../schemas/responses/BaseResponse');
const CreateAdmin = require('../services/admins/createAdmins');
const Login = require('../services/admins/loginAdmins');

const CreateNewAdmin = async (req, res) => {
  try {
    const { body } = req;

    await CreateAdmin(body);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Admin created successfully',
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create Member',
    }));
  }
};

const LoginAdmin = async (req, res) => {
    try {
      const { body } = req;
  
      // Panggil service Login dan dapatkan token
      const token = await Login(body);
  
      // Jika berhasil, kirimkan respons sukses
      res.status(StatusCodes.OK).json(
        new BaseResponse({
          status: StatusCodes.OK,
          message: 'Login successful',
          data: { token },
        })
      );
    } catch (error) {
      const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      res.status(status).json(
        new BaseResponse({
          status,
          message: error.message || 'Failed to login',
        })
      );
    }
  };

const GetDataAdmin = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  try {
    // Ambil JWT dari header authorization (biasanya dalam format "Bearer <token>")
    const token = authorization.split(' ')[1]; // Mengambil token setelah "Bearer"
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing from authorization header",
      });
    }

    // Verifikasi JWT dan ambil payload-nya
    const decoded = jwt.verify(token, process.env.SECRET_KEYS); // Gunakan secret key Anda di sini
    
    // Ambil email dari decoded token
    const email = decoded.email;

    // Mengembalikan data pengguna (email)
    res.status(200).json({
      success: StatusCodes.OK,
      message: "JWT validated successfully",
      data: {
        email: email, // Mengirim email dalam data
      },
    });
  } catch (error) {
    // Jika terjadi error pada verifikasi JWT atau lainnya
    res.status(401).json({
      success: error.status,
      message: "Invalid JWT token",
      error: error.message,
    });
  }
  };
  

module.exports = {
  CreateNewAdmin,
  LoginAdmin,
  GetDataAdmin
};
