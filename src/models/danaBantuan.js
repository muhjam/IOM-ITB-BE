'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DanaBantuan extends Model {
    static associate(models) {
      // Correct the alias here to 'penerima' matching the one used in include
      DanaBantuan.belongsTo(models.Penerima, { foreignKey: 'id_penerima', as: 'penerima' });
    }
  }

  DanaBantuan.init({
    id_dana: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_penerima: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis_bantuan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bulan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jumlah_donasi: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DanaBantuan',
    tableName: 'DanaBantuan',
    timestamps: false
  });

  return DanaBantuan;
};
