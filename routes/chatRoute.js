const express = require("express");
const getConversationMessages = require("../controllers/chatController.js");
const getUserConversations = require("../controllers/chatController.js");

const router = express.Router();

router.route("/getConversationMessages").post(getConversationMessages);
router.route("/getUserConversations").post(getUserConversations);
module.exports = router;
