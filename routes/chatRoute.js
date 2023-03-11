const express = require("express");
const getConversationMessages = require("../controllers/chatController.js");

const router = express.Router();

router.route("/getConversationMessages").post(getConversationMessages);
module.exports = router;