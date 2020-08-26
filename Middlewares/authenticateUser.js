const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = (req, res, next) => {
    try {
        const accessToken = req.body.accessToken;
        const check = jwt.verify(accessToken, process.env.JWT_SECRET);
        // no token or not valid token
        if(check === null) return res.json('Token not found!');
        next();
    } catch (error) {
        res.json('Not valid token');
    }
}

module.exports = authenticateUser;
