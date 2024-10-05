import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CreateRelationshipModalProp } from "./types/CreateRelationshipModalProp";

export const CreateRelationshipModal: React.FC<CreateRelationshipModalProp> = ({
  visible,
  onClose,
  onCreateRelationship,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateRelationship = () => {
    onCreateRelationship(searchTerm);
    setSearchTerm("");
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Add logic to perform the search, e.g., call an API to search for users
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
        <Button
          key="submit"
          type="primary"
          onClick={handleCreateRelationship}
          disabled={!searchTerm.trim()}
        >
          Create
        </Button>,
      ]}
    >
      <div style={{ display: "flex", gap: "8px" }}>
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
    </Modal>
  );
};
