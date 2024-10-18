import "../../../assets/style/pages/chat/SidebarMenu.css";
import { Button, GetProps, Input, Menu, MenuProps } from "antd";
import {
  UserOutlined,
  CommentOutlined,
  FormOutlined,
  LogoutOutlined,
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
import { useNavigate } from "react-router-dom";
import { ErrorResponse } from "../../../types/error-response.dto";

type SideBarDataType = Required<MenuProps>["items"][number];

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

export interface SidebarMenuProp {
  activeConversation: string;
  setActiveConversation: (conversationId: string) => void;
  setActiveConversationMembership: (membership: Membership) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProp> = ({
  activeConversation,
  setActiveConversation,
  setActiveConversationMembership,
}) => {
  const navigate = useNavigate();
  const authContext: AuthenticationContextProp = useAuth();
  const [sidebarData, setSidebarData] = useState<SideBarDataType[]>([]);
  const [participatedMembership, setParticipatedMembership] = useState<
    Membership[]
  >([]);
  const [createConversationModalVisible, setCreateConversationModalVisible] =
    useState<boolean>(false);

  const fetchParticipatedConversation: any = async () => {
    const response: ListApiResponse<Membership> | ErrorResponse =
      await GetParticipatedConversation(authContext.accessToken);

    if ("data" in response) {
      setParticipatedMembership(response.data);
      setSidebarData(
        response.data.map((membership: Membership): any => {
          console.log("membership:", membership);
          const conversation: Conversation = membership.conversation;
          if (conversation.type !== "DIRECT") {
            return {
              key: conversation.id,
              icon: <CommentOutlined />,
              label: conversation.name,
            };
          }

          const partnerFullName: string = `${membership.partner?.lastName} ${membership.partner?.firstName}`;
          return {
            key: conversation.id,
            icon: <CommentOutlined />,
            label: partnerFullName,
          };
        })
      );
      return;
    }
    authContext.logoutAction();
  };

  useEffect(() => {
    fetchParticipatedConversation();
  }, []);

  // TODO: update the conversation content to show the searching conversations
  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    console.log("value:", value);
  };

  const handleConversationSelected: MenuProps["onClick"] = (event: any) => {
    if (event.key === activeConversation) return;

    const membership: Membership | undefined = participatedMembership.find(
      (membership: Membership) => {
        return membership.conversation.id === event.key ? membership : null;
      }
    );
    if (!membership) {
      authContext.logoutAction();
      return;
    }

    localStorage.setItem("activeConversation", event.key);
    localStorage.setItem("lastMembershipId", membership.id);
    setActiveConversation(event.key);
    setActiveConversationMembership(membership as Membership);
    navigate(`/${event.key}`, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("activeConversation");
    setActiveConversation("");
    authContext.logoutAction();
  };

  return (
    <Sider className="chat-sidebar" width={300}>
      <div className="sidebar-header">
        <div className="user-section">
          <Button
            className="profile-button"
            icon={<UserOutlined />}
            shape="circle"
            onClick={() => navigate("/profile")}
            variant="outlined"
          />
          <p className="full-name">
            {authContext.userInformation
              ? authContext.userInformation.fullName
              : "Loading..."}
          </p>
          <Button
            className="logout-button"
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            danger
          />
        </div>
        <div className="tool-box">
          <div className="search-and-new-section">
            <Button
              className="create-new-item"
              icon={<FormOutlined />}
              onClick={() => setCreateConversationModalVisible(true)}
              variant="outlined"
            />
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
              name="conversation-search-box"
            />
          </div>
        </div>
      </div>
      <Menu
        className="conversation-list"
        mode="inline"
        theme="dark"
        items={sidebarData}
        onClick={handleConversationSelected}
        selectedKeys={[activeConversation]}
      />
      <CreateConversationModal
        visible={createConversationModalVisible}
        onClose={() => {
          setCreateConversationModalVisible(false);
          fetchParticipatedConversation();
        }}
        onSuccess={fetchParticipatedConversation}
      />
    </Sider>
  );
};
