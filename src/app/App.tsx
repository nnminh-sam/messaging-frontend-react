import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthenticationForm } from "../pages/auth/Authenticate";
import { RegistrationForm } from "../pages/auth/Register";
import Chat from "../pages/chat/chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<AuthenticationForm />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
