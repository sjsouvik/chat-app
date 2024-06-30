const express = require("express");
const router = express.Router();

const { accessChat, fetchChats } = require("../controllers/chat");

router.route("/").get(fetchChats).post(accessChat);

module.exports = router;
