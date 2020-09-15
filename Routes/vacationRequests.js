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
    const {user_id} = await db.one(`select user_id from vacations WHERE id = ${id}`)
    const {days_number} = await db.one(`select days_number from vacations WHERE id = ${id}`);
    const {vacation_available_days} = await db.one(`select vacation_available_days from users WHERE id = ${user_id}`);
    const daysLeft = vacation_available_days - days_number
    if(daysLeft < 0){
      return res.json(`You don't have enough vacation days`);
    }
    await db.query(`UPDATE users SET vacation_available_days = ${daysLeft} WHERE id = ${user_id}`);
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
