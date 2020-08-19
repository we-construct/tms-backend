const express = require("express");
const cors = require("cors");
const pgp = require("pg-promise")(/*options*/);
require("dotenv").config();

const { PG_USER, PG_HOST, PG_PASSWORD, PG_PORT, PG_DB } = process.env;
const port = process.env.PORT || 5000;

// connecting db
const db = pgp(
  `${PG_USER}://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}`
);

// initializing express
const app = express();

app.use(cors());
app.use(express.json());

db.query("select * from statuses")
  .then(function (data) {
    console.log("DATA:", data);
  })
  .catch(function (error) {
    console.log("ERROR:", error);
  });

app.listen(port, () => {
  console.log("Server run on port " + port);
});
