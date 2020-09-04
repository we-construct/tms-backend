const router = require("express").Router();
const authenticateAdmin = require("../Middlewares/authenticateAdmin");
const db = require("../Helpers/connectDb");

router.route("/:id").post(authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.one(`select * from users where id = '${id}'`);
    const role = await db.one(
      `select name from roles where id = '${user.role_id}'`
    );
    const position = await db.one(
      `select name from positions where id = '${user.position_id}'`
    );
    const status = await db.one(
      `select name from statuses where id = '${user.status_id}'`
    );
    
    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      email: user.email,
      roleId: user.role_id,
      role: role.name,
      statusId: user.status_id,
      status: status.name,
      positionId: user.position_id,
      position: position.name,
      createdAt: user.created_at,
      // experience, skills, education...
    });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
