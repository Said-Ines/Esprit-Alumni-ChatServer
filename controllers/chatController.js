const Message = require("../models/message.js");
const Conversation = require("../models/converastion.js");
const User = require("../../Esprit-Alumni-backend/models/user.js");

exports.getConversationMessages = async (req, res) => {
  const { sourceId, targetId } = req.body;
  try {
    const messages = await Message.find({
      $or: [
        {
          $and: [{ sourceId: sourceId }, { targetId: targetId }],
        },
        {
          $and: [{ sourceId: targetId }, { targetId: sourceId }],
        },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteMessage = async (req, res) => {
  const messageId = req.body.messageId;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json("Message not found");
    } else {
      await message.deleteOne();
      res.status(200).json("Message deleted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUserConversations = async (req, res) => {
  const { userId } = req.body;
  try {
    const conversations = await Conversation.find({
      $or: [{ sourceId: userId }, { targetId: userId }],
    }).sort({ createdAt: 1 });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { targetId } = req.body;
    const conversation = await Conversation.findOne({ targetId });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMessage = async (req, res) => {
  const messageId = req.body.messageId;
  try {
    //get message by id
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json("Message not found");
    }
    res
      .status(200)
      //.json({ message: message.message, createdAt: message.createdAt });
      .json(message.message);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
