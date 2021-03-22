const db = require('../db/db');
const { columns } = require('./Customer');

class Model {
  static findAll() {
    return db.query(`SELECT * FROM ${this.tableName}`);
  }

  static create(resource) {
    let sql = '(';
    let sql2 = '(';
    let values = [];
    for (let column of this.columns) {
      sql += `${column},`;
      sql2 += '?,';
      values.push(resource[column]);
    }
    sql = sql.slice(0, -1) + ')';
    sql2 = sql2.slice(0, -1) + ')';
    return db
      .query(`INSERT INTO ${this.tableName} ${sql} VALUES ${sql2}`, values)
      .then(result => {
        if (result.affectedRows) return { id: result.insertId, ...resource };
        throw new Error(
          `cannot create ${this.tableName}: affected rows is zero`
        );
      });
  }
}

module.exports = Model;
