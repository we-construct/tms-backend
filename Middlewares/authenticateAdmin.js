const jwt = require("jsonwebtoken");
const db = require("../Helpers/connectDb");
require("dotenv").config();

const authenticateAdmin = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const check = jwt.verify(accessToken, process.env.JWT_SECRET);
    const tokenMatch = await db.one(`select token from users where id = ${check.id}`);
    // if no token or not valid token
    if (check === null) return res.json("Token not found!");
    // check if token is matching with token in db
    if (accessToken !== tokenMatch.token) return res.json("Token error!");
    // if not admin or moder
    if (check.role !== 1 && check.role !== 2)
      return res.json("Not enough access privileges!");
    // if deactivated account
    if (check.status === 3) return res.json("Deactivated account!");
    next();
  } catch (error) {
    res.json("Not valid token");
  }
};

module.exports = authenticateAdmin;
