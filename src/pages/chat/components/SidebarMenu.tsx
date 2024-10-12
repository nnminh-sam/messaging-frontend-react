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
import { CreateConversationModal } from "../modal/CreateConversation.modal";

type SideBarItem = Required<MenuProps>["items"][number];

export const SidebarMenu: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const [sidebarData, setSidebarData] = useState<SideBarItem[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [
    isCreateConversationModalVisible,
    setIsCreateConversationModalVisible,
  ] = useState<boolean>(false);

  const fetchParticipatedConversation: any = async () => {
    const userMembershipWithConversations: ListApiResponse<Membership> =
      await GetParticipatedConversation(authContext.accessToken);
    const SideBarItems: SideBarItem[] =
      userMembershipWithConversations.data.map((membership) => {
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

  useEffect(() => {
    const execDefaultProcess: any = async () => {
      await fetchParticipatedConversation();
    };

    execDefaultProcess();
  }, []);

  const handleCreateNewItemButtonClicked: any = async (event: any) => {
    event.preventDefault();
    setIsCreateConversationModalVisible(true);
  };

  // TODO: Implement user profile page
  const handleProfileButtonClicked = (event: any) => {
    event.preventDefault();
    console.log("Go to profile");
  };

  const handleSidebarItemSelected: MenuProps["onClick"] = (event: any) => {
    if (event.key === activeConversation) {
      return;
    }
    console.log("Choosing conversation:", event.key);
    setActiveConversation(event.key);
    localStorage.setItem("activeConversation", event.key);
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
          <div className="tab-section"></div>
          <div className="search-and-new-section">
            <Button
              className="create-new-item"
              icon={<FormOutlined />}
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
      <CreateConversationModal
        visible={isCreateConversationModalVisible}
        onClose={async () => {
          setIsCreateConversationModalVisible(false);
        }}
        onSuccess={fetchParticipatedConversation} // Pass the fetch function here
      />
    </Sider>
  );
};
