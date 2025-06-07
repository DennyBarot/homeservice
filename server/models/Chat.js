import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
},
    { timestamps: true })

export default mongoose.model("Message", messageSchema);