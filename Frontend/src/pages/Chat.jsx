import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsFillBellFill } from "react-icons/bs"; // import notification icon
import {
  Button,
  Card,
  Badge,
  Navbar,
  Nav,
  Modal,
  Container,
} from "react-bootstrap";
import "../styles/RaijinNavBar.css";
let backend_url = "http://localhost:3000/api";

export default function ChatsPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getNotification = async () => {
    try {
      const agentId = localStorage.getItem("userId");
      const response = await axios.get(
        `${backend_url}/chats/get-notification?agentId=${agentId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setNotification(response.data.notification);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("role") === "agent") {
      getNotification();
    }
  }, []);
  const createNotification = async (agentId) => {
    try {
      const chatId = localStorage.getItem("chatId");
      const response = await axios.post(
        `${backend_url}/chats/create-notification`,
        {
          agentId: agentId,
          message:
            "A new chat has been created by the user just now Join or get fired!",
          chatId: chatId,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      localStorage.removeItem("agentId");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCreateChat = async () => {
    try {
      const userID = localStorage.getItem("userId");
      const response = await axios.post(
        `${backend_url}/chats/create`,
        {
          userID: userID,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      localStorage.setItem("agentId", response.data.newChat.agentId);
      localStorage.setItem("chatId", response.data.newChat._id);
      const agentId = localStorage.getItem("agentId");
      await createNotification(agentId);

      navigate("/chatroom"); //response.data.newChat._id); // navigate to the new chat

      // Create a notification after creating a chat
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteNotification = async (_id) => {
    try {
      const response = await axios.delete(
        `${backend_url}/chats/delete-notification?_id=${_id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      getNotification();
    } catch (error) {
      console.error(error);
    }
  };
  const handleNotificationClick = (chatId) => {
    localStorage.setItem("chatId", chatId);
    navigate("/chatroom");
  };

  return (
    <>
      {localStorage.getItem("role") === "user" && (
        <Navbar bg="light" expand="lg" className="navbar">
          <Navbar.Brand href="/" className="navbar-buttons">
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Other navbar items can go here */}
            <Button onClick={handleCreateChat} className="navbar-buttons">
              Create
            </Button>
          </Navbar.Collapse>
        </Navbar>
      )}
      <>
        {localStorage.getItem("role") === "agent" && (
          <Navbar bg="light" expand="lg" className="navbar">
            <Container className="navbar-container">
              <Nav>
                <Nav.Item>
                  <Button as={Nav.Link} href="/" className="navbar-buttons">
                    Home
                  </Button>
                </Nav.Item>
              </Nav>
              <Nav className="ml-auto">
                <Button
                  variant="primary"
                  onClick={handleShow}
                  className="notification-button"
                >
                  <BsFillBellFill />{" "}
                  <Badge variant="light">{notification.length}</Badge>
                </Button>
              </Nav>
            </Container>
          </Navbar>
        )}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton className="modal-header">
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {notification.map((notification, index) => (
              <Card
                key={index}
                className="mb-2 raijin"
                onClick={() => handleNotificationClick(notification.chatId)}
              >
                <Card.Body>
                  <Card.Text>{notification.message}</Card.Text>
                  <Button
                    variant="danger"
                    className="raijin"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent the card's onClick from being triggered
                      handleDeleteNotification(notification._id);
                    }}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="raijin"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}
