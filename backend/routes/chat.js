const express = require("express");
const router = express.Router();

const { findChat, fetchChats, createChat } = require("../controllers/chat");

router.route("/").get(fetchChats);
router.route("/:userId").get(findChat).post(findChat, createChat);

module.exports = router;
