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
router.route("/update-user").post(authenticateAdmin, async (req, res) => {
  console.log(req.body);
  try {
      await db.query(`update users set first_name = '${req.body.firstName}', last_name = '${req.body.lastName}', email = '${req.body.email}', phone_number = '${req.body.phoneNumber}', position_id = '${req.body.positionId}', role_id = '${req.body.roleId}', status_id = '${req.body.statusId}', updated_at = to_timestamp(${Date.now()} / 1000.0) where id = ${req.body.id}`);
      res.json({ message: "User data updated" });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
