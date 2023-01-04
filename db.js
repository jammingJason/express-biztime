/** Database setup for BizTime. */

const { Client } = require('pg');

let dbName;

// If we're running in test "mode", use our test db
// Make sure to create both databases!
if (process.env.NODE_ENV === 'test') {
  dbName = 'biztime_test';
} else {
  dbName = 'biztime';
}

const db = new Client({
  user: 'mysuper',
  password: '1234',
  database: dbName,
  host: 'localhost',
  port: 5432,
});

db.connect();

module.exports = db;
