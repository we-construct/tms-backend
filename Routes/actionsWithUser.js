const router = require("express").Router();
const authenticateAdmin = require("../Middlewares/authenticateAdmin");
const db = require("../Helpers/connectDb");

router.route("/delete").post(authenticateAdmin, async (req, res) => {
  try {
    await db.query(`delete from users where id = ${req.body.id}`);
    res.json({ message: "User deleted!" });
  } catch (error) {
    res.json("Something goes wrong :(");
  }
});

router.route("/set-status").post(authenticateAdmin, async (req, res) => {
  try {
    if (req.body.statusId == 1 || req.body.statusId == 2) {
      await db.query(`update users set status_id = 3, updated_at = to_timestamp(${Date.now()} / 1000.0) where id = ${req.body.id}`);
      res.json({ message: "User deactivated" });
    } else {
        await db.query(`update users set status_id = 1, updated_at = to_timestamp(${Date.now()} / 1000.0) where id = ${req.body.id}`);
        res.json({ message: "User activated" });
    }
  } catch (error) {
    res.json("Something goes wrong :(");
  }
});

module.exports = router;
