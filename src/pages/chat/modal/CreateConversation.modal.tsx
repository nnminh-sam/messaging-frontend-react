import React, { useState } from "react";
import { Button, Form, Input, Modal, Alert } from "antd";
import { CreateConversationModalProp } from "./types/CreateConversationModalProp";
import { CreateConversation } from "../../../services/conversation/conversation.service";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { CreateConversationDto } from "../../../services/conversation/types/create-conversation.dto";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import MembershipApi from "../../../services/membership/membership.api";
import { MembershipRole } from "../../../services/membership/membership.type";

export const CreateConversationModal: React.FC<
  CreateConversationModalProp & { onSuccess: () => void }
> = ({ visible, onClose, onSuccess }) => {
  const authContext: AuthenticationContextProp = useAuth();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [createConversationPayload, setCreateConversationPayload] =
    useState<CreateConversationDto>({
      name: "",
      description: "",
      host: "",
      createdBy: "",
      type: "GROUP",
    });

  const handleInternalModalClose = () => {
    setErrorMessages([]);
    setCreateConversationPayload({
      name: "",
      description: "",
      host: "",
      createdBy: "",
      type: "GROUP",
    });
    onClose();
  };

  const handleCreateConversationFormUpdate = (event: any) => {
    event.preventDefault();
    setCreateConversationPayload({
      ...createConversationPayload,
      [event.target.name]: event.target.value,
    });
    setErrorMessages([]);
  };

  const handleCreateButtonClicked = async () => {
    createConversationPayload.host = authContext.userInformation.id;
    createConversationPayload.createdBy = authContext.userInformation.id;
    const createConversationResponse = await CreateConversation(
      authContext.accessToken,
      createConversationPayload
    );
    if (
      "status" in createConversationResponse &&
      createConversationResponse.status === "error"
    ) {
      const errorDetails = createConversationResponse.details.map(
        (detail: any) => `${detail.property}: ${detail.message}`
      );
      setErrorMessages(errorDetails);
      return;
    }

    if ("data" in createConversationResponse) {
      const createdConversation = createConversationResponse.data;
      const response = await MembershipApi.createMembership({
        user: authContext.userInformation.id,
        conversation: createdConversation.id,
        role: MembershipRole.HOST,
      });
      if (!response) {
        const errorDetails = response.details.map(
          (detail: any) => `${detail.property}: ${detail.message}`
        );
        setErrorMessages(errorDetails);
        return;
      }
      handleInternalModalClose();
      onSuccess();
    }
  };

  return (
    <Modal
      title="Create New Conversation"
      open={visible}
      onCancel={handleInternalModalClose}
      footer={[
        <Button key="cancel" onClick={handleInternalModalClose}>
          Cancel
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Conversation Name" required>
          <Input
            name="name"
            value={createConversationPayload.name}
            onChange={handleCreateConversationFormUpdate}
            placeholder="Conversation name"
          />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea
            name="description"
            value={createConversationPayload.description}
            onChange={handleCreateConversationFormUpdate}
            placeholder="Description"
            rows={4}
          />
        </Form.Item>

        <Button type="primary" onClick={handleCreateButtonClicked}>
          Create New Conversation
        </Button>
        {errorMessages.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            {errorMessages.map((error, index) => (
              <Alert
                key={index}
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: "5px" }}
              />
            ))}
          </div>
        )}
      </Form>
    </Modal>
  );
};
