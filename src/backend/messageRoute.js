import express from "express";
import Conversation from "./Database/conversationsDB.js";
import Message from "./Database/messageDB.js";

const router = express.Router();

router.get("/:roomId", async(req, res) =>{
    try{
        const { roomId } = req.params;
        const conversation = await Conversation.findOne({ roomId});

        if(!conversation){
            return res.status(200).json([]);
        }

        const messages = await Message.find({
            conversationId: conversation._id,
        })
        .sort( { createdAt: 1 })
        .populate("sender", "username")

        res.status(200).json(messages);
    }
   catch(err){
        console.error("Fetch messages error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
}); 

export default router;
