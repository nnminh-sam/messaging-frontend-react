import { Avatar, Button, List, Modal, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Conversation } from "../../../services/conversation/types/conversation.dto";
import React, { ReactNode, useEffect, useState } from "react";
import { findUserConversationMembershipByConversationId } from "../../../services/user/user.service";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import MembershipApi from "../../../services/membership/membership.api";
import { MembershipRole } from "../../../services/membership/membership.type";

export interface AddUserToConversationModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: Conversation;
}

const DATA_FETCH_PAGE_SIZE = 10;

const AddUserToConversationModal: React.FC<AddUserToConversationModalProps> = ({
  visible,
  onClose,
  conversation,
}) => {
  const authContext: AuthenticationContextProp = useAuth();
  const [userMemberships, setUserMemberships] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const modalCloseProcessHandler = () => {
    setUserMemberships([]);
    setTotalPage(0);
    setCurrentPage(1);
    onClose();
  };

  const fetchUserConversationMembershipByConversationId = async (
    page: number
  ) => {
    const response = await findUserConversationMembershipByConversationId(
      authContext.accessToken,
      conversation.id,
      page,
      DATA_FETCH_PAGE_SIZE,
      "firstName",
      "asc"
    );
    if ("data" in response) {
      setTotalPage(response.metadata.pagination.totalPage);
      setUserMemberships(response.data);
    } else {
      authContext.logoutAction();
    }
  };

  const addUserToConversationButtonPressedHandler = async (userId: string) => {
    const response = await MembershipApi.createMembership({
      user: userId,
      conversation: conversation.id,
      role: MembershipRole.MEMBER,
    });
    if (!response) return;
    await fetchUserConversationMembershipByConversationId(currentPage);
  };

  const PageChangeHandler = (page: number) => {
    if (page === currentPage) {
      return;
    }
    setCurrentPage(page);
    fetchUserConversationMembershipByConversationId(page);
  };

  const userMembershipListDataRenderer: any = (
    user: any,
    index: number
  ): ReactNode => {
    return (
      <List.Item key={user.id}>
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
            </span>
          }
          description={user.email}
        />
        <div className="add-member-options">
          {user.membership && user.membership.status === "PARTICIPATING" && (
            <Button type="text" disabled>
              Added
            </Button>
          )}
          {(!user.membership || user.membership.status === "AWAY") && (
            <Button
              type="primary"
              onClick={() => {
                addUserToConversationButtonPressedHandler(user.id);
              }}
            >
              Add
            </Button>
          )}
        </div>
      </List.Item>
    );
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    fetchUserConversationMembershipByConversationId(currentPage);
  }, [visible]);

  return (
    <Modal
      className="conversation-participant-adder-modal"
      open={visible}
      onCancel={modalCloseProcessHandler}
      footer={[
        <Button key="cancel" onClick={modalCloseProcessHandler}>
          Cancel
        </Button>,
      ]}
    >
      <h2 className="modal-title">Add a new member</h2>
      <List
        dataSource={userMemberships}
        renderItem={userMembershipListDataRenderer}
      />
      <div className="pagination-section">
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            type={currentPage === page ? "primary" : "default"}
            onClick={() => PageChangeHandler(page)}
            // disabled={currentPage === page ? true : false}
          >
            {page}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export default AddUserToConversationModal;
