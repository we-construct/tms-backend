const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const acceptInvitation = require("./Routes/acceptInvitation");
const sendInvitation = require("./Routes/sendInvitation");
const authorizationRouter = require("./Routes/authorization");
const tokenAuthorizationRouter = require("./Routes/tokenAuthorization");
const getAllData = require("./Routes/getAllData");
const userEditProfile = require("./Routes/userEditProfile");
const getCurrentUser = require("./Routes/getCurrentUser");
const actionsWithUser = require("./Routes/actionsWithUser");
const getPaginatedUsers = require("./Routes/getPaginatedUsers");
const vacation = require("./Routes/vacations");
const vacationRequests = require("./Routes/vacationRequests");

// initializing express
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use("/get", getAllData);
app.use("/user", getCurrentUser);
app.use("/edit-profile", userEditProfile);
app.use("/action", actionsWithUser);
app.use("/send-invitation", sendInvitation);
app.use("/accept-initation", acceptInvitation);
app.use("/login", authorizationRouter);
app.use("/token", tokenAuthorizationRouter);
app.use("/users", getPaginatedUsers);
app.use("/vacations", vacation);
app.use("/vacation-requests", vacationRequests);

app.listen(port, () => {
  console.log("Server run on port " + port);
});
