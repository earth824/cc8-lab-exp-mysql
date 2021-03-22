const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json({ customers });
  } catch (err) {
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    res.status(200).json({ customer });
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ message: 'name is required' });
    if (!address || !address.trim())
      return res.status(400).json({ message: 'address is required' });

    const customer = await Customer.create({ name, address });
    res.status(201).json({ customer });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ message: 'name is required' });
    if (!address || !address.trim())
      return res.status(400).json({ message: 'address is required' });

    const customer = await Customer.updateById(id, { name, address });
    res.status(200).json({ customer });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Customer.deleteById(id);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
