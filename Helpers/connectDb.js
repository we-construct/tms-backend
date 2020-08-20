const pgp = require("pg-promise")(/*options*/);
require("dotenv").config();

const { PG_USER, PG_HOST, PG_PASSWORD, PG_PORT, PG_DB } = process.env;
const db = pgp(
  `${PG_USER}://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}`
);

module.exports = db;
