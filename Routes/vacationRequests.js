const router = require("express").Router();
const db = require("../Helpers/connectDb");
const authenticateAdmin = require("../Middlewares/authenticateAdmin");
require("dotenv").config();

// get requested vacations
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const vacations = await db.query(`select * from vacations where status = 'Pending'`);
    const data = vacations.map(item=>{
      return{
        id: item.id,
        userId: item.user_id,
        startDate: item.start_date,
        returnDate: item.return_date,
        daysNumber: item.days_number,
        status: item.status,
        description: item.description,
        firstName: item.first_name,
        lastName: item.last_name,
      }
    })
  res.json(data);
  } catch (error) {
    res.json(error.message);
  }
});

// approve vacation
router.put("/approve/:id", authenticateAdmin, async (req, res) => {
  try {
    const {id} = req.params
    await db.query(`UPDATE vacations SET status = 'Approved' WHERE id = ${id}`);
    res.json({success: 'Vacation approved'});
  } catch (error) {
    res.json(error.message);
  }
});
// reject vacation
router.put("/reject/:id", authenticateAdmin, async (req, res) => {
  try {
    const {id} = req.params
    await db.query(`UPDATE vacations SET status = 'Rejected' WHERE id = ${id}`);
    res.json({success: 'Vacation rejected'});
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
