import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { SidebarMenu } from "./components/SidebarMenu";
import Texting from "./components/Texting";
import { useNavigate } from "react-router-dom";
import { findMemberhsipById } from "../../services/membership/membership.service";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { Membership } from "../../services/membership/types/membership.dto";

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [activeMembership, setActiveMembership] = useState<any>({});

  const fetchMembershipById = async (membershipId: string) => {
    const response = await findMemberhsipById(
      authContext.accessToken,
      membershipId
    );
    if ("data" in response) {
      return response.data as Membership;
    }
    authContext.logoutAction();
    return null;
  };

  const getLastOpennedConversation = async () => {
    const membershipIdFromLocalStorage: string | null =
      localStorage.getItem("lastMembershipId");
    if (!membershipIdFromLocalStorage) return;

    const membership: Membership | null = await fetchMembershipById(
      membershipIdFromLocalStorage
    );
    if (!membership) return;
    setActiveMembership(membership);
    setActiveConversation(membership.conversation.id);
    navigate(`/${membership.conversation.id}`, { replace: true });
  };

  useEffect(() => {
    getLastOpennedConversation();
  }, []);

  return (
    <Layout className="chat-container" hasSider>
      <SidebarMenu
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        setActiveConversationMembership={setActiveMembership}
      />
      <div className="texting-section">
        {activeConversation ? (
          <Texting membership={activeMembership} />
        ) : (
          // <></>
          // TODO: Add a better UI for this
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </Layout>
  );
};
