const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

exports.getTotalSale = async (req, res, next) => {
  const result = await Order.getTotalSale();
  res.status(200).json(result[0]);
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customerId, employeeId, items } = req.body;
    if (!customerId)
      return res.status(400).json({ message: 'customer id is required' });
    if (!Array.isArray(items) || !items.length)
      return res
        .status(400)
        .json({ message: 'items must be an array and have at least 1 record' });
    for (let item of items) {
      if (!item.productId)
        return res.status(400).json({ message: 'product id is required' });
      if (item.amount === undefined)
        return res.status(400).json({ message: 'amount is required' });
      if (!(+item.amount > 0))
        return res
          .status(400)
          .json({ message: 'amount must be numeric and greater than zero' });
      if (item.discount && !(+item.discount > 0))
        return res
          .status(400)
          .json({ message: 'discount must be numeric and greater than zero' });
      if (item.discount && +item.discount > 1)
        return res
          .status(400)
          .json({ message: 'discount must be less than 1' });
    }

    const order = await Order.completeOrder(
      {
        customerId,
        employeeId: employeeId ? employeeId : null
      },
      items
    );

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};
