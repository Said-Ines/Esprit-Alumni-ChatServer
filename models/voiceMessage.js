const mongoose = require("mongoose");

const voiceMessageSchema = new mongoose.Schema({
  sourceId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    type: Number,
  },
  targetId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    type: Number,
  },
  voiceMessage: {
    filename: {
      type: String,
    },
    duration: {
      type: Number,
    },
  },
  audioUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const VoiceMessage = mongoose.model("VoiceMessage", voiceMessageSchema);
module.exports = VoiceMessage;
