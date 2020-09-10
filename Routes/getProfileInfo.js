const router = require("express").Router();
const db = require("../Helpers/connectDb");
const authenticateUser = require("../Middlewares/authenticateUser");

router.route("/languages").post(authenticateUser, async (req, res) => {
  try {
      const data = await db.query(`select id, language, value from languages where user_id = ${req.body.id}`);
      res.json(data);
  } catch (error) {
    res.json(error.message);
  }
});
router.route("/experience").post(authenticateUser, async (req, res) => {
  try {
      const data = await db.query(`select id, name, company, jobtime, from_date, to_date from experience where user_id = ${req.body.id}`);
      res.json(data);
  } catch (error) {
    res.json("Something goes wrong :(");
  }
});
router.route("/education").post(authenticateUser, async (req, res) => {
  try {
      const data = await db.query(`select id, name, faculty, grade, from_date, to_date from education where user_id = ${req.body.id}`);
      res.json(data);
  } catch (error) {
    res.json(error.message);
  }
});
router.route("/hard-skills").post(authenticateUser, async (req, res) => {
  try {
      const data = await db.query(`select id, name from hard_skills where user_id = ${req.body.id}`);
      res.json(data);
  } catch (error) {
    res.json("Something goes wrong :(");
  }
});
router.route("/soft-skills").post(authenticateUser, async (req, res) => {
  try {
      const data = await db.query(`select id, name from soft_skills where user_id = ${req.body.id}`);
      res.json(data);
  } catch (error) {
    res.json("Something goes wrong :(");
  }
});

module.exports = router;
