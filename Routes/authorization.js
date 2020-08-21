const bcrypt = require("bcryptjs");
const router = require("express").Router();
const db = require("../Helpers/connectDb");
require("dotenv").config();

router.route("/").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.json("Enter all fields");

    const user = await db.one(`select * from users where email = '${email}'`);
    if (!user) return res.json("User is not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json("Invalid login data");
    if (user.status_id === 3) return res.json("This account is disabled :(");

    // if everything is ok
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
    });
  } catch (error) {
    res.json("User is not found or wrong data");
  }
});

module.exports = router;
