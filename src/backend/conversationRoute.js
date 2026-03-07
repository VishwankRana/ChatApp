import express from "express";
import Conversation from "./models/conversationsDB.js";
import authMiddleware from "./middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {

    const { targetUserId } = req.body;

    const senderId = req.user.id;

    const roomId = [senderId, targetUserId].sort().join("_");

    let conversation = await Conversation.findOne({ roomId });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, targetUserId],
        roomId,
      });
    }

    res.json(conversation);

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

export default router;