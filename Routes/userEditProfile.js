const router = require("express").Router();
const authenticateUser = require("../Middlewares/authenticateUser");
const db = require("../Helpers/connectDb");

router.route("/").post(authenticateUser, async (req, res) => {
  try {
      await db.query(`update users set first_name = '${req.body.firstName}', last_name = '${req.body.lastName}', email = '${req.body.email}', phone_number = '${req.body.phoneNumber}', updated_at = to_timestamp(${Date.now()} / 1000.0) where id = ${req.body.id}`);
      res.json({ message: "User data updated" });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;