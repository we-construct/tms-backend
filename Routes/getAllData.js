const router = require("express").Router();
const authenticateAdmin = require("../Middlewares/authenticateAdmin");
const db = require("../Helpers/connectDb");

router.route("/:data").post(authenticateAdmin, async (req, res) => {
  try {
      if(req.params.data === 'users') return res.json('Cant take users with that link');
      
      const data = await db.query(`select * from ${req.params.data}`);
      res.json(data);
  } catch (error) {
    res.json("Something goes wrong :(");
  }
});

module.exports = router;
