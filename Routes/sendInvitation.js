const router = require("express").Router();
const db = require("../Helpers/connectDb");
const { mailOptions, transport } = require("../Helpers/mailOptions");
const jwt = require("jsonwebtoken");
const authenticateAdmin = require("../Middlewares/authenticateAdmin");
require("dotenv").config();

router.post("/", authenticateAdmin, async (req, res) => {
  // if ok
  const { email, roleId, statusId, positionId, createdById } = await req.body;
  // token will expire after one day
  const tokenExpiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  const position = await db.one(
    `select name from positions where id = ${positionId}`
  );
  const role = await db.one(`select name from roles where id = ${roleId}`);
  // using token to encrypt user data
  const token = jwt.sign(
    { email, roleId, statusId, positionId, createdById, tokenExpiry },
    process.env.JWT_SECRET
  );

  //  sending email
  transport.sendMail(
    mailOptions(email, token, position.name, role.name),
    (emailErr) => {
      if (emailErr) {
        res.json(emailErr);
      } else {
        res.json("New team member invited");
      }
    }
  );
});

module.exports = router;
