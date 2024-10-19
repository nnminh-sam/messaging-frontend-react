import "../../../assets/style/pages/chat/ConversationDetail.css";

import { Avatar, Button, List, Modal, notification } from "antd";
import {
  AndroidOutlined,
  DeleteOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { ReactNode, useEffect, useState } from "react";
import { ConversationDetailsModalProp } from "./types/ConversationDetailModalProp";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import AddUserToConversationModal from "./AddUserToConversation.modal";
import { PaginationDto } from "../../../services/api/api.type";
import MembershipApi from "../../../services/membership/membership.api";
import { Membership } from "../../../services/membership/membership.type";

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
    conversationId: string,
    paginationDto: PaginationDto
  ) => {
    const response = await MembershipApi.getConversationMembers(
      conversationId,
      paginationDto
    );
    if (!response) {
      authContext.logoutAction();
    }
    console.log("members: ", response.data);

    setConversationMembers(response.data);
    setTotalPage(response.metadata.pagination.totalPage);
  };

  const setUserAsHostHandler = async (membership: Membership) => {
    const response = await MembershipApi.changeHost({
      newHost: membership.user.id,
      conversation: membership.conversation.id,
    });
    if (!response) return;
    notification.success({
      message: "Host changed",
    });
  };

  const removeUserHandler = async (membershipId: string) => {
    const response = await MembershipApi.deleteMembership(membershipId);
    if (!response) return;
  };

  const banUserHandler = async (membership: Membership) => {
    const response = await MembershipApi.banUser({
      conversation: membership.conversation.id,
      targetUser: membership.user.id,
    });
    if (!response) return;
  };

  const PageChangeHandler = (page: number) => {
    if (page === currentPage) {
      return;
    }

    setCurrentPage(page);
    fetchConversationParticipantHandler(conversation.id, {
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
                <Button
                  color="default"
                  variant="text"
                  className="conversation-host-indicator"
                  disabled
                >
                  Host
                </Button>
              ) : (
                <></>
              )}
            </span>
          }
          description={user.email}
        />
        {conversation.type !== "DIRECT" &&
          membership.status !== "BANNED" &&
          membership.role !== "HOST" &&
          conversation.host === authContext.userInformation.id && (
            <div className="group-conversation-options">
              <Button
                className="block-user-button"
                icon={<AndroidOutlined />}
                onClick={async () => {
                  await setUserAsHostHandler(membership);
                  await fetchConversationParticipantHandler(conversation.id, {
                    page: currentPage,
                    size: USER_LIST_SIZE,
                    sortBy: "firstName",
                    orderBy: "asc",
                  });
                }}
              >
                Set as Host
              </Button>
              <Button
                className="remove-user-button"
                icon={<DeleteOutlined />}
                danger
                onClick={async () => {
                  await removeUserHandler(membership.id);
                  await fetchConversationParticipantHandler(conversation.id, {
                    page: currentPage,
                    size: USER_LIST_SIZE,
                    sortBy: "firstName",
                    orderBy: "asc",
                  });
                }}
              ></Button>
              <Button
                className="block-user-button"
                icon={<StopOutlined />}
                variant="solid"
                color="danger"
                onClick={async () => {
                  await banUserHandler(membership);
                  await fetchConversationParticipantHandler(conversation.id, {
                    page: currentPage,
                    size: USER_LIST_SIZE,
                    sortBy: "firstName",
                    orderBy: "asc",
                  });
                }}
              ></Button>
            </div>
          )}
        {conversation.type !== "DIRECT" && membership.status === "BANNED" && (
          <Button
            onClick={async () => {
              await MembershipApi.unbanUser({
                conversation: membership.conversation.id,
                targetUser: membership.user.id,
              });
              await fetchConversationParticipantHandler(conversation.id, {
                page: currentPage,
                size: USER_LIST_SIZE,
                sortBy: "firstName",
                orderBy: "asc",
              });
            }}
          >
            Unban
          </Button>
        )}
      </List.Item>
    );
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    fetchConversationParticipantHandler(conversation.id, {
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
                  fetchConversationParticipantHandler(conversation.id, {
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
