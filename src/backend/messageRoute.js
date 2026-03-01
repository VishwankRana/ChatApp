import express from "express";
import Message from "./models/messageDB.js";
import Conversation from "./models/conversationsDB.js";
import authMiddleware from "./middleware/authMiddleware.js";

const router = express.Router();

router.get("/:roomId", authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      roomId: req.params.roomId
    });

    if (!conversation) return res.json([]);

    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
});

export default router;