const router = require("express").Router();
const db = require("../Helpers/connectDb");
const { mailOptions, transport } = require("../Helpers/mailOptions");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async (req, res, next) => {
  const {
    email,
    role_id,
    status_id,
    position_id,
    created_by_id,
  } = await req.body;
  // token will expire after one day
  const token_expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  const position_name = await db.one(
    `select name from positions where id = ${position_id}`
  );
  const role_name = await db.one(
    `select name from roles where id = ${role_id}`
  );
  // using token to encrypt user data
  const token = jwt.sign(
    { email, role_id, status_id, position_id, created_by_id, token_expiry },
    process.env.JWT_SECRET
  );

  //  sending email
  transport.sendMail(
    mailOptions(req.body.email, token, position_name.name, role_name.name),
    (email_err) => {
      if (email_err) {
        res.json(email_err);
      } else {
        res.json({ message: "New team member invited" });
      }
    }
  );
});

module.exports = router;
