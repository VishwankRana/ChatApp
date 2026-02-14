const initializeSocket = (io) => {

  const ROOM_ID = "user1_user2";

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    socket.on("join_room", (userId) => {
      if (userId === "user1" || userId === "user2") {
        socket.join(ROOM_ID);
        console.log(`${userId} joined ${ROOM_ID}`);
      } else {
        console.log("Invalid user tried to join");
      }
    });

    socket.on("send_message", (data) => {
      io.to(ROOM_ID).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

};

export default initializeSocket;
