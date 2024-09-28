require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router/index.js");
const connectDb = require("./utils/db.js");
const cron = require("node-cron");
const colors = require("colors");

connectDb();

const TIME_EXPRESSION = "0 9 * * *";
// const TIME_EXPRESSION = "* * * * * *";

const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json("ecom backend server is working");
});

cron.schedule(TIME_EXPRESSION, () => {
  fetch("http://localhost:7000/")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
});

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`.bgMagenta);
});

module.exports = app;
