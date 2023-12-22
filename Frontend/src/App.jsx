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
import ProfilePage from "./pages/Profile";
import RegisterPage from "./pages/Register"
import ChatPage from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import KnowledgeBasePage from "./pages/KnowlengeBasePage";
import Tickets from "./pages/Tickets";

function App() {
  return (
    <Routes>
          <Route path="/" element={<Homepage />} />      
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<RegisterPage  />} />
          <Route path="/userlist" element={<UserManagement />} />
          <Route path="/branding" element={<CustomizationForm />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="/tickets" element={<Tickets />} />

    </Routes>
  );
}

export default App;
