import React, { useState } from "react";
import { Modal, Input, Button, List, Avatar } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { CreateRelationshipModalProp } from "./types/CreateRelationshipModalProp";
import { FindUsers } from "../../../apis/chat/user.service";

export const CreateRelationshipModal: React.FC<CreateRelationshipModalProp> = ({
  accessToken,
  visible,
  onClose,
  logoutAction,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateRelationship = (userId: string) => {
    console.log("selected user:", userId);
  };

  const handleSearch = async () => {
    if (!accessToken) {
      logoutAction();
      return;
    }
    try {
      const response = await FindUsers(
        accessToken,
        searchTerm,
        1,
        10,
        "firstName",
        "asc"
      );
      console.log("response:", response);
      setUsers(response.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <Modal
      title="Create New Relationship"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <Input
          placeholder="Search by username, email, or name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button
          type="default"
          onClick={handleSearch}
          disabled={!searchTerm.trim()}
          icon={<SearchOutlined />}
        />
      </div>
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => handleCreateRelationship(user.id)}
              >
                Add
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={`${user.firstName} ${user.lastName}`}
              description={user.email}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};
