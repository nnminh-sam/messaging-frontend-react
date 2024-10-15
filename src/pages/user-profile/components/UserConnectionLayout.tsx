import "../../../assets/style/pages/user-profile/UserProfileBase.css";
import "../../../assets/style/pages/user-profile/UserConnectionLayout.css";

import { Avatar, Button, Card, GetProps, Input, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import Meta from "antd/es/card/Meta";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import { GetUserFriends } from "../../../services/relationship/relationship.service";
import { UserAddOutlined } from "@ant-design/icons";
import { CreateRelationshipModal } from "../modals/CreateRelationship.modal";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const UserConnectionLayout: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const user: UserInformation = authContext.userInformation;
  const [friends, setFriends] = useState<any[]>([]);
  const [createRelationshipModalVisible, setCreateRelationshipModalVisible] =
    useState<boolean>(false);

  const fetchUserFriendsHandler = async () => {
    const response = await GetUserFriends(authContext.accessToken);
    if ("data" in response) {
      setFriends(response.data);
    } else if ("status" in response && response.status === "error") {
    } else {
    }
    // const friends: UserInformation[] = response.data.map(
    //   (relationship: Relationship) => {
    //     return relationship.userA.id === authContext.userInformation.id
    //       ? relationship.userB
    //       : relationship.userA;
    //   }
    // );
    // console.log("friends:", friends);
  };

  useEffect(() => {
    fetchUserFriendsHandler();
  }, []);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <Layout className="user-base-layout user-connection-layout">
      <Header className="user-connection-header">
        <Card className="user-contact-card" hoverable>
          <Meta
            title={
              <span className="user-contact-title">
                {`${user.firstName} ${user.lastName}`}
                <span className="user-contact-username">{` @${user.username}`}</span>
              </span>
            }
            description={user.email}
          />
        </Card>
      </Header>
      <Content className="user-base-content user-connection-content">
        <h2>Connections</h2>
        <div className="tool-box">
          <Search
            placeholder="Search my friend"
            onSearch={onSearch}
            enterButton
          />
          <Button
            icon={<UserAddOutlined />}
            onClick={() => {
              setCreateRelationshipModalVisible(true);
            }}
          >
            Add friend
          </Button>
          <CreateRelationshipModal
            accessToken={authContext.accessToken}
            logoutAction={authContext.logoutAction}
            visible={createRelationshipModalVisible}
            onClose={() => setCreateRelationshipModalVisible(false)}
            userA={authContext.userInformation.id}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default UserConnectionLayout;
