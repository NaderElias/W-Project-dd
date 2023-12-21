// ProfilePage.js
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AppNavBar from "../components/navbar";
let backend_url = "http://localhost:3000/api";

export default function ProfilePage() {
	const [cookies, removeCookies] = useCookies(["token"]);
	const [profile, setProfile] = useState("profile");
	const [email, setEmail] = useState("email");
	useEffect(() => {
		async function fetchData() {
			try {
				const uid = localStorage.getItem("userId");
				const response = await axios.get(
					`${backend_url}/users/get-profile?_id=${uid}`,
					{
						withCredentials: true,
					}
				);
				setEmail(response.data.user.email);
				setProfile(response.data.user.profile);
			} catch (error) {
				console.log("error");
				console.log(error);
			}
		}

		fetchData();
	}, [cookies]);

	const handleChangePassword = () => {
		// Handle password change logic here
		console.log("Changing password...");
	};

	const handleChangeUsername = () => {
		const newUsername = prompt("Enter new username:", user.username);
		if (newUsername !== null) {
			// Handle changing username logic here
			console.log(`Changing username to: ${newUsername}`);
		}
	};

	const handleChangeFirstName = () => {
		const newFirstName = prompt("Enter new first name:", user.firstName);
		if (newFirstName !== null) {
			// Handle changing first name logic here
			console.log(`Changing first name to: ${newFirstName}`);
		}
	};

	const handleChangeLastName = () => {
		const newLastName = prompt("Enter new last name:", user.lastName);
		if (newLastName !== null) {
			// Handle changing last name logic here
			console.log(`Changing last name to: ${newLastName}`);
		}
	};

	return (
		<>
			<AppNavBar />
			<div className="container mt-5">
				<Card className="mx-auto" style={{ maxWidth: "600px" }}>
					<Card.Body>
						<Card.Title className="mb-4 text-center">Profile</Card.Title>
						<Row className="mb-2">
							<Col xs={6}>
								<strong>Email:</strong>
							</Col>
							<Col xs={6} className="text-truncate">
								{email}
							</Col>
						</Row>
						<Row className="mb-2">
							<Col xs={6}>
								<strong>Username:</strong>
							</Col>
							<Col xs={4} className="text-truncate">
								{profile.username}
							</Col>
							<Col xs={2}>
								<Button
									variant="outline-secondary"
									onClick={handleChangeUsername}
								>
									Change
								</Button>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col xs={6}>
								<strong>First Name:</strong>
							</Col>
							<Col xs={4} className="text-truncate">
								{profile.firstName}
							</Col>
							<Col xs={2}>
								<Button
									variant="outline-secondary"
									onClick={handleChangeFirstName}
								>
									Change
								</Button>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col xs={6}>
								<strong>Last Name:</strong>
							</Col>
							<Col xs={4} className="text-truncate">
								{profile.lastName}
							</Col>
							<Col xs={2}>
								<Button
									variant="outline-secondary"
									onClick={handleChangeLastName}
								>
									Change
								</Button>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col xs={12} className="d-flex justify-content-center">
								<Button variant="primary" onClick={handleChangePassword}>
									Change Password
								</Button>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</div>
		</>
	);
}
