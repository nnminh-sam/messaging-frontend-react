import "../../../assets/style/pages/user-profile/UserProfileSidebar.css";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { UserSidebarData } from "./types/UserSidebarData";
import { UserSidebarProp } from "./types/UserSidebar.prop";

const UserProfileSidebar: React.FC<UserSidebarProp> = ({
  selectedItem,
  setSelectedItem,
}) => {
  const sidebarData: UserSidebarData[] = [
    {
      key: "profile",
      label: "Profile",
    },
    {
      key: "connections",
      label: "Connections",
    },
    {
      key: "conversation",
      label: "Conversations",
    },
    {
      key: "media",
      label: "Media",
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
      };
    });
  };

  return (
    <Sider className="user-profile-sidebar">
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
