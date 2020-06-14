const pg = require('pg');

const db = new pg.Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
// eslint-disable-next-line no-console
console.log(`trying to connect DB: ${process.env.DB_HOSTNAME}`);

db.connect(err => {
  // eslint-disable-next-line no-console
  console.log('connecting');
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    // eslint-disable-next-line no-console
    console.log('DB connection is successful');
  }
});
module.exports = db;
