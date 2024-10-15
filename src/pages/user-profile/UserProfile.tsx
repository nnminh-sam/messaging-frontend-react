import "../../assets/style/pages/user-profile/UserProfile.css";
import { Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";
import { UserInformation } from "../../services/user/types/user-information.dto";
import UserProfileSidebar from "./components/UserProfileSidebar";
import UserProfileLayout from "./components/UserProfileLayout";

const UserProfile: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const [selectedTab, setSelectedTab] = useState("profile");

  const getCorrespondingTab = (tabKey: string) => {
    switch (tabKey) {
      case "profile":
        return <UserProfileLayout />;
      case "connections":
        return <div />;
      case "conversations":
        return <div />;
      case "media":
        return <div />;
      default:
        <></>;
    }
  };

  return (
    <div className="user-profile-layout-container">
      <Layout hasSider>
        <div className="sidebar">
          <UserProfileSidebar
            selectedItem={selectedTab}
            setSelectedItem={setSelectedTab}
          />
        </div>
        <div className="layout">{getCorrespondingTab(selectedTab)}</div>
      </Layout>
    </div>
  );
};

export default UserProfile;
