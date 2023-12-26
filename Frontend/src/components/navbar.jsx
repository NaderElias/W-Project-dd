import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
	Button,
	Card,
	Badge,
	Navbar,
	Nav,
	Modal,
	Container,
} from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { BsFillBellFill } from "react-icons/bs"; // import notification icon
import "../styles/NavBar.css";
let backend_url = "http://localhost:3000/api";

export default function AppNavBar() {
	const [cookies, removeCookies] = useCookies(["token"]);
	const navigate = useNavigate();
	const [notification, setNotification] = useState([]);
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);

	const getNotification = async () => {
		try {
			const agentId = localStorage.getItem("userId");
			const response = await axios.get(
				`${backend_url}/chats/get-notification?agentId=${agentId}`,
				{
					withCredentials: true,
				}
			);
			setNotification(response.data.notification);
		} catch (error) {
			console.error(error);
			if (error.response.status == 403) {
				removeCookies("token");
				navigate("/");
			}
		}
	};
	useEffect(() => {
		if (localStorage.getItem("role") === "agent") {
			getNotification();
		}
	}, []);
	const logout = async () => {
		try {
			const response = await axios.delete(`${backend_url}/logout`, {
				withCredentials: true,
			});
			removeCookies("token");
			localStorage.removeItem("userId");
			localStorage.removeItem("role");
			localStorage.removeItem("theme-color");
			console.log(response);
			navigate("/login");
		} catch (error) {
			console.log("error");
			console.log(error);
			if (error.response.status == 403) {
				removeCookies("token");
				navigate("/");
			}
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
			getNotification();
		} catch (error) {
			console.error(error);
			if (error.response.status == 403) {
				removeCookies("token");
				navigate("/");
			}
		}
	};
	const handleNotificationClick = async (_id, chatId) => {
		localStorage.setItem("chatId", chatId);
		await handleDeleteNotification(_id);
		navigate("/chatroom");
	};
	return (
		<>
			<Navbar expand="lg" className="bg-body-tertiary">
				<Container>
					<Nav>
						<Nav.Item>
							<Button as={Nav.Link} href="/" className="navbar-buttons">
								Home
							</Button>
						</Nav.Item>
						{localStorage.getItem("role") == "user" ? (
							<Nav.Item>
								<Button as={Nav.Link} href="/chat" className="navbar-buttons">
									Start Chat
								</Button>
							</Nav.Item>
						) : (
							<></>
						)}
						{localStorage.getItem("role") == "agent" ||
						localStorage.getItem("role") == "manager" ? (
							<Nav.Item>
								<Button as={Nav.Link} href="/chat" className="navbar-buttons">
									Join Chat
								</Button>
							</Nav.Item>
						) : (
							<></>
						)}
						{localStorage.getItem("role") == "admin" ? (
							<>
								<Nav.Item>
									<Button
										as={Nav.Link}
										href="/userlist"
										className="navbar-buttons"
									>
										User List
									</Button>
								</Nav.Item>
								<Nav.Item>
									<Button
										as={Nav.Link}
										href="/branding"
										className="navbar-buttons"
									>
										Brands
									</Button>
								</Nav.Item>
							</>
						) : (
							<></>
						)}

						{localStorage.getItem("role") == "admin" ? (
							<></>
						) : (
							<Nav.Item>
								<Button
									as={Nav.Link}
									href="/tickets"
									className="navbar-buttons"
								>
									Tickets
								</Button>
							</Nav.Item>
						)}
						{localStorage.getItem("role") === "manager" && (
							<Nav.Item>
								<Button
									as={Nav.Link}
									href="/reports"
									className="navbar-buttons"
								>
									Reports
								</Button>
							</Nav.Item>
						)}
						{localStorage.getItem("role") === "manager" && (
							<Nav.Item>
								<Button
									as={Nav.Link}
									href="/analytics"
									className="navbar-buttons"
								>
									Analytics
								</Button>
							</Nav.Item>
						)}
						{localStorage.getItem("role") == "user" ? (
							<Nav.Item>
								<Button
									as={Nav.Link}
									href="/knowledge-base"
									className="navbar-buttons"
								>
									FAQs
								</Button>
							</Nav.Item>
						) : (
							<></>
						)}
					</Nav>
					<Nav>
						<Nav.Item>
							<Button as={Link} to="/profile" className="navbar-buttons">
								<FaUser /> {/* FontAwesome User Icon */}
							</Button>
						</Nav.Item>
						{localStorage.getItem("role") === "agent" && (
							<Nav.Item>
								<Button
									variant="primary"
									onClick={handleShow}
									className="notification-button navbar-buttons"
								>
									<BsFillBellFill />{" "}
									<Badge variant="light">{notification.length}</Badge>
								</Button>
							</Nav.Item>
						)}
						<Nav.Item>
							<Button as={Link} className="navbar-buttons" onClick={logout}>
								Logout
							</Button>
						</Nav.Item>
					</Nav>
				</Container>
			</Navbar>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton className="modal-header">
					<Modal.Title>Notification</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{notification.map((notification, index) => (
						<Card
							key={index}
							className="mb-2 raijin"
							onClick={() =>
								handleNotificationClick(notification._id, notification.chatId)
							}
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
					<Button variant="secondary" onClick={handleClose} className="raijin">
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
