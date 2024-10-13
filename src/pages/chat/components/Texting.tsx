import "../../../assets/style/pages/chat/Texting.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { List, Input, Button, Upload, Layout, Avatar } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { CreateNewMessage } from "../../../services/message/message.service";
import { CreateMessagePayload } from "../../../services/message/types/create-message-payload.dto";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { JoinRoomDto } from "../types/join-room.dto";
import { io, Socket } from "socket.io-client";
import { NewMessageDto } from "../types/new-message.dto";

const { Content } = Layout;

const SOCKET_SERVER_URL = "http://localhost:3001";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const Texting: React.FC = () => {
  const navigate = useNavigate();
  const authContext: AuthenticationContextProp = useAuth();
  const { conversationId } = useParams<{ conversationId: string }>();
  const socket: Socket = io(SOCKET_SERVER_URL, {
    extraHeaders: {
      Authorization: `${authContext.accessToken}`,
    },
  });
  const [messages, setMessages] = useState<NewMessageDto[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (!conversationId) {
      navigate("/");
      return;
    }

    const joinRoom = () => {
      if (!socket) {
        console.log("no socket");
        return false;
      }

      const joinRoomPayload: JoinRoomDto = {
        roomId: conversationId,
      };
      socket.emit("joinRoom", joinRoomPayload);
      return true;
    };
    const joinedRoom = joinRoom();
    if (joinedRoom) {
      
    }
  }, [conversationId]);

  if (socket) {
    socket.on("newMessage", (payload: NewMessageDto) => {
      console.log("new message:", payload);
      setMessages((prevMessages) => [...prevMessages, payload]);
    });
  } else {
    console.log("no socket");
  }

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
          renderItem={(data: NewMessageDto) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div className="message-sender-information">
                    <Avatar
                      className="sender-photo"
                      src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                      icon={<UserOutlined />}
                      size={"large"}
                    />
                    <p className="sender-name">{`${data.sender.lastName} ${data.sender.firstName}`}</p>
                  </div>
                }
                title={`${data.message}`}
                description={`${formatTimestamp(data.timestamp)}`}
              />
            </List.Item>
          )}
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
