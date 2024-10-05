import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
  WechatOutlined,
  CommentOutlined,
  FormOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { GetProps, MenuProps } from "antd";
import { Avatar, Button, Input, Layout, Menu, theme } from "antd";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { CreateRelationshipModal } from "./modal/CreateRelationship.modal"; // Import the modal
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";
import { GetParticipatedConversation } from "../../apis/chat/membership.service";
import { Membership } from "../../apis/chat/types/membership.dto";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { Conversation } from "../../apis/chat/types/conversation.dto";
import { GetUserFriends } from "../../apis/chat/relationship.service";
import { Relationship } from "../../apis/chat/types/relationship.dto";
import { UserInformation } from "../../apis/chat/types/user-information.dto";
import { CreateNewMessage } from "../../apis/chat/message.service";
import { CreateMessagePayload } from "../../apis/chat/types/dto/create-message-payload.dto";

const { Content, Sider } = Layout;
type SideBarItem = Required<MenuProps>["items"][number];
type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

// TODO: implement on search functionality
const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

export const ChatPage: React.FC = () => {
  const authenticationContext: AuthenticationContextProp = useAuth();
  const [sidebarData, setSidebarData] = useState<SideBarItem[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [targetUser, setTargetUser] = useState<string>("");
  const [sidebarActiveTab, setSidebarActiveTab] =
    useState<string>("conversation");
  const [message, setMessage] = useState<string>("");
  const [
    isCreateRelationshipModalVisible,
    setIsCreateRelationshipModalVisible,
  ] = useState<boolean>(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMessageInputUpdate = (event: any) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

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
      const SideBarItems: SideBarItem[] = friends.map((friend) => ({
        key: friend.id,
        icon: <UserOutlined />,
        label: `${friend.lastName} ${friend.firstName}`,
      }));
      setSidebarData(SideBarItems);
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
      console.log("conversations:", response);
      const conversations: Conversation[] = response.data.map((membership) => {
        return membership.conversation;
      });
      const SideBarItems: SideBarItem[] = conversations.map((conversation) => {
        if (!conversation || !conversation.name) {
          authenticationContext.logoutAction();
        }

        let privateConversationId: string | null = null;
        const match = conversation.name.match(/\[(.*?)\]/);
        if (match && match[1]) {
          privateConversationId = match[1];
        }

        return {
          key: conversation.id,
          icon: <CommentOutlined />,
          label: conversation.name,
        };
      });
      setSidebarData(SideBarItems);
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
    const activeConversationFromLocalStorage: string | null =
      localStorage.getItem("activeConversation");
    if (activeConversationFromLocalStorage) {
      setActiveConversation(activeConversationFromLocalStorage);
    }

    fetchParticipatedConversation();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      const selectedItem = sidebarData.find(
        (item) => item?.key === activeConversation
      );
      if (selectedItem) {
        setActiveConversation(selectedItem.key as string);
      }
    }
  }, [sidebarData, activeConversation]);

  const handleSidebarItemSelected: MenuProps["onClick"] = (event: any) => {
    if (sidebarActiveTab === "conversation") {
      console.log("Choosing conversation:", event.key);
      if (event.key === activeConversation) {
        return;
      }
      setActiveConversation(event.key);
      localStorage.setItem("activeConversation", event.key);
    } else {
      console.log("Choosing user:", event.key);
      setTargetUser(event.key);
    }
  };

  // TODO: Implement user profile page
  const handleProfileButtonClicked = (event: any) => {
    event.preventDefault();
    console.log("Go to profile");
  };

  const handleConversationTabSelected = async (event: any) => {
    event.preventDefault();
    if (sidebarActiveTab === "conversation") return;
    setSidebarActiveTab("conversation");
    await fetchParticipatedConversation();
  };

  const handleFriendTabSelected = async (event: any) => {
    event.preventDefault();
    if (sidebarActiveTab === "friend") return;
    setSidebarActiveTab("friend");
    await fetchUserFriendList();
  };

  const handleCreateNewItemButtonClicked = async (event: any) => {
    event.preventDefault();
    if (sidebarActiveTab === "conversation") {
      console.log("Create new conversation");
    } else {
      console.log("Create new relationship");
      setIsCreateRelationshipModalVisible(true);
    }
  };

  const handleSendMessageButtonClicked = async (event: any) => {
    event.preventDefault();
    try {
      const payload: CreateMessagePayload = {
        sendBy: authenticationContext.userInformation.id,
        conversation: activeConversation,
        message,
      };
      console.log("sending new message:", payload);
      const response = await CreateNewMessage(
        authenticationContext.accessToken,
        payload
      );
      console.log("response:", response);
      setMessage("");
    } catch (error: any) {
      console.log("error:", error);
    }
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
              <Button
                className="create-new-item"
                icon={
                  sidebarActiveTab === "friend" ? (
                    <UserAddOutlined />
                  ) : (
                    <FormOutlined />
                  )
                }
                onClick={handleCreateNewItemButtonClicked}
              />
            </div>
          </div>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          items={sidebarData}
          onClick={handleSidebarItemSelected}
          selectedKeys={[activeConversation]}
        />
      </Sider>
      <Layout className="conversation-container">
        <div
          className="messaging-section"
          hidden={activeConversation ? false : true}
        >
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
            className="message-input-section"
            style={{
              background: colorBgContainer,
            }}
          >
            <div className="texting-features">
              <Button icon={<SmileOutlined />} />
              <Button icon={<PaperClipOutlined />} />
            </div>
            <Input
              className="text-input"
              placeholder="Message"
              onChange={handleMessageInputUpdate}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessageButtonClicked}
            />
          </div>
        </div>
      </Layout>
      <CreateRelationshipModal
        accessToken={authenticationContext.accessToken}
        logoutAction={authenticationContext.logoutAction}
        visible={isCreateRelationshipModalVisible}
        onClose={() => setIsCreateRelationshipModalVisible(false)}
        userA={authenticationContext.userInformation.id}
      />
    </Layout>
  );
};
