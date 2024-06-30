const express = require("express");
const { fetchAllMessages, sendMessage } = require("../controllers/message");

const router = express.Router();

router.route("/:chatId").get(fetchAllMessages);
router.route("/").post(sendMessage);

module.exports = router;
