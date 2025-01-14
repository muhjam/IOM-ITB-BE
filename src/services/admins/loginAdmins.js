const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admins } = require('../../models'); // Pastikan path model sudah sesuai
const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../../schemas/responses/BaseResponse');

const Login = async (payload) => {
    const { email, password } = payload;
  
    // Validasi input
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = StatusCodes.BAD_REQUEST;
      throw error;
    }
  
    // Cari admin berdasarkan email
    const admin = await Admins.findOne({ where: { email, approved: true } });
    if (!admin) {
      const error = new Error('Invalid email or password');
      error.status = StatusCodes.UNAUTHORIZED;
      throw error;
    }
  
    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.status = StatusCodes.UNAUTHORIZED;
      throw error;
    }
  
    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.SECRET_KEYS, // Ganti dengan secret key dari .env
      { expiresIn: '1h' } // Token berlaku selama 1 jam
    );
  
    return token; // Kembalikan token ke controller
  };

  module.exports = Login;