const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateAdmin = (req, res, next) => {
    try {
        const userToken = req.body.userToken;
        const check = jwt.verify(userToken, process.env.JWT_SECRET);
        // no token or not valid token
        if(check === null) return res.json('Token not found!');
        // not admin
        if(check.role !== 1) return res.json('Not enough access privileges!');
        // deactivated admin
        if(check.status === 3) return res.json('Deactivated account!');
        next();
    } catch (error) {
        res.json('Not valid token');
    }
}

module.exports = authenticateAdmin;