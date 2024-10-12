import "../../../assets/style/pages/chat/Texting.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { List, Input, Button, Upload, Layout } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Content } = Layout; // Ensure Content is imported from Layout

const Texting: React.FC = () => {
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage(""); // Clear the input after sending
    }
  };

  const handleUploadImage = (file: any) => {
    console.log("Uploaded file:", file);
    // Handle image upload logic here
    return false; // Prevent automatic upload
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
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="text-input" // Use the class for styling
        />
        <Button type="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </Layout>
  );
};

export default Texting;
