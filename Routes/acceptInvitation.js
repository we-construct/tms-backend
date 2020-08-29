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
    // token checking

    // decoding data in token
    const decodedData = jwt.decode(token, process.env.JWT_SECRET);
    const {
      email,
      roleId,
      statusId,
      positionId,
      createdById,
    } = decodedData;
    if (decodedData === null) return res.json("Token error");

    // check if this user invited or already registrated
    const isTokenMatch = await db.one(`select id, token from invitations where email = '${email}'`);
    if (isTokenMatch.token !== token) return res.json("Token not found/Already registrated");
    
    // crypting password
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);

    // check fields
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
    await db.query(`update invitations set token = 'accepted', status = 'Accepted' where id = '${isTokenMatch.id}'`)
    // firstName, thank you for accepting invitation, pending: false
    res.json({ isAccepted: true, firstName });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
