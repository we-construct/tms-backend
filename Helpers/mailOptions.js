const mailer = require("nodemailer");
require("dotenv").config();

const mailOptions = (email, token, position, role) => {
    return {
     from: "<noreply@weconstruct.am>",
     to: email,
     subject: "Welcome to WeConstruct team",
     text: "Visit this http://localhost:3000/invitation/" + token,
     html: `<p style="font-weight:bold; font-size:16px; font-family: Verdana; color:#1d1e1e">You are invited to <span style="color:#009abd">${position}</span> position and <span style="color:#00bd65">${role}</span> role in our company.</p><a href="http://localhost:3000/invitation/${token}"><img src="https://www.weconstruct.am/images/weconstruct-logo.png"><br /><h2 style="text-decoration:none; color:#FB500C">Accept invitation</h2></a>`,
   };
 };
const vacationMailOptions = (emails, first_name, last_name) => {
    return {
     from: "<noreply@weconstruct.am>",
     to: emails,
     subject: `New vacation request from ${first_name} ${last_name}`,
     text: "http://localhost:3000/vacation-requests",
     html: `
     <p style="font-weight:bold; font-size:16px; font-family: Verdana; color:#1d1e1e">
      You have a new vacation request from ${first_name} ${last_name}, follow the link below.
     </p>
     <a href="http://localhost:3000/vacation-requests"><img src="https://www.weconstruct.am/images/weconstruct-logo.png"><br /><h2 style="text-decoration:none; color:#FB500C">Check request</h2></a>`,
   };
 };

const transport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GOOGLE_APP_PASS,
    },
});

module.exports = { vacationMailOptions, mailOptions, transport };