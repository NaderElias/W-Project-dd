import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FaUser } from "react-icons/fa";
import "../styles/NavBar.css";
let backend_url = "http://localhost:3000/api";

export default function AppNavBar() {
	const [cookies, removeCookies] = useCookies(["token"]);
	const navigate = useNavigate();
	const logout = async () => {
		try {
			const response = await axios.delete(`${backend_url}/logout`, {
				withCredentials: true,
			});
			removeCookies("token");
			localStorage.removeItem("userId");
			localStorage.removeItem("role");
			console.log(response);
			navigate("/login");
		} catch (error) {
			console.log("error");
			console.log(error);
		}
	};
	return (
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
					{localStorage.getItem("role") == "agent" ? (
						<Nav.Item>
							<Button as={Nav.Link} href="/chat" className="navbar-buttons">
								Join Chat
							</Button>
						</Nav.Item>
					) : (
						<></>
					)}
					{localStorage.getItem("role") == "admin" ? (
						<Nav.Item>
							<Button as={Nav.Link} href="/userlist" className="navbar-buttons">
								User List
							</Button>
						</Nav.Item>
					) : (
						<></>
					)}
					{localStorage.getItem("role") == "admin" ? (
						<Nav.Item>
							<Button as={Nav.Link} href="/branding" className="navbar-buttons">
								Brands
							</Button>
						</Nav.Item>
					) : (
						<></>
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
					{localStorage.getItem("role") === "manager" && (
						<Nav.Item>
							<Button as={Nav.Link} href="/reports" className="navbar-buttons">
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
				</Nav>
				<Nav>
					<Nav.Item>
						<Button as={Link} to="/profile" className="navbar-buttons">
							<FaUser /> {/* FontAwesome User Icon */}
						</Button>
					</Nav.Item>
					<Nav.Item>
						<Button as={Link} className="navbar-buttons" onClick={logout}>
							Logout
						</Button>
					</Nav.Item>
				</Nav>
			</Container>
		</Navbar>
	);
}
