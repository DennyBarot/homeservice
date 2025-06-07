import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Providernavbar from './providernavbar';
import { axiosInstance } from '../../components/utilities/axiosInstance.js';

const ChatListPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);
  
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
          
          // Sort conversations by last message timestamp
          updatedConversations.sort((a, b) => {
            const lastMsgA = getLastMessageTimestamp(a);
            const lastMsgB = getLastMessageTimestamp(b);
            return lastMsgB - lastMsgA;
          });
          
          return updatedConversations;
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

  useEffect(() => {
    // Initialize socket from global store
    import('../../store.js').then(({ default: useUserStore }) => {
      const s = useUserStore.getState().socket;
      setSocket(s);
    });
  }, []);

  const getLastMessage = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) return '';
    return conversation.messages[conversation.messages.length - 1].message;
  };

  // Return raw Date object for sorting
  const getLastMessageTimestamp = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) return new Date(0);
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return new Date(lastMsg.createdAt);
  };

  // Return formatted time string for display
  const formatLastMessageTime = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) return '';
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== conversation.currentUserId);
  };

  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return 'https://via.placeholder.com/150';
    if (profileImage.startsWith('http') || profileImage.startsWith('https')) {
      return profileImage;
    }
    // Remove leading slash if present to avoid double slash in URL
    const normalizedPath = profileImage.startsWith('/') ? profileImage.substring(1) : profileImage;
    return `http://localhost:5000/${normalizedPath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Providernavbar />
      <div className="p-4 max-w-md mx-auto bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Inbox</h2>
          <button>
            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>
        </div>

        <div className="mb-4 border-b border-white/30">
          <button className="text-purple-300 font-medium border-b-2 border-purple-300 px-2 py-1">
            Chats
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-white">No conversations found</div>
          ) : (
            conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const lastMessage = getLastMessage(conversation);
              const lastMessageTime = formatLastMessageTime(conversation);
              return (
                <div
                  key={conversation._id}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/20 p-2 rounded-lg transition"
                  onClick={() => navigate(`/providerchat/${otherParticipant._id}`)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getProfileImageUrl(otherParticipant?.profileImage)}
                      alt={otherParticipant?.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover shadow-md border border-white/40"
                    />
                    <div>
                      <p className="font-semibold text-white drop-shadow-md">{otherParticipant?.name || 'Unknown User'}</p>
                      <p className={`text-sm truncate max-w-[180px] ${
                        conversation.currentUserId && lastMessage
                          ? (lastMessage.senderId !== conversation.currentUserId
                            ? 'font-bold bg-white/30 px-1 rounded text-white'
                            : 'text-white/80')
                          : 'text-white/80'
                      }`}>{lastMessage}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-white/70">{formatLastMessageTime(conversation)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
