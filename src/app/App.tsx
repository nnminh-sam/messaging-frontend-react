import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthenticationForm } from "../pages/auth/Authenticate";
import { RegistrationForm } from "../pages/auth/Register";
import { ChatPage } from "../pages/chat/Chat";
import AuthenticationProvider from "../components/auth/AuthenticationProvider";
import PrivateRoute from "../components/auth/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthenticationProvider>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<ChatPage />} />
          </Route>
          <Route path="/login" element={<AuthenticationForm />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </AuthenticationProvider>
    </Router>
  );
}

export default App;
