import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
    participants: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       }
    ],
    
    messages: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        }
    ],
    unreadCounts: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            count: {
                type: Number,
                default: 0,
            }
        }
    ],
},
    { timestamps: true })

export default mongoose.model("Conversation", conversationSchema);