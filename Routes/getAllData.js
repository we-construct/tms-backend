const router = require("express").Router();
const db = require("../Helpers/connectDb");

router.route("/:data").post(async (req, res) => {
    try {
        const data = await db.query(`select * from ${req.params.data}`);
        res.json(data);
    } catch (error) {
        res.json('Something goes wrong :(')
    }
});

module.exports = router;
