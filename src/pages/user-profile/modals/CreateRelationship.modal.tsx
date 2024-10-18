import React, { useState } from "react";
import { Modal, Input, Button, List, Avatar, Pagination } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { CreateRelationshipModalProp } from "./types/CreateRelationshipModalProp";
import { FindUsers } from "../../../services/user/user.service";
import { ListApiResponse } from "../../../types/list-api-response.dto";
import { UserInformationWithRelationship } from "../../../services/user/types/user-information-with-relationship.dto";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { CreateRelationshipPayload } from "../../../services/relationship/types/create-relationship-payload.dto";
import {
  AcceptFriendship,
  CreateNewRelationship,
  DeclineRelationship,
} from "../../../services/relationship/relationship.service";
import { ApiResponse } from "../../../types/api-response.dto";
import { Relationship } from "../../../services/relationship/types/relationship.dto";

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

  const handleCreateRelationship: any = async (userId: string) => {
    const payload: CreateRelationshipPayload = {
      userA: authContext.userInformation.id,
      userB: userId,
      status: "REQUEST_USER_A",
    };
    try {
      const response: ApiResponse<Relationship> = await CreateNewRelationship(
        authContext.accessToken,
        payload
      );
      handleSearch(currentPage);
    } catch (error) {
      authContext.logoutAction();
    }
  };

  const handleAcceptRequestRelationship: any = async (
    relationshipId: string
  ) => {
    const response = await AcceptFriendship(
      authContext.accessToken,
      relationshipId
    );
    if ("data" in response) {
      handleSearch(currentPage);
    } else {
      authContext.loginAction();
    }
  };

  const handleDeclineRequestRelationship: any = async (
    relationshipId: string
  ) => {
    try {
      const response: ApiResponse<Relationship> = await DeclineRelationship(
        authContext.accessToken,
        relationshipId
      );
      handleSearch(currentPage);
    } catch (error) {
      console.log("error:", error);
    }
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
      setUsers(response.data);
      setTotalUsers(response.metadata.pagination.totalDocument);
    } catch (error) {
      authContext.logoutAction();
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
    console.log("data:", user);
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
              <Button
                type="primary"
                onClick={() => {
                  handleAcceptRequestRelationship(user.relationship.id);
                }}
              >
                Accept
              </Button>,
              <Button
                type="link"
                style={{ color: "red" }}
                onClick={() => {
                  handleDeclineRequestRelationship(user.relationship.id);
                }}
              >
                Decline
              </Button>,
            ]
          );
        case "REQUEST_USER_B":
          return user.relationship.userB === authContext.userInformation.id ? (
            <Button type="link">Pending</Button>
          ) : (
            [
              <Button
                type="primary"
                onClick={() => {
                  handleAcceptRequestRelationship(user.relationship.id);
                }}
              >
                Accept
              </Button>,
              <Button
                type="link"
                style={{ color: "red" }}
                onClick={() => {
                  handleDeclineRequestRelationship(user.relationship.id);
                }}
              >
                Decline
              </Button>,
            ]
          );
        case "AWAY":
          return (
            <Button
              color="primary"
              variant="outlined"
              onClick={() => handleCreateRelationship(user.id)}
            >
              Add Friend
            </Button>
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
              key={user.id}
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
