import React, { useEffect, useState } from 'react';
import Usernavbar from './usernavbar';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store.js';
import { axiosInstance } from '../../components/utilities/axiosInstance.js';

const Chatstoprovider = () => {
  const navigate = useNavigate();
  const userProfile = useUserStore((state) => state.userProfile);
  const socket = useUserStore((state) => state.socket);
  const [conversations, setConversations] = useState([]);

  const getLastMessageTimestamp = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) return new Date(0);
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return new Date(lastMsg.createdAt);
  };

  const formatLastMessageTime = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) return '';
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.get('/conversations');
        if (response.data.success) {
          // Sort conversations by last message timestamp (newest first)
          const sortedConversations = response.data.responseData.sort((a, b) => {
            const lastMsgA = getLastMessageTimestamp(a);
            const lastMsgB = getLastMessageTimestamp(b);
            return lastMsgB - lastMsgA;
          });
          setConversations(sortedConversations);
        }
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };
    if (userProfile) {
      fetchConversations();
    }
  }, [userProfile]);


  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('/conversations');
      if (response.data.success) {
      
        const sortedConversations = response.data.responseData.sort((a, b) => {
          const lastMsgA = getLastMessageTimestamp(a);
          const lastMsgB = getLastMessageTimestamp(b);
          return lastMsgB - lastMsgA;
        });
        setConversations(sortedConversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  };


  useEffect(() => {
    if (userProfile) {
      fetchConversations();
    }
  }, [userProfile]);

  // Optionally, listen to socket events to refresh conversations
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      fetchConversations();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setConversations((prevConversations) => {
        const conversationIndex = prevConversations.findIndex(
          (conv) => conv._id === newMessage.conversationId
        );
        if (conversationIndex !== -1) {
          const updatedConversations = [...prevConversations];
          const conversation = updatedConversations[conversationIndex];
          conversation.messages.push(newMessage);
        
          updatedConversations.sort((a, b) => {
            const lastMsgA = getLastMessageTimestamp(a);
            const lastMsgB = getLastMessageTimestamp(b);
            return lastMsgB - lastMsgA;
          });
          updatedConversations.splice(conversationIndex, 1);
          return [conversation, ...updatedConversations];
        } else {
          return prevConversations;
        }
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  const handleConversationClick = (conversation) => {
    const otherParticipant = conversation.participants.find(
      (p) => p._id?.toString() !== userProfile._id.toString()
    );
    if (otherParticipant) {
      // Set current conversation id in store to suppress unread badge
      useUserStore.getState().setCurrentConversationId(conversation._id);
      navigate(`/userchat/${otherParticipant._id}`);
    }
  };

  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return 'https://randomuser.me/api/portraits/lego/1.jpg';
    if (profileImage.startsWith('/uploads/')) {
      return `http://localhost:5000${profileImage}`;
    }
    return `http://localhost:5000/uploads/${profileImage}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="p-4 max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Inbox</h2>
        
        </div>

        <div className="mb-4 border-b border-white/30">
          <button className="text-purple-300 font-medium border-b-2 border-purple-300 px-2 py-1">
            Chats
          </button>
        </div>

        <div className="space-y-4">
          {conversations.map((conversation) => {
            if (!conversation.participants || !userProfile?._id) return null;
            const otherParticipant = conversation.participants.find(
              (p) => p._id?.toString() !== userProfile._id.toString()
            );
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            const profileImageUrl = getProfileImageUrl(otherParticipant?.profileImage);
            return (
              <div
                key={conversation._id}
                className="flex items-center justify-between cursor-pointer hover:bg-white/20 p-3 rounded-lg transition-shadow shadow-md bg-white/10"
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={profileImageUrl}
                    alt={otherParticipant?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white/40"
                  />
                  <div>
                    <p className="font-semibold text-white">{otherParticipant?.name || 'Unknown'}</p>
                    <p className={`text-sm truncate max-w-[180px] ${
                      lastMessage && lastMessage.senderId !== userProfile._id && (!lastMessage.readBy || !lastMessage.readBy.includes(userProfile._id))
                        ? 'font-bold bg-white/30 px-1 rounded text-gray-900'
                        : 'text-gray-300'
                    }`}>
                      {lastMessage ? lastMessage.message : 'No messages yet'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">
                    {lastMessage ? formatLastMessageTime(conversation) : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chatstoprovider;
