import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import { Button, Input, Layout, theme } from "antd";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";
import { SidebarMenu } from "./components/SidebarMenu";
import { Route, Routes } from "react-router-dom";
import Texting from "./components/Texting";

export const ChatPage: React.FC = () => {
  const authenticationContext: AuthenticationContextProp = useAuth();
  const [activeConversation, setActiveConversation] = useState<string>("");

  return (
    <Layout className="chat-container" hasSider>
      <SidebarMenu
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
      />
      <div className="texting-section">
        {activeConversation ? (
          <Texting conversationId={activeConversation} />
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
        {/* <Routes>
          <Route path="/chat/:conversationId" element={<Texting />} />
        </Routes> */}
      </div>
    </Layout>
  );
};
