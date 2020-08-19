const bcrypt = require("bcryptjs");
const router = require("express").Router();
const pgp = require("pg-promise")(/*options*/);
const db = require('../Helpers/connectDb');
require("dotenv").config();

router.route("/").post(async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password)
        return res.json("Enter all fields");

    const user = await db.one(`select * from users where email = '${email}'`);
    if(!user) return res.json({error: 'User is not found'});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.json({error: 'Invalid login data'});
    if(user.status_id === 3) return res.json({error: 'This account is disabled :('});

    // if everything is ok
    res.json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        email: user.email,
        role_id: user.role_id,
        status_id: user.status_id,
        position_id: user.position_id,
        created_at: user.created_at,
    });

  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
