const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../Helpers/connectDb");

const authenticateUser = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;
        const check = jwt.verify(accessToken, process.env.JWT_SECRET);
        const tokenMatch = await db.one(`select token from users where id = ${check.id}`);
        if (accessToken !== tokenMatch.token) return res.json("Token error!");
        // no token or not valid token
        if(check === null) return res.json('Token not found!');
        next();
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = authenticateUser;
