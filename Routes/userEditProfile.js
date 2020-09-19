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

router.route("/add-education").post(async (req, res) => {
  try {
    const { id, name, faculty, grade, from, to } = req.body;
    if (name === '' || faculty === '' || grade === '') return res.json('Enter all fields!');
    await db.query(`
      insert into education (user_id, name, faculty, grade, from_date, to_date) values (${id}, '${name}', '${faculty}', '${grade}', '${from}', '${to}')
      `);
    res.json({message: 'Education added'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/add-experience").post(async (req, res) => {
  try {
    const { id, name, company, jobtime, from, to } = req.body;
    if (name === '' || company === '' || jobtime === '') return res.json('Enter all fields!');
    await db.query(`
      insert into experience (user_id, name, company, jobtime, from_date, to_date) values (${id}, '${name}', '${company}', '${jobtime}', '${from}', '${to}')
      `);
    res.json({message: 'Experience added'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/add-hardskill").post(async (req, res) => {
  try {
    const { id, name } = req.body;
    if (name === '') return res.json('Enter all fields!');
    await db.query(`
      insert into hard_skills (user_id, name) values (${id}, '${name}')
      `);
    res.json({message: 'HardSkill added'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/add-softskill").post(async (req, res) => {
  try {
    const { id, name } = req.body;
    if (name === '') return res.json('Enter all fields!');
    await db.query(`
      insert into soft_skills (user_id, name) values (${id}, '${name}')
      `);
    res.json({message: 'SoftSkill added'});
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
