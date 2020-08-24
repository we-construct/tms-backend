const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../Helpers/connectDb");
require("dotenv").config();

router.route("/").post(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      password,
      confirmPassword,
      token,
    } = req.body;
    if (token.length === 0) return res.json("Token not found");
    // decoding data in token
    const decodedData = jwt.decode(token, process.env.JWT_SECRET);
    const {
      email,
      roleId,
      statusId,
      positionId,
      createdById,
      tokenExpiry,
    } = decodedData;
    if (decodedData === null) return res.json("Token error");
    // crypting password
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);

    // checking if token is expired?
    if (new Date(tokenExpiry) < new Date()) return res.json("Link is expired");
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    )
      return res.json("Enter all fields");
    if (password.length < 6)
      return res.json("Password must be > 6 characters");
    if (password !== confirmPassword)
      return res.json("Passwords not match");
    if (phoneNumber.length !== 12)
      return res.json("Wrong phone number");

    // email, roles, positions, status, createdById will be taken from the invitation token
    await db.query(
      `insert into users 
      (first_name, last_name, password, phone_number, email, role_id, status_id, position_id, created_by_id, created_at) 
      values 
      ('${firstName}', '${lastName}', '${passwordHash}', '${phoneNumber}', '${email}', ${roleId}, ${statusId}, ${positionId}, ${createdById}, to_timestamp(${Date.now()} / 1000.0))
      `
    );

    // firstName, thank you for accepting invitation, pending: false
    res.json({ isAccepted: true, firstName });
  } catch (error) {
    res.json("Something's wrong :(");
  }
});

module.exports = router;
