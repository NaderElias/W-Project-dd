import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import AppNavBar from "../components/navbar";
let backend_url = "http://localhost:3000/api";
import "../styles/Brands.css";

export default function HomePage() {
	const navigate = useNavigate();
	const [cookies, removeCookies] = useCookies(["token"]);
	const [userName, setUserName] = useState("");
	const [colorTheme, setColorTheme] = useState('theme-blue');

	useEffect(() => {
		async function fetchData() {
			try {
				if (!cookies.token) {
					navigate("/login");
				} else {
					const uid = localStorage.getItem("userId");
					const response = await axios.get(
						`${backend_url}/users/get-profile?_id=${uid}`,
						{
							withCredentials: true,
						}
					);
					setUserName(response.data.user.profile.username);
					const brand = await axios.get(
						`${backend_url}/branding/get-brand`,
						{
							withCredentials:true,
						}
					);
					setColorTheme(brand.data.brand.colorTheme);
					localStorage.setItem("theme-color", brand.data.brand.colorTheme);
				}
			} catch (error) {
				console.log("error");
				console.log(error);
				if(error.response.status == 403){
					removeCookies("token")
				}
			}
		}

		fetchData();
	}, [cookies, navigate]);

	const handleUserListClick = () => {
		navigate("/userlist");
	};

	const handleBrandingClick = () => {
		navigate("/branding");
	};

	return (
		<div className={`test ${localStorage.getItem("theme-color")}`}>
			<AppNavBar />
			<div className="page-background">
				<h1 className = "txt" style={{ textAlign: "center", margin: "30px"}}>
					Welcome {userName}
				</h1>
			</div>
		</div>
	);
}
