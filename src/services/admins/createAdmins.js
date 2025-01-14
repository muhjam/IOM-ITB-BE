const bcrypt = require('bcrypt');
const { Admins } = require('../../models'); // Pastikan path model sudah sesuai

const CreateAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Hash password sebelum menyimpannya
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan data admin baru ke database
  const newAdmin = await Admins.create({
    email,
    password: hashedPassword,
  });

  return newAdmin;
};

module.exports = CreateAdmin;
