const express = require("express");
const { searchUsers } = require("../controllers/user");
const router = express.Router();

router.route("/").get(searchUsers);

module.exports = router;
