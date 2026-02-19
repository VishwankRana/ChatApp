import mongoose from "mongoose";
import Conversation from "./conversationsDB";

const MessageSchema = new mongoose.model({

    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    text: {
        type: String,
        required: true,
        trim: true 
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },

  {
    timestamps: true,
  }
);

const Message = mongoose.model()
export default Message;
