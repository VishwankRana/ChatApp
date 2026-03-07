import Conversation from "./models/conversationsDB.js";
import Message from "./models/messageDB.js";
import User from "./models/userDB.js";

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join Private Chat Room
    socket.on("join_private_chat", async ({ userId, targetUserId }) => {
      try {
          const roomId = [userId, targetUserId].sort().join("_");
          socket.join(roomId);
      } catch (error) {
        console.error("Join error:", error.message);
      }
    });

    socket.on("send_private_message", async ({ senderId, receiverId, message }) => {
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) return;

    const roomId = [senderId, receiverId].sort().join("_");

    let conversation = await Conversation.findOne({ roomId });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        roomId,
      });
    }

    const newMessage = await Message.create({
  conversationId: conversation._id,
  sender: senderId,
  text: message,
});

conversation.lastMessage = message;
await conversation.save();

io.to(roomId).emit("receive_private_message", {
  senderId,
  message,
  createdAt: newMessage.createdAt,
}); 

  } catch (error) {
    console.error("Message error:", error);
  }
});

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

export default initializeSocket;
