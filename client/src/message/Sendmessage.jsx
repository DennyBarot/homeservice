import React, { useState } from 'react';
import useUserStore from '../store.js';

const SendMessage = ({ receiverId, onNewMessage }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const socket = useUserStore((state) => state.socket);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    setSending(true);
    const newMessage = {
      receiverId,
      message,
      timestamp: new Date().toISOString(),
    };
    socket.emit('sendMessage', newMessage, (response) => {
      if (response && response.success) {
        onNewMessage(response.message);
        setMessage('');
      } else {
        console.error('Failed to send message via socket');
      }
      setSending(false);
    });
  };

  return (
    <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow border rounded px-3 py-2 text-black"
        disabled={sending}
      />
      <button
        type="submit"
        disabled={sending}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};

export default SendMessage;
