const express = require("express");

const controller = require("../controllers/chatController");

const router = express.Router();

router.post("/getConversationMessages", controller.getConversationMessages);
router.post("/getUserConversations", controller.getUserConversations);
router.delete("/deleteMessage", controller.deleteMessage);
router.post("/getConversation", controller.getConversation);
router.post("/getMessage", controller.getMessage);
module.exports = router;
