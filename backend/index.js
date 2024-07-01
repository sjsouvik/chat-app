const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const { isLoggedIn } = require("./controllers/auth");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the APIs of chat app");
});

app.use("/api/v1", authRoutes);

app.use(isLoggedIn);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Couldn't find this route on server" });
});

app.use((req, res, next, error) => {
  res
    .status(500)
    .json({ message: "Error Occured", errorMessage: error.message });
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
