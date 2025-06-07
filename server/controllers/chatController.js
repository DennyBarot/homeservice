import Message from "../models/chat.js";
import Conversation from "../models/Conversation.js";
import asyncHandler from "express-async-handler";

import { getSocketId, getIO } from '../socket/socket.js';

class errorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const sendMessage = asyncHandler(async (req, res, next) => {
    const receiverId = req.params.receiverId;
    const senderId = req.user._id;
    const message = req.body.message;
    const timestamp = req.body.timestamp; 

    if (!senderId || !receiverId || !message) {
        return next(new errorHandler("any field is missing.", 400));
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = new Conversation({
            participants: [senderId, receiverId],
        });
        await conversation.save(); // Save the new conversation
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
    });

    const createdAt = newMessage.createdAt; // Capture the createdAt timestamp

    if (newMessage) {
        conversation.messages.push(newMessage._id);

        // Increment unread count for receiver
        const unreadCountEntry = conversation.unreadCounts.find(uc => uc.userId.toString() === receiverId.toString());
        if (unreadCountEntry) {
            unreadCountEntry.count += 1;
        } else {
            conversation.unreadCounts.push({ userId: receiverId, count: 1 });
        }

        await conversation.save();
    }

    //socket 
    const io = getIO();
    const socketId = getSocketId(receiverId);
    io.to(socketId).emit("newMessage", newMessage);


    res.status(200).json({
        success: true,
        responseData: {
            message: newMessage,
            conversationId: conversation._id
        },
    });
});

export const getMessages = asyncHandler(async (req, res, next) => {
    const myId = req.user._id;
    const otherParticipantId = req.params.otherParticipantId;


    if (!myId || !otherParticipantId) {
        return next(new errorHandler("All fields are required", 400));
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [myId, otherParticipantId] },
    }).populate("messages").populate({
        path: "participants",
        select: "name profileImage"
    });

    res.status(200).json({
        success: true,
        responseData: {
            ...conversation.toObject(),
            currentUserId: myId
        },
    });
});

export const getConversations = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    if (!userId) {
        return next(new errorHandler("User ID is required", 400));
    }

    const conversations = await Conversation.find({
        participants: userId,
    }).populate({
        path: "messages",
        populate: [
            {
                path: "readBy",
                select: "_id"
            },
            {
                path: "senderId",
                select: "_id"
            }
        ]
    }).populate({
        path: "participants",
        select: "name profileImage"
    });

    res.status(200).json({
        success: true,
        responseData: conversations,
    });
});

export const markMessagesRead = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { conversationId } = req.body;

    if (!userId || !conversationId) {
        return next(new errorHandler("User ID and conversation ID are required", 400));
    }

    // Find messages in the conversation where userId is not in readBy
    const messagesToUpdate = await Message.find({
        _id: { $in: (await Conversation.findById(conversationId)).messages },
        readBy: { $ne: userId }
    });

    // Update readBy for these messages
    await Promise.all(messagesToUpdate.map(async (msg) => {
        msg.readBy.push(userId);
        await msg.save();
    }));

    // Reset unread count for user in conversation
    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
        const unreadCountEntry = conversation.unreadCounts.find(uc => uc.userId.toString() === userId.toString());
        if (unreadCountEntry) {
            unreadCountEntry.count = 0;
            await conversation.save();
        }
    }

    res.status(200).json({
        success: true,
        message: "Messages marked as read and unread count reset",
    });
});
