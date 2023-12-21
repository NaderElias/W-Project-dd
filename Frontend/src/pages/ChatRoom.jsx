import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

let backend_url = "http://localhost:3000/api";
let socket;

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    socket = io("http://localhost:3000");
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("new notification", (notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, notification.message]);
    });

    const agentId = localStorage.getItem('agentId');

    // Emit a 'new notification' event to the server
    socket.emit('new notification', {
      agentId: agentId,
      message: 'A new chat has been created'
    });

    // Call the async function

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit("chat message", message);
    setMessage('');
  };

  return (
    <div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div>
        {notifications.map((notification, index) => (
          <p key={index}>{notification}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;