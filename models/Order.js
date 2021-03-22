const db = require('../db/db');
const Product = require('./Product');
const OrderItem = require('./OrderItem');

class Order {
  static findById(id) {
    // return db.query(
    //   'SELECT * FROM orders o1 JOIN order_items o2 ON o1.id = o2.order_id WHERE o1.id = ?',
    //   [id]
    // );
    const sql = `SELECT o1.date AS transactionDate, p.name, o2.amount, o2.price 
    FROM orders o1 JOIN order_items o2 ON o1.id = o2.order_id JOIN products p on o2.product_id = p.id 
    WHERE o1.id = ?`;
    return db.pool
      .execute({ sql: sql, values: [id] })
      .then(([result]) => result);
  }

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

  static getTotalSale() {
    return db.query(
      'SELECT SUM(amount) AS totalAmount, SUM(amount * price * (1 - discount)) AS totalSale FROM order_items'
    );
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
