const bcrypt = require("bcryptjs");
const router = require("express").Router();
const db = require("../Helpers/connectDb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.route("/").post(async (req, res) => {
  try {
    const { email, password } = await req.body;
    if (!email || !password) return res.json("Enter all fields");

    const user = await db.one(`select * from users where email = '${email}'`);
    const role = await db.one(`select name from roles where id = '${user.role_id}'`);
    const position = await db.one(`select name from positions where id = '${user.position_id}'`);
    
    if (!user) return res.json("User is not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json("Invalid login data");
    if (user.status_id === 3) return res.json("This account is disabled :(");

    // if everything is ok
    const accessToken = jwt.sign({ id: user.id, role: user.role_id, status: user.status_id, email: user.email }, process.env.JWT_SECRET);
    const tokenExpiry = new Date(new Date() + 24 * 60 * 60 * 1000);
    // set token to db
    db.query(`update users set token = '${accessToken}' where id = ${user.id}`);
    res.json({
      id: user.id,
      accessToken,
      tokenExpiry,
      role: role.name,
      position: position.name,
      isAuth: true,
    });
  } catch (error) {
    res.json("User is not found or wrong data");
  }
});

module.exports = router;
