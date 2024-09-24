'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Merchandise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define any associations if needed in the future
    }

    static async getMerchandiseByKeyword(keyword) {
      return this.findAll({
        where: {
          name: { [Op.like]: `%${keyword}%` }
        }
      });
    }
  }
  
  Merchandise.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Merchandise',
    tableName: 'Merchandise',
  });

  return Merchandise;
};
