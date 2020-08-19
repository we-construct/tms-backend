// const bcrypt = require("bcryptjs");
const router = require("express").Router();
// const db = require('../Helpers/connectDb');
const mailer = require("nodemailer");
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.post('/', async (req, res, next) => {

    const { email, role_id, status_id, position_id, created_by_id } = await req.body;
    // token will expire after one day
    const token_expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const transport = mailer.createTransport({
        service : "Gmail",
        auth : {
            user : process.env.GMAIL,
            pass : process.env.GOOGLE_APP_PASS
        }
    });
    // using token to encrypt user data
    const token = jwt.sign({ email, role_id, status_id, position_id, created_by_id, token_expiry }, process.env.JWT_SECRET);
    const mailOptions = {
        from : "<noreply@weconstruct.am>",
        to : req.body.email,
        subject : "Welcome to WeConstruct team",
        text : 'Visit this http://localhost:3000/invitation/'+token,
        html : '<a href="http://localhost:3000/invitation/'+token+'"><img src="https://www.weconstruct.am/images/weconstruct-logo.png"><br /><h2 style="text-decoration:none; color:#FB500C">Accept invitation</h2></a>'
    }
    transport.sendMail(mailOptions, email_err => {
        if(email_err){
            res.json(email_err);
        }else{
            res.json({ message: 'New team member invited' });
        }
    });

});


module.exports = router;
