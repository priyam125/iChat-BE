import { Socket, Server as SocketServer } from "socket.io";
//we get server from server.js where we are using setupSocket
const setupSocket = (server) => {
  const io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  //here we are mapping the socket id to the user id
  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    // console.log("a user connected");
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with socket id ${socket.id}`);
    } else {
      console.log("User Id not found in query params");
    }
    socket.on("disconnect", () => {
      console.log(`Client disconnected with socket id ${socket.id}`);
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

export default setupSocket;
