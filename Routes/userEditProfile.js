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

router.route("/delete-softskill").post(async (req, res) => {
  try {
    const { id, userId } = req.body;
    if (userId === '') return res.json('Something wrong!');
    await db.query(`delete from soft_skills where id = '${id}'`);
    res.json({message: 'SoftSkill deleted'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/delete-hardskill").post(async (req, res) => {
  try {
    const { id, userId } = req.body;
    if (userId === '') return res.json('Something wrong!');
    await db.query(`delete from hard_skills where id = '${id}'`);
    res.json({message: 'HardSkill deleted'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/edit-softskill").post(async (req, res) => {
  try {
    const { id, userId, name } = req.body;
    if (userId === '') return res.json('Something wrong!');
    await db.query(`update soft_skills set name = '${name}' where id = '${id}'`);
    res.json({message: 'SoftSkill edited'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/edit-hardskill").post(async (req, res) => {
  try {
    const { id, userId, name } = req.body;
    if (userId === '') return res.json('Something wrong!');
    await db.query(`update hard_skills set name = '${name}' where id = '${id}'`);
    res.json({message: 'HardSkill edited'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/delete-education").post(async (req, res) => {
  try {
    const { id, userId } = req.body;
    if (userId === '') return res.json('Something wrong!');
    await db.query(`delete from education where id = '${id}'`);
    res.json({message: 'Education item deleted'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/edit-education").post(async (req, res) => {
  try {
    const { id, userId, name, faculty, grade, from, to } = req.body;
    console.log(req.body)
    if (userId === '') return res.json('Something wrong!');
    await db.query(`update education set name = '${name}', faculty = '${faculty}', grade = '${grade}', from_date = '${from}', to_date = '${to}'  where id = '${id}'`);
    res.json({message: 'Education item updated'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/edit-experience").post(async (req, res) => {
  try {
    const { id, userId, name, company, jobTime, from, to } = req.body;
    console.log(req.body)
    if (userId === '') return res.json('Something wrong!');
    await db.query(`update experience set name = '${name}', company = '${company}', jobtime = '${jobTime}', from_date = '${from}', to_date = '${to}'  where id = '${id}'`);
    res.json({message: 'Education item updated'});
  } catch (error) {
    res.json(error.message);
  }
});

router.route("/delete-experience").post(async (req, res) => {
  try {
    const { id, userId } = req.body;
    if (userId === '') return res.json('Something wrong!');
    await db.query(`delete from experience where id = '${id}'`);
    res.json({message: 'Experience item deleted'});
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
