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
      // if everything is ok
      const user = await db.one(`select * from users where email = '${email}' and id = ${id}`);
      const role = await db.one(`select name from roles where id = '${user.role_id}'`);
      const position = await db.one(`select name from positions where id = '${user.position_id}'`);

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
      res.json("No token set in cookies!");
    }
  });
  
  module.exports = router;
  