const db = require('../db/db');

class OrderItem {
  static create(orderItem) {
    return db
      .query(
        'INSERT INTO order_items (order_id, amount, price, discount, product_id) VALUES (?, ?, ?, ?, ?)',
        [
          orderItem.orderId,
          orderItem.amount,
          orderItem.price,
          orderItem.discount,
          orderItem.productId
        ]
      )
      .then(result => {
        if (result.affectedRows) return { id: result.insertId, ...orderItem };
        throw new Error('cannot create order item: affected rows is zero');
      });
  }
}

module.exports = OrderItem;
