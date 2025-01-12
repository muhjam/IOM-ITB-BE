const { Donations } = require('../../models');
const { Op } = require('sequelize');

// Add an id parameter for specific donation retrieval
const GetDonations = async ({id = null, query = {}, search = '', isAdmin = false}) => {
  // If id is provided, return the donation based on the id
  if (id) {
    try {
      const donation = await Donations.findByPk(id); // Find by primary key (id)
      if (!donation) {
        throw new Error(`Donation with id ${id} not found`);
      }

      // Check if the name should be hidden
      if (donation.option?.nameIsHidden && !isAdmin) {
        donation.name = '*'.repeat(donation.name.length); // Replace name with asterisks
      }

      return donation; // Return donation details
    } catch (error) {
      throw new Error(`Failed to retrieve donation data: ${error.message}`);
    }
  }

  // Logic for retrieving all donations
  const page = query.page || 1;  // Get page number from query params (default is 1)
  const limit = query.limit || 10;  // Get limit from query params (default is 10)
  const offset = (page - 1) * limit;  // Calculate offset based on page and limit
  
  const options = {
    where: {},
    limit,
    offset,
    order: [['createdAt', 'DESC']],  // Sort by creation date in descending order
  };

  // If there's a search term, use it to filter by donor's name
  if (search) {
    options.where.name = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await Donations.findAndCountAll(options);

    // Replace names with asterisks for donations where nameIsHidden is true
    const processedRows = isAdmin ? rows : rows.map(donation => {
      if (donation.option?.nameIsHidden) {
        return {
          ...donation.toJSON(),
          name: '*'.repeat(donation.name.length), // Replace name with asterisks
        };
      }
      return donation.toJSON();
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
