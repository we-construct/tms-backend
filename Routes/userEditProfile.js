const router = require("express").Router();
const authenticateUser = require("../Middlewares/authenticateUser");
const db = require("../Helpers/connectDb");

router.route("/").post(authenticateUser, async (req, res) => {
  try {
      const { firstName, lastName, phoneNumber, birthday } = req.body;
      if (firstName === '' || lastName === '' || phoneNumber.length < 12) return res.json('Enter all fields!');
      
      await db.query(`update users set first_name = '${firstName}', last_name = '${lastName}', birthday = '${birthday}', phone_number = '${phoneNumber}', updated_at = to_timestamp(${Date.now()} / 1000.0) where id = ${req.body.id}`);
      res.json({ message: "User data updated" });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;