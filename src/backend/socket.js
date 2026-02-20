import Conversation from "./Database/conversationsDB.js";
import Message from "./Database/messageDB.js";
import User from "./Database/userDB.js";

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join Private Chat Room
    socket.on("join_private_chat", async ({ username, targetUser }) => {
      try {
        const roomId = [username, targetUser].sort().join("_");
        socket.join(roomId);
        console.log(`${username} joined room ${roomId}`);
      } catch (error) {
        console.error("Join error:", error.message);
      }
    });

    // Send Private Message 
    socket.on("send_private_message", async ({ username, targetUser, message }) => {
        try {
          // Find sender and receiver users
          const sender = await User.findOne({ username });
          const receiver = await User.findOne({ username: targetUser });

          if (!sender || !receiver) {
            return;
          }

          // Generate deterministic roomId
          const roomId = [username, targetUser].sort().join("_");

          // Find existing conversation
          let conversation = await Conversation.findOne({
            roomId,
          });

          if (!conversation) {
            conversation = await Conversation.create({
              participants: [sender._id, receiver._id],
              roomId,
              lastMessage: message,
            });
          }

          // Save message
          const newMessage = await Message.create({
            conversationId: conversation._id,
            sender: sender._id,
            text: message,
            status: "sent",
          });

          // Update lastMessage in conversation
          conversation.lastMessage = message;
          await conversation.save();

          // Emit message to room
          io.to(roomId).emit("receive_private_message", {
            username,
            message,
            createdAt: newMessage.createdAt,
          });
        } catch (error) {
          console.error("Message error:", error.message);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

export default initializeSocket;
