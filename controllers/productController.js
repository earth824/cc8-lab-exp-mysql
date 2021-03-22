const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { sort, limit } = req.query;
    const products = await Product.findAll({
      order: sort.split(','),
      limit
    });
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ product });
  } catch (err) {}
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, desc, price, quantity, supplier_id } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ message: 'name is required' });
    if (price === undefined)
      return res.status(400).json({ message: 'price is required' });
    if (!(+price > 0))
      return res
        .status(400)
        .json({ message: 'price must be numeric and greater than zero' });
    if (quantity === undefined)
      return res.status(400).json({ message: 'quantity is required' });
    if (!(+quantity >= 0))
      return res.status(400).json({
        message: 'quantity must be numeric and equal or greater than zero'
      });
    if (!supplier_id)
      return res.status(400).json({ message: 'supplier id is required' });

    const product = await Product.create({
      name,
      price,
      quantity,
      supplier_id,
      desc: desc ? desc : null
    });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, desc, price, quantity, supplier_id } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ message: 'name is required' });
    if (price === undefined)
      return res.status(400).json({ message: 'price is required' });
    if (!(+price > 0))
      return res
        .status(400)
        .json({ message: 'price must be numeric and greater than zero' });
    if (quantity === undefined)
      return res.status(400).json({ message: 'quantity is required' });
    if (!(+quantity >= 0))
      return res.status(400).json({
        message: 'quantity must be numeric and equal or greater than zero'
      });
    if (!supplier_id)
      return res.status(400).json({ message: 'supplier id is required' });

    const product = await Product.updateById(id, {
      name,
      price,
      quantity,
      supplier_id,
      desc: desc ? desc : null
    });
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.deleteById(id);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
