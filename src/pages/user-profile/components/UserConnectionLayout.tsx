import "../../../assets/style/pages/user-profile/UserProfileBase.css";
import "../../../assets/style/pages/user-profile/UserConnectionLayout.css";
import {
  Avatar,
  Button,
  Card,
  GetProps,
  Input,
  Layout,
  List,
  Radio,
  RadioChangeEvent,
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React, { ReactNode, useEffect, useState } from "react";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import Meta from "antd/es/card/Meta";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import {
  blockUser,
  deleteRelationship,
  GetUserFriends,
} from "../../../services/relationship/relationship.service";
import {
  DeleteOutlined,
  MessageOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { CreateRelationshipModal } from "../modals/CreateRelationship.modal";
import { findConversationByName } from "../../../services/conversation/conversation.service";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../../components/alert/Alert.component";
import { AlertType } from "../../../components/alert/types/AlertComponent.prop";
import AlertDescription from "../../../components/alert/AlertDescription.component";
import { Relationship } from "../../../services/relationship/types/relationship.dto";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const UserConnectionLayout: React.FC = () => {
  const navigate = useNavigate();
  const authContext: AuthenticationContextProp = useAuth();
  const user: UserInformation = authContext.userInformation;
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertDescriptions, setAlertDescriptions] = useState<ReactNode[]>([]);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.ERROR);
  const [friendRelationships, setFriendRelationships] = useState<any[]>([]);
  const [createRelationshipModalVisible, setCreateRelationshipModalVisible] =
    useState<boolean>(false);
  const [relationshipStatusFilter, setRelationshipStatusFilter] =
    useState<string>("FRIEND");

  const fetchUserFriendsHandler: any = async (statusFilter: string) => {
    const response = await GetUserFriends(authContext.accessToken);
    if ("data" in response) {
      const userFriends = response.data.filter((relationship: any) => {
        if (statusFilter === "REQUESTED") {
          if (
            (relationship.status === "REQUEST_USER_A" &&
              relationship.userA.id === user.id) ||
            (relationship.status === "REQUEST_USER_B" &&
              relationship.userB.id === user.id)
          ) {
            return relationship;
          }
        } else if (statusFilter === "INVITE") {
          if (
            (relationship.status === "REQUEST_USER_A" &&
              relationship.userB.id === user.id) ||
            (relationship.status === "REQUEST_USER_B" &&
              relationship.userA.id === user.id)
          ) {
            return relationship;
          }
        } else if (statusFilter === "BLOCKED") {
          if (
            (relationship.status === "BLOCKED_USER_A" &&
              relationship.userA.id === user.id) ||
            (relationship.status === "BLOCKED_USER_B" &&
              relationship.userB.id === user.id)
          ) {
            return relationship;
          }
        } else if (statusFilter === "FRIEND") {
          if (relationship.status === "FRIENDS") {
            return relationship;
          }
        }
        return null;
      });
      console.log("🚀 ~ userFriends ~ userFriends:", userFriends);
      setFriendRelationships(userFriends);
      return;
    } else if ("status" in response && response.status === "error") {
      setAlertMessage(`${response.message}`);
      setAlertDescriptions(
        response?.details.map((detail: any, index: number) => {
          return (
            <AlertDescription
              message={detail.message}
              fieldName={detail.property}
            />
          );
        })
      );
      setAlertType(AlertType.ERROR);
      setAlertVisible(true);
    } else {
      setAlertMessage("Unexpected error");
      setAlertType(AlertType.ERROR);
      setAlertVisible(true);
    }
  };

  const goToConversationPressHandler: any = async (relationshipId: string) => {
    const response = await findConversationByName(
      authContext.accessToken,
      relationshipId
    );
    if ("data" in response) {
      navigate(`/${response.data.id}`);
      return;
    } else if ("status" in response && response.status === "error") {
      setAlertMessage(`${response.message}`);
      if (response.details) {
        setAlertDescriptions(
          response?.details.map((detail: any, index: number) => {
            return (
              <AlertDescription
                message={detail.message}
                fieldName={detail.property}
              />
            );
          })
        );
      }
      setAlertType(AlertType.ERROR);
      setAlertVisible(true);
    } else {
      setAlertMessage("Unexpected error");
      setAlertType(AlertType.ERROR);
      setAlertVisible(true);
    }
  };

  const unfriendButtonPressedHandler: any = async (relationshipId: string) => {
    const response = await deleteRelationship(
      authContext.accessToken,
      relationshipId
    );
    console.log("data:", response);
    if ("status" in response && response.status === "error") {
      setAlertMessage(`${response.message}`);
      setAlertDescriptions(
        response?.details.map((detail: any, index: number) => {
          return (
            <AlertDescription
              message={detail.message}
              fieldName={detail.property}
            />
          );
        })
      );
      setAlertType(AlertType.ERROR);
      setAlertVisible(true);
    }
  };

  const blockUserButtonPressedHandler: any = async (
    relationship: Relationship
  ) => {
    const targetUser =
      relationship.userA.id === user.id
        ? relationship.userB.id
        : relationship.userA.id;
    const response = await blockUser(authContext.accessToken, {
      blockedBy: authContext.userInformation.id,
      targetUser: targetUser,
    });
    if ("data" in response) {
      setAlertMessage("User blocked successfully");
      setAlertType(AlertType.SUCCESS);
      setAlertVisible(true);
    } else if ("status" in response && response.status === "error") {
      setAlertMessage(`${response.message}`);
      if (response.details) {
        setAlertDescriptions(
          response?.details.map((detail: any, index: number) => {
            return (
              <AlertDescription
                message={detail.message}
                fieldName={detail.property}
              />
            );
          })
        );
      }
      setAlertType(AlertType.ERROR);
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    fetchUserFriendsHandler(relationshipStatusFilter);
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
            onClick={() => {
              unfriendButtonPressedHandler(friendRelationship.id);
              fetchUserFriendsHandler(relationshipStatusFilter);
            }}
          ></Button>
          <Button
            className="block-user-button"
            icon={<StopOutlined />}
            variant="solid"
            color="danger"
            onClick={() => {
              blockUserButtonPressedHandler(friendRelationship);
              fetchUserFriendsHandler(relationshipStatusFilter);
            }}
          ></Button>
        </div>
      </List.Item>
    );
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const relationshipStatusFilterUpdateHandler: any = (e: RadioChangeEvent) => {
    setRelationshipStatusFilter(e.target.value);
    fetchUserFriendsHandler(e.target.value);
  };

  return (
    <Layout className="user-base-layout user-connection-layout">
      {alertVisible && (
        <AlertComponent
          type={alertType}
          message={alertMessage}
          descriptions={alertDescriptions}
          name="form-alert"
          onClose={() => {
            setAlertVisible(false);
          }}
        />
      )}
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
        <Radio.Group
          className="relationship-status-filter"
          onChange={relationshipStatusFilterUpdateHandler}
          value={relationshipStatusFilter}
        >
          <Radio value={"FRIEND"}>Friend</Radio>
          <Radio value={"REQUESTED"}>Requested</Radio>
          <Radio value={"INVITE"}>Invite</Radio>
          <Radio value={"BLOCKED"}>Blocked</Radio>
        </Radio.Group>
        <div className="tool-box">
          <Search placeholder="Search" onSearch={onSearch} enterButton />
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
            onClose={() => {
              setCreateRelationshipModalVisible(false);
              fetchUserFriendsHandler(relationshipStatusFilter);
            }}
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
