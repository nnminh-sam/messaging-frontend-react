import "../../../assets/style/pages/user-profile/UserProfileBase.css";
import "../../../assets/style/pages/user-profile/UserConnectionLayout.css";

import { Avatar, Button, Card, GetProps, Input, Layout, List } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import Meta from "antd/es/card/Meta";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import { GetUserFriends } from "../../../services/relationship/relationship.service";
import {
  DeleteOutlined,
  MessageOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { CreateRelationshipModal } from "../modals/CreateRelationship.modal";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const UserConnectionLayout: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const user: UserInformation = authContext.userInformation;
  const [friendRelationships, setFriendRelationships] = useState<any[]>([]);
  const [createRelationshipModalVisible, setCreateRelationshipModalVisible] =
    useState<boolean>(false);

  const fetchUserFriendsHandler: any = async () => {
    const response = await GetUserFriends(authContext.accessToken);
    if ("data" in response) {
      setFriendRelationships(response.data);
    } else if ("status" in response && response.status === "error") {
      // TODO: add alert
    } else {
      // TODO: add alert
    }
  };

  const goToConversationPressHandler: any = async (relationshipId: string) => {
    console.log(`Go to private conversation of ${relationshipId}`);
  };

  const unfriendButtonPressedHandler: any = async () => {};

  const blockUserButtonPressedHandler: any = async () => {};

  useEffect(() => {
    fetchUserFriendsHandler();
  }, []);

  const renderFriendFromFriendRelationships: any = (
    friendRelationship: any,
    index: number
  ) => {
    const friend: UserInformation =
      friendRelationship.userA.id === user.id
        ? friendRelationship.userB
        : friendRelationship.userA;
    return (
      <List.Item>
        <List.Item.Meta
          className="friend-list-item"
          key={friendRelationship.id}
          avatar={
            <Avatar
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
            />
          }
          title={`${friend.firstName} ${friend.lastName}`}
          description={`${friend.email}`}
        />
        <div className="friend-list-item-tool-box">
          <Button
            className="go-to-conversation-button"
            icon={<MessageOutlined />}
            onClick={() => {
              goToConversationPressHandler(friendRelationship.id);
            }}
            color="primary"
            variant="outlined"
          ></Button>
          <Button
            className="unfriend-button"
            icon={<DeleteOutlined />}
            danger
            onClick={unfriendButtonPressedHandler}
          ></Button>
          <Button
            className="block-user-button"
            icon={<StopOutlined />}
            variant="solid"
            color="danger"
            onClick={blockUserButtonPressedHandler}
          ></Button>
        </div>
      </List.Item>
    );
  };

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
        <h2>Friends</h2>
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
        <List
          className="friend-list"
          dataSource={friendRelationships}
          renderItem={renderFriendFromFriendRelationships}
        />
      </Content>
    </Layout>
  );
};

export default UserConnectionLayout;
