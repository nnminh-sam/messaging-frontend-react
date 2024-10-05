import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
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
    setSearchTerm(""); // Clear the search term after submission
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
      <Input
        placeholder="Search by username, email, or name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </Modal>
  );
};
