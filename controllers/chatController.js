const Message = require("../models/message");

async function getConversationMessages(req, res) {
    const { sourceId, targetId } = req.body;
    try {
        const messages = await Message.find({
            $or: [{
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
}

module.exports = getConversationMessages;