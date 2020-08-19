const bcrypt = require("bcryptjs");
const router = require("express").Router();
const pgp = require("pg-promise")(/*options*/);
require("dotenv").config();

const { PG_USER, PG_HOST, PG_PASSWORD, PG_PORT, PG_DB } = process.env;
const db = pgp(
  `${PG_USER}://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}`
);

router.route("/accept-initation").post(async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      password,
      confirm_password,
    } = req.body;
    // crypting password
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);

    if (!first_name || !last_name || !phone_number || !password || !confirm_password)
      return res.json("Enter all fields");
    if (password.length < 6) 
    return res.json("Password must be > 6 characters");
    if (password !== confirm_password)
    return res.json("Passwords not match");
    if (phone_number.length !== 12) 
    return res.json("Wrong phone number");

    // email, roles, positions, status, created_by will be taken from the invitation token or smth else
    // i don't know a better method yet than making queries like this :(
    await db.query(
      `insert into users 
      (first_name, last_name, password, phone_number, email, role_id, status_id, position_id, created_by_id, created_at) 
      values 
      ('${first_name}', '${last_name}', '${passwordHash}', '${phone_number}', 'vaarsenyan@gmail.com', 1, 1, 1, 1, to_timestamp(${Date.now()} / 1000.0))
      `
    );

    res.json({ isAccepted: true });
  } catch (error) {
    res.json("Something's wrong :(");
  }
});

module.exports = router;
