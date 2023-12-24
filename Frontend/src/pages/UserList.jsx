import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Card, Row, Col, Dropdown } from "react-bootstrap";
import AppNavBar from "../components/navbar";

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [showCreateUserModal, setShowCreateUserModal] = useState(false);
	const [newUser, setNewUser] = useState({
		email: undefined,
		password: undefined,
		role: "user",
	});
	const [newProfile, setNewProfile] = useState({
		username: undefined,
		firstName: undefined,
		lastName: undefined,
	});
	const [selectedUser, setSelectedUser] = useState(null);
	const [showRoleDropdown, setShowRoleDropdown] = useState(false);

	useEffect(() => {
		// Fetch all users from the backend when the component mounts
		axios
			.get("http://localhost:3000/api/users/get-all-users", {
				withCredentials: true,
			})
			.then((response) => {
				setUsers(response.data.users);
			})
			.catch((error) => {
				console.error("Error fetching users:", error);
			});
	}, []); // Empty dependency array ensures that this effect runs once on mount

	const handleCloseCreateUserModal = () => {
		setShowCreateUserModal(false);
		// Reset the new user form fields
		setNewUser({
			email: undefined,
			password: undefined,
			role: "user",
		});
		setNewProfile({
			username: undefined,
			firstName: undefined,
			lastName: undefined,
		});
	};

	const handleShowCreateUserModal = () => {
		setShowCreateUserModal(true);
	};

	const handleCreateUser = () => {
		// Implement logic to create a new user using the backend API
		axios
			.post(
				"http://localhost:3000/api/users/create",
				{ ...newUser, profile: newProfile },
				{
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log("User created successfully:", response.data);
				// Close the modal after user creation
				handleCloseCreateUserModal();
				// Refresh the user list after user creation
				axios
					.get("http://localhost:3000/api/users/get-all-users", {
						withCredentials: true,
					})
					.then((response) => {
						setUsers(response.data.users);
					})
					.catch((error) => {
						console.error("Error fetching users:", error);
					});
			})
			.catch((error) => {
				console.error("Error creating user:", error);
				// You may want to display an error message
			});
	};

	const handleAssignRole = (_id) => {
		// Set the selected user when the "Assign Role" button is clicked
		setSelectedUser(_id);
		setShowRoleDropdown(!showRoleDropdown);
	};

	const handleRoleSelection = (newRole) => {
		// Implement logic to assign a role using the backend API
		if (selectedUser && newRole) {
			axios
				.post(
					`http://localhost:3000/api/users/assign-role?_id=${selectedUser}`,
					{ newRole: newRole },
					{ withCredentials: true }
				)
				.then((response) => {
					console.log("Role assigned successfully:", response.data);
					// Refresh the user list after role assignment
					axios
						.get("http://localhost:3000/api/users/get-all-users", {
							withCredentials: true,
						})
						.then((response) => {
							setUsers(response.data.users);
						})
						.catch((error) => {
							console.error("Error fetching users:", error);
						});
				})
				.catch((error) => {
					console.error("Error assigning role:", error);
					// You may want to display an error message
				})
				.finally(() => {
					// Reset the selected user after role assignment
					setSelectedUser(null);
				});
		}
	};

	const handleDeleteUser = (_id) => {
		// Implement logic to delete a user using the backend API
		axios
			.delete(`http://localhost:3000/api/users/delete-user?_id=${_id}`, {
				withCredentials: true,
			})
			.then((response) => {
				console.log("User deleted successfully:", response.data);
				// Refresh the user list after user deletion
				axios
					.get("http://localhost:3000/api/users/get-all-users", {
						withCredentials: true,
					})
					.then((response) => {
						setUsers(response.data.users);
					})
					.catch((error) => {
						console.error("Error fetching users:", error);
					});
			})
			.catch((error) => {
				console.error("Error deleting user:", error);
				// You may want to display an error message
			});
	};

	return (
		<div>
			<AppNavBar />
			<h2>Users</h2>

			<Button
				variant="primary"
				onClick={handleShowCreateUserModal}
				className="mb-3"
			>
				Create New User
			</Button>

			<Row xs={1} md={2} lg={3} xl={4} className="g-4">
				{users.map((user) => (
					<Col key={user._id}>
						<Card>
							<Card.Body>
								<Card.Title>{user.profile.username}</Card.Title>
								<Card.Text>{""}</Card.Text>
								<Card.Subtitle className="mb-2 text-muted">
									{user.email}
								</Card.Subtitle>
								<Card.Text>{""}</Card.Text>
								<Card.Text>
									{user.profile.firstName} {user.profile.lastName}
								</Card.Text>
								<Card.Text>{`role: ${user.role}`}</Card.Text>
								{user.role != "admin" && (
									<div className="d-flex justify-content-between">
										<Button
											variant="info"
											onClick={() => handleAssignRole(user._id)}
										>
											Assign Role
										</Button>
										<Button
											variant="danger"
											onClick={() => handleDeleteUser(user._id)}
										>
											Delete
										</Button>
									</div>
								)}

								{/* Dropdown for role selection */}
								{selectedUser === user._id && showRoleDropdown && (
                  <><p></p>
									<Dropdown onSelect={handleRoleSelection}>
										<Dropdown.Toggle variant="info" id="dropdown-basic">
											Select Role
										</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item eventKey="user">User</Dropdown.Item>
											<Dropdown.Item eventKey="admin">Admin</Dropdown.Item>
											<Dropdown.Item eventKey="agent">Agent</Dropdown.Item>
											<Dropdown.Item eventKey="manager">Manager</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown></>
								)}
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>

			{/* Create User Modal */}
			<Modal show={showCreateUserModal} onHide={handleCloseCreateUserModal}>
				<Modal.Header closeButton>
					<Modal.Title>Create New User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter email"
								value={newUser.email}
								onChange={(e) =>
									setNewUser({ ...newUser, email: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="formPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Enter password"
								value={newUser.password}
								onChange={(e) =>
									setNewUser({ ...newUser, password: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="formUsername">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter username"
								value={newUser.username}
								onChange={(e) =>
									setNewProfile({ ...newProfile, username: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="formFirstName">
							<Form.Label>First Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter first name"
								value={newUser.firstName}
								onChange={(e) =>
									setNewProfile({ ...newProfile, firstName: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="formLastName">
							<Form.Label>Last Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter last name"
								value={newUser.lastName}
								onChange={(e) =>
									setNewProfile({ ...newProfile, lastName: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="formRole">
							<Form.Label>Role</Form.Label>
							<Form.Control
								as="select"
								value={newUser.role}
								onChange={(e) =>
									setNewUser({ ...newUser, role: e.target.value })
								}
							>
								<option value="admin">Admin</option>
								<option value="user">User</option>
								<option value="agent">Agent</option>
								<option value="manager">Manager</option>
							</Form.Control>
						</Form.Group>

						<Button variant="primary" onClick={handleCreateUser}>
							Create User
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default UserList;
