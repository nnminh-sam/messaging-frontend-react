import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { SidebarMenu } from "./components/SidebarMenu";
import Texting from "./components/Texting";
import { useNavigate } from "react-router-dom";

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<string>("");

  useEffect(() => {
    const activeConversationFromLocalStorage: string | null =
      localStorage.getItem("activeConversation");
    if (!activeConversationFromLocalStorage) {
      return;
    }
    setActiveConversation(activeConversationFromLocalStorage);
    navigate(`/${activeConversationFromLocalStorage}`, { replace: true });
  }, []);

  return (
    <Layout className="chat-container" hasSider>
      <SidebarMenu
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
      />
      <div className="texting-section">
        {activeConversation ? (
          <Texting />
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </Layout>
  );
};
