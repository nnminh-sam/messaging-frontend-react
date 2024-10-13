import "../../../assets/style/pages/chat/ConversationDetail.css";

import { Button, Modal } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Conversation } from "../../../services/conversation/types/conversation.dto";
import { ConversationDetailsModalProp } from "./types/ConversationDetailModalProp";

const ConversationDetails: React.FC<ConversationDetailsModalProp> = ({
  visible,
  onClose,
  conversation,
}) => {
  const modalCloseHandler = () => {
    onClose();
  };

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
        <h2>{conversation.name}</h2>
        <p>{conversation.description}</p>
      </div>
    </Modal>
  );
};

export default ConversationDetails;
