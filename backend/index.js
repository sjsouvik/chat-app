const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to API of chat app");
});

const connectionString = process.env.DB_CONNECTION_STRING;
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log("Couldn't connect to DB", error));

const PORT = process.env.PORT || "8000";
app.listen(PORT, () =>
  console.log(`App is running at http://localhost:${PORT}`)
);