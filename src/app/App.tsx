import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Authenticate from "../pages/authentication/Authentication";
import Registration from "../pages/registration/Registration";
import Chat from "../pages/chat/chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authenticate />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
