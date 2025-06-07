import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../components/utilities/axiosInstance.js";
import SendMessage from "../../message/Sendmessage.jsx";
import useUserStore from '../../store.js';
import DateSeparator from "../../components/utilities/DateSeparator.jsx";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

const MessagePageforUser = () => {
  const messageRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const socket = useUserStore((state) => state.socket);
  const userProfile = useUserStore((state) => state.userProfile);

  const onBack = () => {
    navigate('/chatstoprovider');
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/get-messages/${id}`);
        if (response.data.success) {
          const data = response.data.responseData;
          if (data) {
            setMessages(data.messages || []);
            const otherParticipant = data.participants.find(
              (p) => p._id !== data.currentUserId
            );
            setSelectedUser(otherParticipant);
            useUserStore.getState().setCurrentConversationId(data._id);
          } else {
            setMessages([]);
            setSelectedUser(null);
            useUserStore.getState().setCurrentConversationId(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMessages();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (
        (newMessage.senderId === id && newMessage.receiverId === userProfile?._id) ||
        (newMessage.receiverId === id && newMessage.senderId === userProfile?._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, id, userProfile]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getDateLabel = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "dd MMM yyyy");
  };

  // Prepare messages with date separators
  const messagesWithSeparators = [];
  let lastDate = null;

  if (messages && messages.length > 0) {
    messages.forEach((message) => {
      const messageDateStr = message.createdAt || message.timestamp;
      if (messageDateStr) {
        const date = parseISO(messageDateStr);
        const currentDate = date.toISOString().split("T")[0];
        if (lastDate !== currentDate) {
          messagesWithSeparators.push({
            type: "date-separator",
            id: `separator-${currentDate}`,
            label: getDateLabel(messageDateStr),
          });
          lastDate = currentDate;
        }
      }
      messagesWithSeparators.push({
        type: "message",
        id: message._id,
        messageDetails: message,
      });
    });
  }

  // Format time helper
  const formatTime = (timestamp) => {
    const date = parseISO(timestamp);
    return format(date, "hh:mm a");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/30 bg-white/10 backdrop-blur-md">
        <button onClick={onBack}>
          <FaArrowLeft className="text-xl text-white drop-shadow-md" />
        </button>
        <h2 className="font-semibold text-lg text-white drop-shadow-md">
          {selectedUser ? selectedUser.name : "Chat"}
        </h2>
        <div className="flex gap-4 text-white drop-shadow-md"></div>
      </div>

      {/* Chat messages with separators */}
      <div className="flex-1 px-4 py-2 overflow-y-auto space-y-2">
        {messagesWithSeparators.length === 0 ? (
          <div className="text-center text-white mt-4">No messages yet</div>
        ) : (
          messagesWithSeparators.map((item, index) => {
            if (item.type === "date-separator") {
              return <DateSeparator key={item.id} label={item.label} />;
            } else if (item.type === "message") {
              const msg = item.messageDetails;
              const isOwnMessage = msg.senderId !== selectedUser?._id; // or based on current user ID if available
              return (
                <div
                  key={item.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  ref={index === messagesWithSeparators.length - 1 ? messageRef : null}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      isOwnMessage
                        ? "bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {msg.message}
                    <div className="text-xs text-right mt-1 opacity-70">
                      {formatTime(msg.createdAt || msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })
        )}
        <div ref={messageRef} />
      </div>

      {/* Send message input */}
      {!loading && (
        <SendMessage
          receiverId={selectedUser?._id || ""}
          onNewMessage={(newMsg) => setMessages((prev) => [...prev, newMsg])}
        />
      )}
    </div>
  );
};

export default MessagePageforUser;