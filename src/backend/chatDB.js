import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },

    message:{
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Chat = mongoose.model("Chat", ChatSchema)
export default ChatSchema;