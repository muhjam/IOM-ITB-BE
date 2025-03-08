const { Donations } = require('../../models');
const { Op } = require('sequelize');

// Utility function to hide words with asterisks
const hideNamePattern = (name) => {
  return name?.split(' ')?.map(word => word ? word[0] + '*'.repeat(word.length - 1) : '')?.join(' ');
};

// Add an id parameter for specific donation retrieval
const GetDonations = async ({ id = null, query = {}, search = '', isAdmin = false }) => {
  if (id) {
    try {
      const donation = await Donations.findByPk(id);
      if (!donation) {
        throw new Error(`Donation with id ${id} not found`);
      }

      if (donation.options?.nameIsHidden && !isAdmin) {
        donation.name = hideNamePattern(donation.name);
      }

      return donation;
    } catch (error) {
      throw new Error(`Failed to retrieve donation data: ${error.message}`);
    }
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  let orderBy = [['createdAt', 'DESC']];
  
  if (!isAdmin) {
    orderBy = [['date', 'DESC']];
  } else if (query.orderBy) {
    const allowedFields = ['createdAt', 'amount', 'name', 'date'];
    const orderDirection = query.sort ?? 'DESC';
    
    if (allowedFields.includes(query.orderBy)) {
      orderBy = [[query.orderBy, orderDirection]];
    }
  }

  const options = {
    where: {},
    limit,
    offset,
    order: orderBy,
  };

  if (search) {
    options.where.name = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await Donations.findAndCountAll(options);
    const processedRows = isAdmin
    ? rows
    : rows.map(donation => {
        const { options } = donation;
        const isHidden = options?.nameIsHidden;
        const isHambaAllah = options?.isHambaAllah;
        const name = isHidden || isHambaAllah
          ? hideNamePattern(isHambaAllah ? 'Hamba Allah' : donation?.name)
          : donation?.name;
        return {
          ...donation.toJSON(),
          name: !isHidden && isHambaAllah ? 'Hamba Allah' : name,
        };
      });

    return {
      data: processedRows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve donation data: ${error.message}`);
  }
};

module.exports = GetDonations;
