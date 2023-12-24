import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import AppNavBar from "../components/navbar";
import Picker from "emoji-picker-react";
import "../styles/RaijinNavBar.css";

let backend_url = "http://localhost:3000/api";
let socket;

const ChatComponent = () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ message: "" }]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const chatId = localStorage.getItem("chatId");
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
      setMessages((prevMessages) => [...prevMessages, { message }]);
    });
    axios
      .get(`${backend_url}/chats/get-chats?_id=${chatId}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setMessages(response.data.chat.chat);
      })
      .catch((error) => {
        console.log(error);
      });

    // Call the async function
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  const handleEmojiClick = (emojiObject) => {
    console.log(message);
    setMessage(`${message}${emojiObject.emoji}`);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    const chatId = localStorage.getItem("chatId");
    const senderId = localStorage.getItem("userId");
    socket.emit("chat message", `${userName}: ${message}`);
    const response = await axios.put(
      `${backend_url}/chats/add-message`,
      { message: message, _id: chatId, senderId: senderId },
      { withCredentials: true }
    );
    setMessage("");
    setShowEmojiPicker(false);
  };

  return (
    <>
      {" "}
      <AppNavBar />
      <Container className="App">
        <Row className="message-container">
          <Col>
            {messages.map((message, index) => (
              <div key={index} className="message">
                {message.message}
              </div>
            ))}
          </Col>
        </Row>
        {localStorage.getItem("role") !== "manager" ? (
          <>
            <Row className="input-container">
              <Col>
                <Form.Control
                  type="text"
                  value={message}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                />
              </Col>
              <Col>
                <Button variant="success" onClick={handleSendMessage}>
                  Send
                </Button>
                <Button variant="secondary" onClick={toggleEmojiPicker}>
                  🙂
                </Button>
                {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
      </Container>
    </>
  );
};

export default ChatComponent;
