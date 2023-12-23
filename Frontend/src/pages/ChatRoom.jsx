import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

let backend_url = "http://localhost:3000/api";
let socket;

const ChatComponent = () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    axios
      .get(`${backend_url}/users/get-profile?_id=${uid}`, {
        withCredentials: true,
      })
      .then((response) => {
        setUserName(response.data.user.profile.username);
      })
      .catch((error) => {
        console.log(error);
      });
    //ffffffff
    socket = io("http://localhost:3000");
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("new notification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification.message,
      ]);
    });

    const agentId = localStorage.getItem("agentId");

    // Emit a 'new notification' event to the server
    socket.emit("new notification", {
      agentId: agentId,
      message: "A new chat has been created",
    });

    // Call the async function

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = async () => {
    const chatId = localStorage.getItem("chatId");
    const senderId = localStorage.getItem("userId");
    socket.emit("chat message", `${userName}: ${message}`);
    const response = await axios.put(
      `${backend_url}/chats/add-message`,
      { message: message, _id: chatId, senderId: senderId },
      { withCredentials: true }
    );
    setMessage("");
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
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
