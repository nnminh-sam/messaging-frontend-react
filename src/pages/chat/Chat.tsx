import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { SidebarMenu } from "./components/SidebarMenu";
import Texting from "./components/Texting";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import MembershipApi from "../../services/membership/membership.api";
import { Membership } from "../../services/membership/membership.type";

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [activeMembership, setActiveMembership] = useState<any>({});

  const fetchMembershipById = async (membershipId: string) => {
    const response = await MembershipApi.getMembershipById(membershipId);

    if (!response) {
      authContext.logoutAction();
      return null;
    }
    return response.data as Membership;
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
