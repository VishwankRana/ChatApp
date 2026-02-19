import mongoose, { mongo } from "mongoose";

const ConversationSchema = mongoose.Schema({
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        ],

        roomId: {
            type: String,
            required: true,
            unique: true,
        },

        lastMessage: {
            type: String,
            default: "",
        },
    },
        {
            timestamps: true,
        }
)

const Conversation = mongoose.model("Conversation", ConversationSchema);
c 