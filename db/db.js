const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'ecommerce'
});

const query = (sql, values) => {
  return pool
    .promise()
    .execute(sql, values)
    .then(([result]) => result);
};

module.exports = {
  query,
  pool: pool.promise()
};
