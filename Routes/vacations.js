const router = require("express").Router();
const db = require("../Helpers/connectDb");
const authenticateUser = require("../Middlewares/authenticateUser");
require("dotenv").config();

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { userId, startDate, returnDate, daysNumber, description } = await req.body;
    await db.query(
    `insert into vacations (start_date, return_date, days_number, status, description, user_id) values($1, $2, $3, $4, $5, $6)`,
    [startDate, returnDate, daysNumber, 'Pending', description, userId]
  );
  res.json({ success: 'Vacation added' });
  } catch (error) {
    res.json(error.message);
  }
});
router.post("/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const pageNumber = req.body.page || 1;
    const pageLimit = 5;
    const startIndex = (pageNumber - 1) * pageLimit;
    const count = await db.query("select count(*) from vacations where user_id = $1",[userId]);
    const totalPages = count[0].count;
    const pagesCount = Math.ceil(totalPages / pageLimit);

    const vacations = await db.query(`select * from vacations where user_id = $1 order by id desc
    limit ${pageLimit} offset ${startIndex}`,[userId]);
    const data = vacations.map(item=>{
      return{
        id: item.id,
        startDate: item.start_date,
        returnDate: item.return_date,
        daysNumber: item.days_number,
        status: item.status,
        description: item.description,
      }
    })
    res.json({data, pagesCount});
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
