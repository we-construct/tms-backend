const router = require('express').Router();
const db = require('../Helpers/connectDb');
const { vacationMailOptions, transport } = require('../Helpers/mailOptions');
const authenticateUser = require('../Middlewares/authenticateUser');
require('dotenv').config();

router.post('/', authenticateUser, async (req, res) => {
  try {
    const { userId, startDate, returnDate, daysNumber, description, firstName, lastName } = await req.body;

    const {first_name, last_name} = await db.one(
      `select first_name, last_name from users where id = ${userId}`
    );
    console.log(first_name, last_name)
    const adminsEmails = await db.query(
      `select email from users where role_id = 1`
    );
    const emails = adminsEmails.map((email) => {
      return email.email;
    });

    transport.sendMail(vacationMailOptions(emails,first_name, last_name), async (emailErr) => {
      if (emailErr) {
        res.json('Something wrong, try again');
      } else {
        await db.query(
          `insert into vacations (start_date, return_date, days_number, status, description, user_id, first_name, last_name) values($1, $2, $3, $4, $5, $6, $7, $8)`,
          [ startDate, returnDate, daysNumber, 'Pending', description, userId, firstName, lastName]
        );
        res.json({ success: 'Vacation added' });
      }
    });
  } catch (error) {
    res.json(error.message);
  }
});
router.post('/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const pageNumber = req.body.page || 1;
    const pageLimit = 5;
    const startIndex = (pageNumber - 1) * pageLimit;
    const count = await db.query(
      'select count(*) from vacations where user_id = $1',
      [userId]
    );
    const totalPages = count[0].count;
    const pagesCount = Math.ceil(totalPages / pageLimit);

    const vacations = await db.query(
      `select * from vacations where user_id = $1 order by id desc
    limit ${pageLimit} offset ${startIndex}`,
      [userId]
    );
    const data = vacations.map((item) => {
      return {
        id: item.id,
        startDate: item.start_date,
        returnDate: item.return_date,
        daysNumber: item.days_number,
        status: item.status,
        description: item.description,
      };
    });
    const { vacation_available_days } = await db.one(
      `select vacation_available_days from users WHERE id = ${userId}`
    );
    const availableDays = vacation_available_days;
    res.json({ data, pagesCount, availableDays });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
