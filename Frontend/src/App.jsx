import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
// import '../public/styles/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Router, Routes } from "react-router-dom";
import Login from "./pages/login";
import Homepage from "./pages/HomePage";
import UserManagement from "./pages/UserList";
import CustomizationForm from "./pages/Branding";
function App() {
  return (
    <Routes>
          <Route path="/" element={<Homepage />} />      
          <Route path="/login" element={<Login  />} />
          <Route path="/userlist" element={<UserManagement />} />
          <Route path="/branding" element={<CustomizationForm />} />
    </Routes>
  );
}

export default App;
