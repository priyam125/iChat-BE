import { Socket, Server as SocketServer } from "socket.io";
import prisma from "./config/db.config.js";
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

  const sendMessage = async (message) => {
    const { sender, recipient, content, messageType } = message;
    const senderSocketId = userSocketMap.get(sender);
    const recipientSocketId = userSocketMap.get(recipient);

    console.log("message", message);
    

    const createdMessage = await prisma.message.create({
        data: {
          senderId: sender, // Pass the sender's ID
          recipientId: recipient, // Pass the recipient's ID
          content, // Text content
          messageType, // Message type (text/file)
          timestamp: new Date(), // Optional: Defaults to now if not provided
        },
      });

    const messageData = await prisma.message.findUnique({
        where: { id: createdMessage.id }, // Find message by ID
        include: { // Include related fields
          sender: {
            select: {
              id: true,
              image: true,
              firstName: true,
              lastName: true,
              color: true,
            },
          },
          recipient: {
            select: {
              id: true,
              image: true,
              firstName: true,
              lastName: true,
              color: true,
            },
          },
        },
      });

      console.log("messageData", messageData);
      

      if(recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      if(senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
  };
     
    

  io.on("connection", (socket) => {
    // console.log("a user connected");
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with socket id ${socket.id}`);
    } else {
      console.log("User Id not found in query params");
    }

    socket.on("sendMessage", sendMessage);

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
