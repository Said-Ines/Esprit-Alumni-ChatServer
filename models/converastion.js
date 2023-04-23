const mongoose = require("mongoose");
const Message = require("./message");

const conversationSchema = new mongoose.Schema({
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    //type: String,
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messagesList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
