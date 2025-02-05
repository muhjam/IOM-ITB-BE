'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Penerima extends Model {
    static associate(models) {
      // Ensure the alias matches what we use in the include
      Penerima.hasMany(models.DanaBantuan, { foreignKey: 'id_penerima', as: 'danaBantuan' });
    }
  }

  Penerima.init({
    id_penerima: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nim: {
      type: DataTypes.STRING,
      allowNull: false
    },
    program_studi: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Penerima',
    tableName: 'Penerima',
    timestamps: false
  });

  return Penerima;
};
