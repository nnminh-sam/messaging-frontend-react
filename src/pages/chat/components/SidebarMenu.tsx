import { Avatar, Button, Input, Layout, Menu, MenuProps, theme } from "antd";
import {
  UserOutlined,
  WechatOutlined,
  CommentOutlined,
  FormOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { Conversation } from "../../../services/conversation/types/conversation.dto";
import { ListApiResponse } from "../../../types/list-api-response.dto";
import { Membership } from "../../../services/membership/types/membership.dto";
import { GetParticipatedConversation } from "../../../services/membership/membership.service";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import { Relationship } from "../../../services/relationship/types/relationship.dto";
import { GetUserFriends } from "../../../services/relationship/relationship.service";
import { CreateRelationshipModal } from "../modal/CreateRelationship.modal";

type SideBarItem = Required<MenuProps>["items"][number];

export const SidebarMenu: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const [sidebarActiveTab, setSidebarActiveTab] =
    useState<string>("conversation");
  const [sidebarData, setSidebarData] = useState<SideBarItem[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [targetUser, setTargetUser] = useState<string>("");
  const [
    isCreateRelationshipModalVisible,
    setIsCreateRelationshipModalVisible,
  ] = useState<boolean>(false);

  const fetchUserMembership: any = async () => {
    const response: ListApiResponse<Membership> =
      await GetParticipatedConversation(authContext.accessToken);
    return response.data;
  };

  const fetchFriendList: any = async () => {
    try {
      const response: ListApiResponse<Relationship> = await GetUserFriends(
        authContext.accessToken
      );
      let friends: UserInformation[] = [];
      response.data.forEach((relationship: Relationship) => {
        if (relationship.status === "FRIENDS") {
          friends.push(
            relationship.userA.id === authContext.userInformation.id
              ? relationship.userB
              : relationship.userA
          );
        }
      });
      return friends;
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        authContext.logoutAction();
      }
      return [];
    }
  };

  const setSideBarConversations: any = (memberships: Membership[]) => {
    const SideBarItems: SideBarItem[] = memberships.map((membership) => {
      const conversation: Conversation = membership.conversation;
      if (!conversation || !conversation.name) {
        authContext.logoutAction();
      }

      let conversationLabel: string = conversation.name;
      let privateConversationId: string | null = null;
      const match = conversation.name.match(/\[(.*?)\]/);
      if (match && match[1]) {
        privateConversationId = match[1];
      }
      if (privateConversationId && membership.partner) {
        conversationLabel = `${membership.partner.lastName} ${membership.partner.firstName}`;
      }

      return {
        key: conversation.id,
        icon: <CommentOutlined />,
        label: conversationLabel,
      };
    });
    setSidebarData(SideBarItems);
  };

  const setSideBarFriends: any = (friends: UserInformation[]) => {
    const SideBarItems: SideBarItem[] = friends.map((friend) => ({
      key: friend.id,
      icon: <UserOutlined />,
      label: `${friend.lastName} ${friend.firstName}`,
    }));
    setSidebarData(SideBarItems);
  };

  const handleConversationTabSelected: any = async (event?: any) => {
    event.preventDefault();
    if (sidebarActiveTab === "conversation") return;
    console.log("clicked");
    setSidebarActiveTab("conversation");
    const conversations: Conversation[] = await fetchUserMembership();
    setSideBarConversations(conversations);
  };

  const handleFriendTabSelected: any = async (event?: any) => {
    event.preventDefault();
    if (sidebarActiveTab === "friend") return;
    setSidebarActiveTab("friend");
    const friends: UserInformation[] = await fetchFriendList();
    setSideBarFriends(friends);
  };

  useEffect(() => {
    const execDefaultProcess: any = async () => {
      setSideBarConversations(await fetchUserMembership());
    };

    execDefaultProcess();
  }, []);

  const handleCreateNewItemButtonClicked: any = async (event: any) => {
    event.preventDefault();
    if (sidebarActiveTab === "conversation") {
      console.log("Create new conversation");
    } else {
      console.log("Create new relationship");
      setIsCreateRelationshipModalVisible(true);
    }
  };

  // TODO: Implement user profile page
  const handleProfileButtonClicked = (event: any) => {
    event.preventDefault();
    console.log("Go to profile");
  };

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

  return (
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
            {authContext.userInformation
              ? authContext.userInformation.fullName
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
              Relationships
            </Button>
          </div>
          <div className="search-and-new-section">
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
            >
              New {sidebarActiveTab === "friend" ? "friend" : "conversation"}
            </Button>
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
      <CreateRelationshipModal
        accessToken={authContext.accessToken}
        logoutAction={authContext.logoutAction}
        visible={isCreateRelationshipModalVisible}
        onClose={() => setIsCreateRelationshipModalVisible(false)}
        userA={authContext.userInformation.id}
      />
    </Sider>
  );
};
