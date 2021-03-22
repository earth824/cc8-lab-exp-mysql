const db = require('../db/db');
const Product = require('./Product');
const OrderItem = require('./OrderItem');

class Order {
  static create(order) {
    return db
      .query(
        'INSERT INTO orders (customer_id, employee_id, date) VALUES (?, ?, ?)',
        [order.customerId, order.employeeId, new Date()]
      )
      .then(result => {
        if (result.affectedRows)
          return { id: result.insertId, ...order, date: new Date() };
        throw new Error('cannot create order: affected rows is zero');
      });
  }

  static async completeOrder(order, orderItems) {
    let connection = null;
    try {
      connection = await db.pool.getConnection();
      await connection.beginTransaction();
      const newOrder = await this.create(order);

      for (let item of orderItems) {
        const product = await Product.findById(item.productId);
        await OrderItem.create({
          orderId: newOrder.id,
          amount: item.amount,
          price: product.price,
          discount: item.discount ? item.discount : 0,
          productId: item.productId
        });
      }
      await connection.commit();
      return newOrder;
    } catch (err) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  }
}

module.exports = Order;
