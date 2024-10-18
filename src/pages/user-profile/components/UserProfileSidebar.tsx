import "../../../assets/style/pages/user-profile/UserProfileSidebar.css";
import { Button, Menu } from "antd";
import {
  ArrowLeftOutlined,
  LoginOutlined,
  MessageOutlined,
  PictureOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { UserSidebarData } from "./types/UserSidebarData";
import { UserSidebarProp } from "./types/UserSidebar.prop";
import { useNavigate } from "react-router-dom";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";

const UserProfileSidebar: React.FC<UserSidebarProp> = ({
  selectedItem,
  setSelectedItem,
}) => {
  const navigate = useNavigate();
  const authContext: AuthenticationContextProp = useAuth();
  const sidebarData: UserSidebarData[] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "connections",
      label: "Connections",
      icon: <TeamOutlined />,
    },
    {
      key: "conversation",
      label: "Conversations",
      icon: <MessageOutlined />,
    },
    {
      key: "media",
      label: "Media",
      icon: <PictureOutlined />,
    },
  ];

  const sidebarItemClickedHandler = (event: any) => {
    if (event.key === selectedItem) {
      return;
    }
    setSelectedItem(event.key);
  };

  const sidebarItemRenderer = (sidebarData: UserSidebarData[]) => {
    return sidebarData.map((data: UserSidebarData, index: number) => {
      return {
        key: data.key,
        label: data.label,
        icon: data.icon,
      };
    });
  };

  return (
    <Sider className="user-profile-sidebar">
      <div className="sidebar-header">
        <Button
          variant="outlined"
          color="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
        />
        <Button
          danger
          icon={<LoginOutlined />}
          onClick={() => authContext.logoutAction()}
        />
      </div>
      <Menu
        mode="inline"
        items={sidebarItemRenderer(sidebarData)}
        onClick={sidebarItemClickedHandler}
        selectedKeys={[selectedItem]}
      />
    </Sider>
  );
};

export default UserProfileSidebar;
