const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const CronJob = require('cron').CronJob;
const acceptInvitation = require("./Routes/acceptInvitation");
const sendInvitation = require("./Routes/sendInvitation");
const authorizationRouter = require("./Routes/authorization");
const tokenAuthorizationRouter = require("./Routes/tokenAuthorization");
const getAllData = require("./Routes/getAllData");
const userEditProfile = require("./Routes/userEditProfile");
const getCurrentUser = require("./Routes/getCurrentUser");
const getProfileInfo = require("./Routes/getProfileInfo");
const actionsWithUser = require("./Routes/actionsWithUser");
const getPaginatedUsers = require("./Routes/getPaginatedUsers");
const vacation = require("./Routes/vacations");
const vacationRequests = require("./Routes/vacationRequests");
const { addClient, removeClient, getClient, getClientsByRole, getAllClients} = require('./socketClients')

const port = process.env.PORT || 5000;
require("dotenv").config();
// initializing express
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
  socket.on("join", ({ name, role }, callback) => {
    const { error, client } = addClient({ id: socket.id, name, role });
    if (error) return callback(error);
    socket.emit("notification", {
      user: "TMS",
      text: `Welcome [${client.role}] ${client.name}!`,
    });
    socket.broadcast
      .to(client.role)
      .emit("notification", {
        user: "TMS",
        text: `[${client.role}] ${client.name} connected!`,
      });
    socket.join(client.role);
    callback();
    io.to(client.role).emit("roleData", {
      role: client.role,
      users: getClientsByRole(client.role),
    });
    socket.emit('getClients', {
      clients: getAllClients()
    })
  });
  socket.on("sendNotification", ({ text, time }, callback) => {
    const client = getClient(socket.id);
    io.to(client.role).emit("notification", { user: client.name, text: text, time });
    callback();
  });
  socket.on("disconnect", () => {
    const client = removeClient(socket.id);
    if (client) {
      socket.broadcast
        .to(client.role)
        .emit("notification", {
          user: "TMS",
          text: `[${client.role}] ${client.name} disconnected!`,
        });
    }
    console.log(`user ${socket.id} disconnected`);
  });
});

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use("/get", getAllData);
app.use("/profile", getProfileInfo);
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

http.listen(port, () => {
  console.log("Server run on port " + port);
});
