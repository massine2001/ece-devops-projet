const express = require("express");
const userRouter = require("./routes/user");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const db = require("./dbClient");
db.on("error", (err) => {
  console.error(err);
});

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/", userRouter);
app.use("/add", userRouter);

app.use("/user", userRouter);

app.get("/health", (req, res) => {
  res.send("Application is up and running");
});

const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening the port " + port);
});

module.exports = server;
