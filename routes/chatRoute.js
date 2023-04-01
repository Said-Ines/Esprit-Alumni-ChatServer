const express = require("express");
// const getConversationMessages = require("../controllers/chatController.js");
// //const getUserConversations = require("../controllers/chatController.js");
// const deleteMessage = require("../controllers/chatController.js");
const controller = require("../controllers/chatController");

const router = express.Router();

router.post("/getConversationMessages", controller.getConversationMessages);
//router.route("/getUserConversations").post(getUserConversations);
router.delete("/deleteMessage", controller.deleteMessage);
module.exports = router;
