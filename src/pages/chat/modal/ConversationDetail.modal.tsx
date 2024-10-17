import "../../../assets/style/pages/chat/ConversationDetail.css";

import { Avatar, Button, GetProps, Input, List, Modal } from "antd";
import {
  AndroidOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { ReactNode, useEffect, useState } from "react";
import { ConversationDetailsModalProp } from "./types/ConversationDetailModalProp";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { fetchConversationParticipants } from "../../../services/membership/membership.service";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import { FetchConversationParticipant } from "../../../services/membership/types/fetch-conversation-participant.dto";
import AddUserToConversationModal from "./AddUserToConversation.modal";

const USER_LIST_SIZE = 10;

const ConversationDetails: React.FC<ConversationDetailsModalProp> = ({
  visible,
  onClose,
  conversation,
  directConversationName,
}) => {
  const authContext: AuthenticationContextProp = useAuth();
  const [conversationMembers, setConversationMembers] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addMemberModalVisibility, setAddMemberModalVisibility] =
    useState<boolean>(false);

  const modalCloseHandler = () => {
    setAddMemberModalVisibility(false);
    setConversationMembers([]);
    setCurrentPage(1);
    setTotalPage(0);
    onClose();
  };

  const fetchConversationParticipantHandler = async (
    payload: FetchConversationParticipant
  ) => {
    const response = await fetchConversationParticipants(
      authContext.accessToken,
      payload
    );
    if ("data" in response) {
      setConversationMembers(response.data);
      setTotalPage(response.metadata.pagination.totalPage);
    } else if ("status" in response && response.status === "error") {
      authContext.logoutAction();
    }
  };

  const setUserAsHostHandler = async () => {};

  const removeUserHandler = async () => {};

  const banUserHandler = async () => {};

  const PageChangeHandler = (page: number) => {
    if (page === currentPage) {
      return;
    }

    setCurrentPage(page);
    fetchConversationParticipantHandler({
      conversationId: conversation.id,
      page: page,
      size: USER_LIST_SIZE,
      sortBy: "firstName",
      orderBy: "asc",
    });
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
            {membership.role !== "HOST" &&
            conversation.host === authContext.userInformation.id ? (
              <>
                <Button
                  className="block-user-button"
                  icon={<AndroidOutlined />}
                  onClick={setUserAsHostHandler}
                >
                  Set as Host
                </Button>
                <Button
                  className="remove-user-button"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={removeUserHandler}
                ></Button>
                <Button
                  className="block-user-button"
                  icon={<StopOutlined />}
                  variant="solid"
                  color="danger"
                  onClick={banUserHandler}
                ></Button>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </List.Item>
    );
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    fetchConversationParticipantHandler({
      conversationId: conversation.id,
      page: currentPage,
      size: USER_LIST_SIZE,
      sortBy: "firstName",
      orderBy: "asc",
    });
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
          <h2>
            {conversation.type !== "DIRECT"
              ? conversation.name
              : `Direct conversation with ${directConversationName}`}
          </h2>
        </div>
        <div className="container-body">
          <h3>Participants</h3>
          <List
            dataSource={conversationMembers}
            renderItem={conversationMembersDataRender}
          />
          <div className="pagination-section">
            {conversation.type === "DIRECT" ? (
              <></>
            ) : (
              Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  type={currentPage === page ? "primary" : "default"}
                  onClick={() => PageChangeHandler(page)}
                >
                  {page}
                </Button>
              ))
            )}
          </div>
        </div>
        <div className="container-footer">
          {conversation.host === authContext.userInformation.id &&
          conversation.type !== "DIRECT" ? (
            <>
              <Button
                type="primary"
                onClick={() => setAddMemberModalVisibility(true)}
              >
                Add member
              </Button>
              <AddUserToConversationModal
                visible={addMemberModalVisibility}
                conversation={conversation}
                onClose={() => {
                  setAddMemberModalVisibility(false);
                  fetchConversationParticipantHandler({
                    conversationId: conversation.id,
                    page: currentPage,
                    size: USER_LIST_SIZE,
                    sortBy: "firstName",
                    orderBy: "asc",
                  });
                }}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConversationDetails;
