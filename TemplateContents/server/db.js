// const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: $dbpassword,
  host: "localhost",
  port: "5432",
  database: $dbname,
});

module.exports = pool;

const Pool = require("pg").Pool;
