import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Input, Layout, Menu, theme } from "antd";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";
import { GetParticipatedConversation } from "../../apis/chat/membership.service";
import { Membership } from "../../apis/chat/types/membership.dto";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { Conversation } from "../../apis/chat/types/conversation.dto";

const { Content, Sider } = Layout;
type SideBarConversation = Required<MenuProps>["items"][number];

export const ChatPage: React.FC = () => {
  const authenticationContext: AuthenticationContextProp = useAuth();
  const [conversations, setConversations] = useState<SideBarConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>("");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (
      !authenticationContext.userInformation.fullName &&
      authenticationContext.accessToken
    ) {
      authenticationContext.getUserInformation(
        authenticationContext.accessToken
      );
    }

    const GetUserParticipatedConversation = async () => {
      try {
        const response: ListApiResponse<Membership> =
          await GetParticipatedConversation(authenticationContext.accessToken);
        const conversations: Conversation[] = response.data.map(
          (membership) => {
            return membership.conversation;
          }
        );
        const sideBarConversations: SideBarConversation[] = conversations.map(
          (conversation) => ({
            key: conversation.id,
            icon: <UserOutlined />,
            label: conversation.name,
          })
        );
        setConversations(sideBarConversations);
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          authenticationContext.logoutAction();
        }
      }
    };

    GetUserParticipatedConversation();
  }, []);

  const handleConversationSelected: MenuProps["onClick"] = (event: any) => {
    console.log("Choosing:", event.key);
    setActiveConversation(event.key);
  };

  return (
    <Layout className="chat-container" hasSider>
      <Sider className="chat-sidebar" width={300}>
        <div className="user-info">
          <Avatar className="avatar" icon={<UserOutlined />} />
          <p className="full-name">
            {authenticationContext.userInformation
              ? authenticationContext.userInformation.fullName
              : "Loading..."}
          </p>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          items={conversations}
          onClick={handleConversationSelected}
        />
      </Sider>
      <Layout className="conversation-container">
        <Content
          className="message-container"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div>
            <p>long content</p>
            {Array.from({ length: 100 }, (_, index) => (
              <React.Fragment key={index}>
                {index % 20 === 0 && index ? "more" : "..."}
                <br />
              </React.Fragment>
            ))}
          </div>
        </Content>
        <div
          className="message-input"
          style={{
            background: colorBgContainer,
          }}
        >
          <div className="texting-features">
            <Button icon={<SmileOutlined />} />
            <Button icon={<PaperClipOutlined />} />
          </div>
          <Input className="text-input" placeholder="Message" />
          <Button type="primary" icon={<SendOutlined />} />
        </div>
      </Layout>
    </Layout>
  );
};
