import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
let backend_url = 'http://localhost:3000/api';

const NavigationBar = ({ onUserListClick, onBrandingClick }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#f0f0f0", padding: "10px" }}>
      <div>
        <button onClick={onUserListClick}>User List</button>
        <button onClick={onBrandingClick}>Branding</button>
      </div>
      {/* You can add more items or styling as needed */}
    </div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [cookies, removeCookies] = useCookies(['token']);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!cookies.token) {
          navigate("/login");
        } else {
          const uid = localStorage.getItem("userId");
          const response = await axios.get(`${backend_url}/users/get-profile?_id=${uid}`, {
            withCredentials: true,
          });
          setUserName(response.data.user.username);
        }
      } catch (error) {
        console.log("error");
        console.log(error);
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
    <>
      <NavigationBar
        onUserListClick={handleUserListClick}
        onBrandingClick={handleBrandingClick}
      />
      <h1 style={{ textAlign: "center", margin: "30px", color: "black" }}>
        Welcome {userName}
      </h1>
    
    </>
  );
}
