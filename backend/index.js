const express = require("express");

const app = express();

const PORT = process.env.PORT || "8000";
app.listen("8000", () =>
  console.log(`App is running at http://localhost:${PORT}`)
);
