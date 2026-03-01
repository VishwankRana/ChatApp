import express from "express";
import Conversation from "./models/conversationsDB.js";
import authMiddleware from "./middleware/authMiddleware.js";

const router = express.Router();

// POST /api/conversation
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.body;

    const participants = [req.user.id, targetUserId].sort();

    let conversation = await Conversation.findOne({
      participants: { $all: participants }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        roomId: participants.join("_")
      });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
});

export default router;