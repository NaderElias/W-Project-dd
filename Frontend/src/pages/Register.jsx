// RegisterPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
let backend_url = "http://localhost:3000/api";

export default function RegisterPage() {
    const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		username: "",
		firstName: "",
		lastName: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Add your registration logic here using formData
		try {
			console.log("Registration data:", formData);
			const response = await axios.post(
				`${backend_url}/register`,
				{
					email: formData.email,
					password: formData.password,
					profile: {
						username: formData.username,
						firstName: formData.firstName,
						lastName: formData.lastName,
					},
				},
				{ withCredentials: true }
			);
			const { status, data } = response;
			console.log("data", data);
			if (status == 200) {
				setFormData({
					email: "",
					password: "",
					username: "",
					firstName: "",
					lastName: "",
				});
				setTimeout(() => {
					navigate("/login");
				}, 1000);
			} else {
				console.log(`error: ${data.message}`);
			}
		} catch (error) {
			console.log(error);
			// setErrorMessage(error.message);
		}
	};

	return (
		<div className="container mt-5">
			<Form
				onSubmit={handleSubmit}
				className="mx-auto"
				style={{ width: "30%" }}
			>
				<h2 className="text-center mb-4">Create an Account</h2>

				<Form.Group controlId="formEmail">
					<Form.Label>Email:</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						className="mb-3"
					/>
				</Form.Group>

				<Form.Group controlId="formPassword">
					<Form.Label>Password:</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
						className="mb-3"
					/>
				</Form.Group>

				<Form.Group controlId="formUsername">
					<Form.Label>Username:</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter username"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
						className="mb-3"
					/>
				</Form.Group>

				<Form.Group controlId="formFirstName">
					<Form.Label>First Name:</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter first name"
						name="firstName"
						value={formData.firstName}
						onChange={handleChange}
						required
						className="mb-3"
					/>
				</Form.Group>

				<Form.Group controlId="formLastName">
					<Form.Label>Last Name:</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter last name"
						name="lastName"
						value={formData.lastName}
						onChange={handleChange}
						required
						className="mb-4"
					/>
				</Form.Group>

				<div className="d-flex justify-content-between">
					<Button
						variant="primary"
						type="submit"
						style={{ width: "20%", paddingRight: "20px" }}
						className="mb-3"
					>
						Register
					</Button>

					<span>
						Already have an account? <Link to={"/login"}>Login</Link>
					</span>
				</div>
			</Form>
		</div>
	);
}
