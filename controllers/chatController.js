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

/*exports.getUserConversations = async (req, res) => {
  const { userId } = req.body;

  try {
    // Recherche des conversations de l'utilisateur dans la collection Message
    // Les messages sont ensuite triés par ordre décroissant de leur date de création.
    const messages = await Message.find({
      $or: [{ sourceId: userId }, { targetId: userId }],
    }).sort({ createdAt: 1 });

    // Initialiser conversationMap qui va contenir les conversations de l'utilisateur.
    const conversationMap = new Map();

    // Pour chaque message, on récupère l'id de l'autre utilisateur.
    messages.forEach((message) => {
      const otherUserId =
        message.sourceId !== userId ? message.sourceId : message.targetId;

      // Si la conversationMap ne contient pas encore l'autre utilisateur, on l'ajoute.
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUserId,
          messages: [],
        });
      }
      // On ajoute le message à la conversation de l'autre utilisateur.
      conversationMap.get(otherUserId).messages.push(message);
    });

    // On transforme la conversationMap en tableau et on trie les conversations par ordre décroissant de la date de création du dernier message.
    const conversations = Array.from(conversationMap.values());

    conversations.sort((a, b) => {
      const aLastMessage = a.messages[a.messages.length - 1];
      const bLastMessage = b.messages[b.messages.length - 1];
      return aLastMessage.createdAt - bLastMessage.createdAt;
    });

    // Modifier chaque conversation pour inclure l'id de l'autre utilisateur et trier les messages dans l'ordre croissant.
    conversations.forEach((conversation) => {
      const otherUserId = conversation.user;

      // Trier les messages de la conversation par ordre croissant de la date de création.
      conversation.messages.sort((a, b) => a.createdAt - b.createdAt);

      // Ajouter l'id de l'autre utilisateur à la conversation.
      conversation.user = otherUserId;
    });

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send(
        "Erreur lors de la récupération des conversations de l'utilisateur"
      );
  }
};*/

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
    const conversation = await Conversation.findOne({
      targetId: targetId,
    })
      // .populate({
      //   path: "messagesList",
      //   model: "Message",
      //   populate: {
      //     path: "sourceId",
      //     select: "username profile.profile_image",
      //   },
      // })
      .populate({
        path: "messagesList",
        model: "Message",
        // select: "username profile.profile_image",
      })
      .select("messagesList targetId");

    if (!conversation) {
      res.status(404).json("Conversation not found");
    }
    //const { targetId: user } = conversation;
    //const { username, profile_image } = user;
    return res.status(200).json({
      conversation: conversation,
      //username: username,
      //profile_image: profile_image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération de la conversation");
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
    res.status(200).json(message.message);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
