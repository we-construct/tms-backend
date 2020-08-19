const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const invitationRouter = require("./Routes/invitation");
// initializing express
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", invitationRouter);

app.listen(port, () => {
  console.log("Server run on port " + port);
});
