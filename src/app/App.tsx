import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthenticationForm } from "../pages/auth/Authenticate";
import { RegistrationForm } from "../pages/auth/Register";
import { ChatPage } from "../pages/chat/Chat";
import AuthenticationProvider from "../components/auth/AuthenticationProvider";
import PrivateRoute from "../components/auth/PrivateRoute";
import UserProfile from "../pages/user-profile/UserProfile";

function App() {
  return (
    <Router>
      <AuthenticationProvider>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/:conversationId?" element={<ChatPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="/login" element={<AuthenticationForm />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </AuthenticationProvider>
    </Router>
  );
}

export default App;
