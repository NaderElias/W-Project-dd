import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";

let backend_url = "http://localhost:3000/api";

export default function ChatsPage() {
    const navigate = useNavigate();

    const createNotification = async (agentId) => {
        try {
            const response = await axios.post(`${backend_url}/chats/create-notification`, {
                agentId: agentId,
                message: 'A new chat has been created by the user just now Join or get fired!'
            },
            { withCredentials: true });
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCreateChat = async () => {
        try {
            const userID = localStorage.getItem('userId');
            const response = await axios.post(`${backend_url}/chats/create`,
                {
                    userID: userID,
                },
                { withCredentials: true });
            console.log(response.data);
            localStorage.setItem('agentId', response.data.newChat.agentId);
            const agentId = localStorage.getItem('agentId');
            await createNotification(agentId);
            navigate('/chatroom') //response.data.newChat._id); // navigate to the new chat

            // Create a notification after creating a chat
           
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {/* Other navbar items can go here */}
                <Button onClick={handleCreateChat}>Create</Button>
            </Navbar.Collapse>
        </Navbar>
    );
}