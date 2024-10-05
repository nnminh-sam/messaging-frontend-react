import React, { useState } from "react";
import { Modal, Input, Button, List, Avatar, Pagination } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { CreateRelationshipModalProp } from "./types/CreateRelationshipModalProp";
import { FindUsers } from "../../../apis/chat/user.service";
import { ListApiResponse } from "../../../types/list-api-response.dto";
import { UserInformationWithRelationship } from "../../../apis/chat/types/user-information-with-relationship.dto";
import { useAuth } from "../../../components/auth/AuthenticationProvider";

export const CreateRelationshipModal: React.FC<CreateRelationshipModalProp> = ({
  accessToken,
  visible,
  onClose,
  logoutAction,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const pageSize = 5;
  const authContext = useAuth();

  const handleSearchChange: any = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateRelationship: any = (userId: string) => {
    console.log("selected user:", userId);
  };

  const handleSearch = async (page: number = 1) => {
    if (!accessToken) {
      logoutAction();
      return;
    }

    try {
      const response: ListApiResponse<UserInformationWithRelationship> =
        await FindUsers(
          accessToken,
          searchTerm,
          page,
          pageSize,
          "firstName",
          "asc"
        );
      console.log("response:", response);
      setUsers(response.data);
      setTotalUsers(response.metadata.pagination.totalDocument);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(page);
  };

  const handleInternalModalClose = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setTotalUsers(0);
    setUsers([]);
    onClose();
  };

  const renderUserActions: any = (user: UserInformationWithRelationship) => {
    if (user.relationship) {
      switch (user.relationship.status) {
        case "FRIENDS":
          return (
            <Button type="link" disabled={true}>
              Friend
            </Button>
          );
        case "REQUEST_USER_A":
          return user.relationship.userA === authContext.userInformation.id ? (
            <Button type="link" disabled={true}>
              Pending
            </Button>
          ) : (
            [
              <Button type="primary">Accept</Button>,
              <Button type="link" style={{ color: "red" }}>
                Decline
              </Button>,
            ]
          );
        case "REQUEST_USER_B":
          return user.relationship.userB === authContext.userInformation.id ? (
            <Button type="link">Pending</Button>
          ) : (
            [
              <Button type="primary">Accept</Button>,
              <Button type="link" style={{ color: "red" }}>
                Decline
              </Button>,
            ]
          );
        default:
          return (
            <Button color="danger" variant="outlined">
              Error
            </Button>
          );
      }
    }
    return (
      <Button
        color="primary"
        variant="outlined"
        onClick={() => handleCreateRelationship(user.id)}
      >
        Add Friend
      </Button>
    );
  };

  return (
    <Modal
      title="Connections"
      open={visible}
      onCancel={handleInternalModalClose}
      footer={[
        <Button key="cancel" onClick={handleInternalModalClose}>
          Cancel
        </Button>,
      ]}
    >
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button
          type="default"
          onClick={() => handleSearch(1)}
          disabled={!searchTerm.trim()}
          icon={<SearchOutlined />}
        />
      </div>
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <List.Item actions={[renderUserActions(user)]}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={`${user.firstName} ${user.lastName}`}
              description={user.email}
            />
          </List.Item>
        )}
      />
      {users.length > 0 ? (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalUsers}
          onChange={handlePageChange}
          style={{ marginTop: "16px", textAlign: "center" }}
        />
      ) : (
        <></>
      )}
    </Modal>
  );
};
