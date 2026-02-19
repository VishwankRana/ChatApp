const initializeSocket = (io) => {

  const ROOM_ID = "user1_user2";

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    
    socket.on("join_private_chat", ({ username, targetUser }) => {
      const roomId = [ username, targetUser].sort().join("_");

      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);
    });

    socket.on("send_private_message", ({ username, targetUser, message}) => {

      const roomId = [username, targetUser].sort().join("_");

      io.to(roomId).emit("recieve_private_message", {
        username,
        message
      });
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

};

export default initializeSocket;
