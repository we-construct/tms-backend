const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const acceptInvitation = require("./Routes/acceptInvitation");
const sendInvitation = require("./Routes/sendInvitation");
const authorizationRouter = require("./Routes/authorization");
const getAllData = require("./Routes/getAllData");
const getPaginatedUsers = require("./Routes/getPaginatedUsers");

// initializing express
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use("/get", getAllData);
app.use("/send-invitation", sendInvitation);
app.use("/accept-initation", acceptInvitation);
app.use("/login", authorizationRouter);
app.use("/users", getPaginatedUsers);

app.listen(port, () => {
  console.log("Server run on port " + port);
});
