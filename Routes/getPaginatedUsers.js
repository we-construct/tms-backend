const router = require("express").Router();
const db = require("../Helpers/connectDb");
const authenticateAdmin = require("../Middlewares/authenticateAdmin");

router.route("/").post(authenticateAdmin, async (req, res) => {
  try {
    const pageNumber = req.body.page;
    const pageLimit = 5;
    const startIndex = (pageNumber - 1) * pageLimit;
    const count = await db.query("select count(*) from users");
    const totalPages = count[0].count;
    const pages = Math.ceil(totalPages / pageLimit);
    
    const users = await db.query(
        `
        SELECT u.id, u.first_name, u.last_name, u.last_name, u.phone_number, u.email, u.created_at, u.created_by_id, u.token, r.name as role, r.id as roleId, s.name as status, s.id as statusId, p.name as position, p.id as positionId, u.education
        FROM users u, roles r, statuses s, positions p
        WHERE u.role_id = r.id and u.status_id = s.id and u.position_id = p.id
        order by id
        limit ${pageLimit}
        offset ${startIndex}
        `
    );
    res.json({ users, pages });
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;
