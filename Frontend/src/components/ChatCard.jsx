import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatCard = ({ userId, agentId, chatId }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [agentData, setAgentData] = useState(null);

  const handleGoToChat = () => {
    localStorage.setItem("chatId", chatId);
    navigate("/chatroom");
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:3000/api/users/get-profile?_id=${userId}`,
          { withCredentials: true }
        );
        setUserData(userResponse.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
   //yoo update
    const fetchAgentData = async () => {
      try {
        const agentResponse = await axios.get(
          `http://localhost:3000/api/users/get-profile?_id=${agentId}`,
          { withCredentials: true }
        );
        setAgentData(agentResponse.data.user);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchUserData();
    fetchAgentData();
  }, [userId, agentId]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>User and Agent Details</Card.Title>
        {userData && (
          <div>
            <strong>User:</strong> {userData.profile.username}
          </div>
        )}
        {agentData && (
          <div>
            <strong>Agent:</strong> {agentData.profile.username}
          </div>
        )}
        <Button variant="primary" onClick={handleGoToChat}>
          Go to Chat
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ChatCard;
