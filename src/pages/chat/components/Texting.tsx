import "../../../assets/style/pages/chat/Texting.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { List, Input, Button, Upload, Layout } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CreateNewMessage } from "../../../services/message/message.service";
import { CreateMessagePayload } from "../../../services/message/types/create-message-payload.dto";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";

const { Content } = Layout;

const Texting: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    // Logic to fetch messages for the conversation can be added here
    console.log("Fetching messages for conversation ID:", conversationId);
    // Example: fetchMessages(conversationId);
    // For demonstration, we'll use dummy messages
    setMessages(["Hello!", "How are you?", "This is a sample message."]);
  }, [conversationId]);

  const handleSendMessage = async (event: any) => {
    event.preventDefault();

    if (!newMessage.trim() || !conversationId) {
      return;
    }

    try {
      const payload: CreateMessagePayload = {
        sendBy: authContext.userInformation.id,
        conversation: conversationId,
        message: newMessage,
      };
      const response = await CreateNewMessage(authContext.accessToken, payload);
      console.log("response:", response);
      setNewMessage("");
    } catch (error: any) {
      alert(`An error appeared: ${error.response.data.message}`);
      console.log("error:", error);
    }
  };

  const handleUploadImage = (file: any) => {
    console.log("Uploaded file:", file);

    return false;
  };

  return (
    <Layout className="texting-component">
      <Content className="message-container">
        <h2>Conversation ID: {conversationId}</h2>
        <List
          bordered
          dataSource={messages}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Content>
      <div className="texting-tools">
        <Upload
          beforeUpload={handleUploadImage}
          showUploadList={false}
          style={{ marginLeft: "8px" }}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="text-input"
        />
        <Button
          className="send-button"
          type="primary"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </Layout>
  );
};

export default Texting;
