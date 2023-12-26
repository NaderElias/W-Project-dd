import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import AppNavBar from "../components/navbar";
import Picker from "emoji-picker-react";
import "../styles/RaijinNavBar.css";

let backend_url = "http://localhost:3000/api";
let socket;

const ChatComponent = () => {
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{ message: "", senderUsername: "" },
	]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	let chatId = localStorage.getItem("chatId");

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
				if (error.response.status == 403) {
					removeCookies("token");
					navigate("/");
				}
			});
		//ffffffff
		socket = io("http://localhost:3000");
		socket.on("chat message", (message) => {
			message = message.split(",");
			if (message[2] == chatId.toString()) {
				setMessages((prevMessages) => [
					...prevMessages,
					{ message: message[1], senderUsername: message[0] },
				]);
			}
		});
		axios
			.get(`${backend_url}/chats/get-chats?_id=${chatId}`, {
				withCredentials: true,
			})
			.then((response) => {
				setMessages(response.data.chat.chat);
			})
			.catch((error) => {
				console.log(error);
				if (error.response.status == 403) {
					removeCookies("token");
					navigate("/");
				}
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
		socket.emit("chat message", `${userName},${message},${chatId}`);
		try {
			await axios.put(
				`${backend_url}/chats/add-message?_id=${chatId}`,
				{ message: message, senderId: senderId },
				{ withCredentials: true }
			);
			setMessage("");
			setShowEmojiPicker(false);
		} catch (error) {
			if (error.response.status == 403) {
				removeCookies("token");
				navigate("/");
			}
		}
	};

	return (
		<div className={`test ${localStorage.getItem("theme-color")}`}>
			<AppNavBar />
			<div class="page-background">
				<Container className="App">
					<Row className="message-container">
						<Col>
							{messages.map((message, index) => (
								<div key={index} className="message">
									{`${message.senderUsername}: ${message.message}`}
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
									{showEmojiPicker && (
										<Picker onEmojiClick={handleEmojiClick} />
									)}
								</Col>
							</Row>
						</>
					) : (
						<></>
					)}
				</Container>
			</div>
		</div>
	);
};

export default ChatComponent;
