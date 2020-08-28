const router = require("express").Router();
const db = require("../Helpers/connectDb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.route("/").post(async (req, res) => {
    try {
      const loginToken = req.headers.authorization;
      const data = jwt.verify(loginToken, process.env.JWT_SECRET);
      if (data === null) return res.json('Token error');
      const { id, email } = data;
      console.log(email);
      // if everything is ok
      const user = await db.one(`select * from users where email = '${email}' and id = ${id}`);
      const accessToken = jwt.sign({ id: user.id, role: user.role_id, status: user.status_id, email: user.email }, process.env.JWT_SECRET);
      const tokenExpiry = new Date(new Date() + 24 * 60 * 60 * 1000);
      // set token to db
      db.query(`update users set token = '${accessToken}' where id = ${user.id}`);
      res.json({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        email: user.email,
        roleId: user.role_id,
        statusId: user.status_id,
        positionId: user.position_id,
        createdAt: user.created_at,
        accessToken,
        tokenExpiry,
      });
    } catch (error) {
      res.json(error.message);
    }
  });
  
  module.exports = router;
  