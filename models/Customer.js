const db = require('../db/db');

class Customer {
  static findAll() {
    return db.query('SELECT * FROM customers');
  }

  static findById(id) {
    return db
      .query('SELECT * FROM customers WHERE id = ?', [id])
      .then(result => (result.length ? result[0] : null));
  }

  static create(customer) {
    return db
      .query('INSERT INTO customers (name, address) VALUES (?, ?)', [
        customer.name,
        customer.address
      ])
      .then(result => {
        if (result.affectedRows) return { id: result.insertId, ...customer };
        throw new Error('cannot create customer: affected rows is zero');
      });
  }

  static updateById(id, customer) {
    return db
      .query('UPDATE customers SET name = ?, address = ? WHERE id = ?', [
        customer.name,
        customer.address,
        id
      ])
      .then(result => {
        if (result.affectedRows) return { id, ...customer };
        throw new Error('cannot find customer id');
      });
  }

  static deleteById(id) {
    return db.query('DELETE FROM customers WHERE id = ?', [id]).then(result => {
      if (result.affectedRows) return result.affectedRows;
      throw new Error('cannot find customer id');
    });
  }
}

module.exports = Customer;
