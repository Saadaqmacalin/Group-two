const Customer = require('../models/customers');
const User = require('../models/user');


const createCustomer = async (req, res) => {
  const { name, email, phoneNumber, address, city } = req.body;

  try {
    // Check if customer exists by email OR phone
    let customer = await Customer.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });

    if (customer) {
      // Update existing customer info if provided
      customer.name = name || customer.name;
      customer.address = address || customer.address;
      customer.city = city || customer.city;
      await customer.save();
      return res.status(200).json(customer);
    }

    // Create new customer if doesn't exist
    customer = await Customer.create({
      name,
      email,
      phoneNumber,
      address,
      city
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getCustomers = async (req, res) => {
  try {
    // 1. Get all checkout-only customers
    const guestCustomers = await Customer.find({});
    
    // 2. Get all registered users with 'customer' role
    const registeredCustomers = await User.find({ role: 'customer' });

    // 3. Merge and deduplicate by email
    const allCustomersMap = new Map();

    // Add registered users first (they usually have more info like phone)
    registeredCustomers.forEach(u => {
      allCustomersMap.set(u.email.toLowerCase(), {
        _id: u._id,
        name: u.name,
        email: u.email,
        phoneNumber: u.phoneNumber,
        city: 'N/A', // Users don't have city/address in their model yet
        address: 'Registered User',
        type: 'Registered'
      });
    });

    // Add checkout guests (or update existing if they checked out)
    guestCustomers.forEach(c => {
      const email = c.email.toLowerCase();
      if (allCustomersMap.has(email)) {
        // Update with shipping info if available
        const existing = allCustomersMap.get(email);
        allCustomersMap.set(email, {
          ...existing,
          city: c.city || existing.city,
          address: c.address || existing.address,
        });
      } else {
        allCustomersMap.set(email, {
          _id: c._id,
          name: c.name,
          email: c.email,
          phoneNumber: c.phoneNumber,
          city: c.city,
          address: c.address,
          type: 'Guest'
        });
      }
    });

    const customers = Array.from(allCustomersMap.values());
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.name = req.body.name || customer.name;
      customer.email = req.body.email || customer.email;
      customer.phoneNumber = req.body.phoneNumber || customer.phoneNumber;
      customer.address = req.body.address || customer.address;
      customer.city = req.body.city || customer.city;

      const updatedCustomer = await customer.save();
      res.json(updatedCustomer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      await Customer.findByIdAndDelete(req.params.id);
      res.json({ message: 'Customer removed' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
