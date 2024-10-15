import "../../assets/style/pages/user-profile/UserProfile.css";
import { Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import UserProfileSidebar from "./components/UserProfileSidebar";
import UserProfileLayout from "./components/UserProfileLayout";
import UserConnectionLayout from "./components/UserConnectionLayout";

const UserProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("");

  const selectDefaultTab = () => {
    const profileActiveTabFromLocalStorage: string | null =
      localStorage.getItem("profileActiveTab");
    setSelectedTab(profileActiveTabFromLocalStorage || "profile");
  };

  const getCorrespondingTab = () => {
    switch (selectedTab) {
      case "profile":
        return <UserProfileLayout />;
      case "connections":
        return <UserConnectionLayout />;
      case "conversations":
        return <div />;
      case "media":
        return <div />;
      default:
        <></>;
    }
  };

  useEffect(() => {
    selectDefaultTab();
  }, []);

  return (
    <div className="user-profile-layout-container">
      <Layout hasSider>
        <div className="sidebar">
          <UserProfileSidebar
            selectedItem={selectedTab}
            setSelectedItem={(tabKey: string) => {
              setSelectedTab(tabKey);
              localStorage.setItem("profileActiveTab", tabKey);
            }}
          />
        </div>
        <div className="layout">{getCorrespondingTab()}</div>
      </Layout>
    </div>
  );
};

export default UserProfile;
