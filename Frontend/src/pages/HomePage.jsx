import { useEffect, useState } from "react";
//import AppNavBar from "../components/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
//require("dotenv").config();
let backend_url = 'http://localhost:3000/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [cookies, removeCookies] = useCookies(['token']);
  const [userName, setUserName] = useState("");
  // useeffect to fetch username
  useEffect(() => {
    async function fetchData() {
      try {
        if (!cookies.token) {
          navigate("/login");
        }
        else{
        const uid = localStorage.getItem("userId");
        console.log(cookies.token);

        const response = await axios.get(`${backend_url}/users/get-profile?_id=${uid}`, {
          withCredentials: true,
        });
        console.log("response", response);

        setUserName(response.data.username);
    }
      } catch (error) {
        console.log("error");
        console.log(error);
      }
    }

    fetchData();
  }, [cookies, navigate]);
  return (
    <>
      <h1 style={{ textAlign: "center", margin: "30px",color:'white' }}>
        Welcome {userName}
      </h1>
    </>
  );
}