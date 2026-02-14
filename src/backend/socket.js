const initializeSocket = (io) =>{

    io.on("connection", (socket) =>{
        console.log("User Connected: ", socket.id);

        socket.on("send_message", (data) =>{
            io.emit("receive_message", data);
        });

        socket.on("disconnet", () =>{
            console.log("User Disconnected", socket.id);
        });
    });


};

export default initializeSocket;