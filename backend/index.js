const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { isLoggedIn } = require("./controllers/auth");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the APIs of chat app");
});

app.use("/api/v1", authRoutes);

app.use(isLoggedIn);
app.use("/api/v1/chat", chatRoutes);

const connectionString = process.env.DB_CONNECTION_STRING;
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log("Couldn't connect to DB", error));

const PORT = process.env.PORT || "8000";
app.listen(PORT, () =>
  console.log(`App is running at http://localhost:${PORT}`)
);
