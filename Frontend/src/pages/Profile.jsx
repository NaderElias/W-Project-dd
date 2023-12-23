import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  Button,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Container,
} from "react-bootstrap";
import AppNavBar from "../components/navbar";

const backend_url = "http://localhost:3000/api";

export default function ProfilePage() {
  const [cookies, removeCookies] = useCookies(["token"]);
  const [profile, setProfile] = useState({
    username: "username",
    firstName: "John",
    lastName: "Doe",
  });
  const [email, setEmail] = useState("email");

  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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
        console.error("Error fetching user profile:", error);
      }
    }

    fetchData();
  }, [cookies]);

  const handleChangePassword = () => {
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    // Handle password change logic here
    console.log("Changing password...");
    const response = await axios.put(
      `${backend_url}/users/change-password?_id=${localStorage.getItem(
        "userId"
      )}`,
      {
        oldPassword,
        newPassword,
        confirmNewPassword,
      },
      { withCredentials: true }
    );
    console.log(response);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <>
      <AppNavBar />
      <Container className="mt-5">
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
                  onClick={() => console.log("Change username clicked")}
                >
                  Change
                </Button>
              </Col>
            </Row>
            {/* ... (similar code for first name, last name) */}
            <Row className="mb-2">
              <Col xs={6}>
                <strong>Firstname:</strong>
              </Col>
              <Col xs={4} className="text-truncate">
                {profile.firstName}
              </Col>
              <Col xs={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => console.log("Change username clicked")}
                >
                  Change
                </Button>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>
                <strong>LastName:</strong>
              </Col>
              <Col xs={4} className="text-truncate">
                {profile.lastName}
              </Col>
              <Col xs={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => console.log("Change username clicked")}
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
      </Container>

      {/* Password Change Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="confirmNewPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
