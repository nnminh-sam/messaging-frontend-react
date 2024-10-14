import "../../../assets/style/pages/chat/ConversationDetail.css";

import { Avatar, Button, List, Modal } from "antd";
import {
  AndroidOutlined,
  DeleteOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { ReactNode, useEffect, useState } from "react";
import { Conversation } from "../../../services/conversation/types/conversation.dto";
import { ConversationDetailsModalProp } from "./types/ConversationDetailModalProp";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { fetchConversationParticipants } from "../../../services/membership/membership.service";
import { UserInformation } from "../../../services/user/types/user-information.dto";

const ConversationDetails: React.FC<ConversationDetailsModalProp> = ({
  visible,
  onClose,
  conversation,
}) => {
  const authContext: AuthenticationContextProp = useAuth();
  const [conversationMembers, setConversationMembers] = useState<any[]>([]);

  const modalCloseHandler = () => {
    onClose();
  };

  const fetchConversationParticipantHandler = async () => {
    const response = await fetchConversationParticipants(
      authContext.accessToken,
      {
        conversationId: conversation.id,
        page: 1,
        size: 10,
        sortBy: "firstName",
        orderBy: "asc",
      }
    );
    if ("data" in response) {
      setConversationMembers(response.data);
    } else if ("status" in response && response.status === "error") {
      authContext.logoutAction();
    }
  };

  const conversationMembersDataRender: any = (
    membership: any,
    index: number
  ): ReactNode => {
    const user: UserInformation = membership.user;
    return (
      <List.Item key={membership.id}>
        <List.Item.Meta
          avatar={
            <Avatar
              className="sender-photo"
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              icon={<UserOutlined />}
              size={"large"}
            />
          }
          title={
            <span className="user-full-name">
              {`${user.lastName} ${user.firstName}`}
              {membership.role === "HOST" ? (
                <Button type="text" className="conversation-host-indicator">
                  Host
                </Button>
              ) : (
                <></>
              )}
            </span>
          }
          description={user.email}
        />
        {conversation.type === "DIRECT" ? (
          <></>
        ) : (
          <div className="group-conversation-options">
            <Button className="block-user-button" icon={<AndroidOutlined />}>
              Set as Host
            </Button>
            <Button
              className="remove-user-button"
              icon={<DeleteOutlined />}
              danger
            ></Button>
            <Button
              className="block-user-button"
              icon={<StopOutlined />}
              variant="solid"
              color="danger"
            ></Button>
          </div>
        )}
      </List.Item>
    );
  };

  // * This triggered when the modal is opened
  useEffect(() => {
    if (!visible) {
      return;
    }

    fetchConversationParticipantHandler();
  }, [visible]);

  return (
    <Modal
      className="conversation-detail-component"
      open={visible}
      onCancel={modalCloseHandler}
      footer={[
        <Button key="cancel" onClick={modalCloseHandler}>
          Cancel
        </Button>,
      ]}
    >
      <div className="conversation-container">
        <div className="container-header">
          <h2>{conversation.name}</h2>
          <p>{conversation.description}</p>
        </div>
        <div className="container-body">
          <List
            dataSource={conversationMembers}
            renderItem={conversationMembersDataRender}
          />
        </div>
        <div className="container-footer">
          <Button type="primary">Add member</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConversationDetails;
