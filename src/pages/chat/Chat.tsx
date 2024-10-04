import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
  ProfileOutlined,
  FormOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import type { GetProps, MenuProps } from "antd";
import { Avatar, Button, Input, Layout, Menu, theme } from "antd";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";
import { GetParticipatedConversation } from "../../apis/chat/membership.service";
import { Membership } from "../../apis/chat/types/membership.dto";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { Conversation } from "../../apis/chat/types/conversation.dto";
import { GetUserFriends } from "../../apis/chat/relationship.service";
import { Relationship } from "../../apis/chat/types/relationship.dto";
import { UserInformation } from "../../apis/chat/types/user-information.dto";

const { Content, Sider } = Layout;
type SideBarConversation = Required<MenuProps>["items"][number];
type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;
const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

export const ChatPage: React.FC = () => {
  const authenticationContext: AuthenticationContextProp = useAuth();
  const [conversations, setConversations] = useState<SideBarConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [sidebarActiveTab, setSidebarActiveTab] =
    useState<string>("conversation");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const fetchUserFriendList = async () => {
    try {
      const response: ListApiResponse<Relationship> = await GetUserFriends(
        authenticationContext.accessToken
      );
      const friends: UserInformation[] = response.data.map(
        (relationship: Relationship) => {
          return relationship.userA.id ===
            authenticationContext.userInformation.id
            ? relationship.userB
            : relationship.userA;
        }
      );
      console.log("friends:", friends);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        authenticationContext.logoutAction();
      }
    }
  };

  const fetchParticipatedConversation = async () => {
    try {
      const response: ListApiResponse<Membership> =
        await GetParticipatedConversation(authenticationContext.accessToken);
      console.log("response:", response);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        authenticationContext.logoutAction();
      }
    }
  };

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

  const handleProfileButtonClicked = (event: any) => {
    event.preventDefault();
    console.log("Go to profile");
  };

  const handleConversationTabSelected = (event: any) => {
    event.preventDefault();
    setSidebarActiveTab("conversation");
  };

  const handleFriendTabSelected = async (event: any) => {
    event.preventDefault();
    setSidebarActiveTab("friend");
    await fetchUserFriendList();
  };

  return (
    <Layout className="chat-container" hasSider>
      <Sider className="chat-sidebar" width={300}>
        <div className="sidebar-header">
          <div className="user-section">
            <Button
              className="profile-button"
              icon={
                <Avatar
                  className="user-photo"
                  icon={<UserOutlined />}
                  alt="User"
                  size="large"
                />
              }
              shape="circle"
              onClick={handleProfileButtonClicked}
            />
            <p className="full-name">
              {authenticationContext.userInformation
                ? authenticationContext.userInformation.fullName
                : "Loading..."}
            </p>
          </div>
          <div className="tool-box">
            <div className="tab-section">
              <Button
                className={`conversation-tab ${
                  sidebarActiveTab === "conversation" ? "active-tab" : ""
                }`}
                icon={<WechatOutlined />}
                onClick={handleConversationTabSelected}
              >
                Conversations
              </Button>
              <Button
                className={`friend-tab ${
                  sidebarActiveTab === "friend" ? "active-tab" : ""
                }`}
                icon={<UserOutlined />}
                onClick={handleFriendTabSelected}
              >
                Friends
              </Button>
            </div>
            <div className="search-and-new-section">
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                enterButton
              />
              {/* <Button
                icon={<FormOutlined />}
                // onClick={handleNewChatButtonClicked}
              /> */}
            </div>
          </div>
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
