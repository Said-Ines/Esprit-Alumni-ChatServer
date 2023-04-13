const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sourceId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    type: Number,
  },
  targetId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    type: Number,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
