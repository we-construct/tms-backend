const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const port = process.env.PORT || 5000;
const acceptInvitation = require("./Routes/acceptInvitation");
const sendInvitation = require("./Routes/sendInvitation");
const authorizationRouter = require("./Routes/authorization");
// initializing express
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use("/send-invitation", sendInvitation);
app.use("/accept-initation", acceptInvitation);
app.use("/login", authorizationRouter);

app.listen(port, () => {
  console.log("Server run on port " + port);
});
