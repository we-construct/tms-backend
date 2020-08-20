const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const db = require('../Helpers/connectDb');
require("dotenv").config();

router.route("/").post(async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      password,
      confirm_password,
      token
    } = req.body;

    if(token.length === 0) return res.json({ error: 'Token not found' })
    // decoding data in token
    const decoded_data = jwt.decode(token, process.env.JWT_SECRET);
    const { email, role_id, status_id, position_id, created_by_id, token_expiry } = decoded_data;
    if(decoded_data === null) return res.json({ error: 'Wrong token' });
    // crypting password
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // checking if token is expired?
    if(new Date(token_expiry) < new Date()) return res.json({ error: 'Link is expired' })
    if (!first_name || !last_name || !phone_number || !password || !confirm_password)
      return res.json({ error: "Enter all fields" });
    if (password.length < 6)
    return res.json({ error: "Password must be > 6 characters" });
    if (password !== confirm_password)
    return res.json({ error: "Passwords not match" });
    if (phone_number.length !== 12)
    return res.json({ error: "Wrong phone number" });

    // email, roles, positions, status, created_by will be taken from the invitation token or smth else
    // i don't know a better method yet than making queries like this :(
    await db.query(
      `insert into users 
      (first_name, last_name, password, phone_number, email, role_id, status_id, position_id, created_by_id, created_at) 
      values 
      ('${first_name}', '${last_name}', '${passwordHash}', '${phone_number}', '${email}', ${role_id}, ${status_id}, ${position_id}, ${created_by_id}, to_timestamp(${Date.now()} / 1000.0))
      `
    );

    res.json({ isAccepted: true, first_name });
  } catch (error) {
    res.json("Something's wrong :(");
  }
});

module.exports = router;
