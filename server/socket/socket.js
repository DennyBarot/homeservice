import { Server } from "socket.io";
import Message from "../models/chat.js";
import Conversation from "../models/Conversation.js";

let io;
const userSocketMap = {
  // userId : socketId,
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId;

      console.log(`Socket connected: socket.id=${socket.id}, userId=${userId}`);

      if (!userId) return;

      userSocketMap[userId] = socket.id;

      io.emit("onlineUsers", Object.keys(userSocketMap));

      socket.on("sendMessage", async (data, callback) => {
        try {
          const { receiverId, message, timestamp } = data;

          console.log(`sendMessage received from userId=${userId} to receiverId=${receiverId}: ${message}`);

          if (!userId || !receiverId || !message) {
            if (callback) callback({ success: false, error: "Missing fields" });
            return;
          }

          let conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId] },
          });

          if (!conversation) {
            conversation = new Conversation({
              participants: [userId, receiverId],
            });
            await conversation.save();
          }

          const newMessage = await Message.create({
            senderId: userId,
            receiverId,
            message,
          });

          if (newMessage) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
          }

          // Add conversationId to newMessage object for client filtering
          const messageToSend = {
            ...newMessage.toObject(),
            conversationId: conversation._id.toString(),
          };

          console.log(`Emitting newMessage to receiverSocketId=${userSocketMap[receiverId]}`);

          // Emit newMessage to receiver if online
          const receiverSocketId = userSocketMap[receiverId];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageToSend);
          }

          // Acknowledge sender
          if (callback) {
            callback({ success: true, message: messageToSend });
          }
        } catch (error) {
          console.error("Error in sendMessage handler:", error);
          if (callback) {
            callback({ success: false, error: error.message });
          }
        }
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: socket.id=${socket.id}, userId=${userId}`);
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap));
      });
    });
};

const getSocketId = (userId) => {
  return userSocketMap[userId];
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export { initializeSocket, getSocketId, getIO };
