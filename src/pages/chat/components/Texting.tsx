import "../../../assets/style/pages/chat/Texting.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { List, Input, Button, Upload, Layout, Avatar } from "antd";
import { MoreOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  CreateNewMessage,
  FetchMessage,
} from "../../../services/message/message.service";
import { FetchMessageDto } from "../../../services/message/types/fetch-message.dto";
import { CreateMessagePayload } from "../../../services/message/types/create-message-payload.dto";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { io, Socket } from "socket.io-client";
import { ListApiResponse } from "../../../types/list-api-response.dto";
import { Message } from "../../../services/message/types/message.dto";
import { ErrorResponse } from "../../../types/error-response.dto";
import { fetchConversationById } from "../../../services/conversation/conversation.service";
import { Conversation } from "../../../services/conversation/types/conversation.dto";
import ConversationDetails from "../modal/ConversationDetail.modal";

const { Content } = Layout;

const SOCKET_SERVER_URL = "http://localhost:3001";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function scrollToBottom(messageListRef: any) {
  if (messageListRef.current) {
    messageListRef.current.scrollIntoView({ behavior: "instant" });
  }
}

const Texting: React.FC = () => {
  const navigate = useNavigate();
  const authContext: AuthenticationContextProp = useAuth();
  const socket: Socket = io(SOCKET_SERVER_URL, {
    extraHeaders: {
      Authorization: `${authContext.accessToken}`,
    },
  });
  const messageListRef = React.useRef<HTMLDivElement | null>(null);
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<Conversation>({
    id: "",
    name: "",
    description: "",
    createdAt: new Date(),
    createdBy: "",
    host: "",
    updatedAt: new Date(),
  });
  const [messages, setMessages] = useState<Record<string, Message>>({});
  const [newMessage, setNewMessage] = useState<string>("");
  const [showConversationDetail, setShowConversationDetail] =
    useState<boolean>(false);

  // ? This function currently cannot replace for the logic of "newMessage" listener
  const updateMessages: any = (message: Message) => {
    setMessages((prevMessages) => ({
      [message.id]: message,
      ...prevMessages,
    }));
  };

  const fetchMessageToDisplay: any = async (payload: FetchMessageDto) => {
    const response: ListApiResponse<Message> | ErrorResponse =
      await FetchMessage(authContext.accessToken, payload);
    if ("data" in response) {
      response.data.map(updateMessages);
      scrollToBottom(messageListRef);
    }
  };

  useEffect(() => {
    scrollToBottom(messageListRef);
  }, [messages]);

  // TODO: update the component so that parse the converesation data as the component param instead of making additional data fetching
  useEffect(() => {
    setMessages({});
    if (!conversationId) {
      navigate("/");
      return;
    }

    const fetchConversationData = async () => {
      const response = await fetchConversationById(
        authContext.accessToken,
        conversationId
      );
      if ("data" in response) {
        setConversation(response.data);
      } else {
        navigate("/");
      }
    };

    const joinRoomAndFetchMessages = () => {
      if (!socket) {
        // TODO: handle no socket (bad socket connection error) if needed?
        console.log("no socket");
        return false;
      }

      socket.emit("joinRoom", { roomId: conversationId });
      fetchMessageToDisplay({
        conversationId,
        page: 1,
        size: 10,
      });
    };

    fetchConversationData();
    joinRoomAndFetchMessages();
  }, [conversationId]);

  if (socket) {
    socket.on("newMessage", (receivedMessage: Message) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [receivedMessage.id]: receivedMessage,
      }));
    });
  } else {
    console.log("no socket");
  }

  // TODO: Update send message error alert
  const sendMessageHandler = async (event: any) => {
    event.preventDefault();

    if (!newMessage.trim() || !conversationId) {
      return;
    }

    try {
      const createMessagePayload: CreateMessagePayload = {
        sendBy: authContext.userInformation.id,
        conversation: conversationId,
        message: newMessage,
      };
      const response = await CreateNewMessage(
        authContext.accessToken,
        createMessagePayload
      );
      if ("data" in response) {
        const newMessage: Message = response.data;
        setMessages((prevMessages) => ({
          ...prevMessages,
          [newMessage.id]: newMessage,
        }));
      }
      setNewMessage("");
    } catch (error: any) {
      alert(`An error appeared: ${error.response.data.message}`);
      console.log("error:", error);
    }
  };

  // TODO: handle file upload
  const handleUploadImage = (file: any) => {
    console.log("Uploaded file:", file);

    return false;
  };

  const moreInformationButtonPressHandler = () => {
    console.log("show modal");
    setShowConversationDetail(true);
  };

  return (
    <Layout className="texting-component">
      <div className="conversation-header">
        <h3>{conversation.name}</h3>
        <Button
          className="setting-button"
          icon={<MoreOutlined />}
          type="text"
          onClick={moreInformationButtonPressHandler}
        />
      </div>
      <Content className="message-container">
        <List
          className="message-list"
          bordered
          dataSource={Object.values(messages)}
          renderItem={(message: Message) => (
            <List.Item
              className={
                message.sendBy.id === authContext.userInformation.id
                  ? "sent-message"
                  : "received-message"
              }
            >
              <List.Item.Meta
                avatar={
                  <div className="message-sender-information">
                    <Avatar
                      className="sender-photo"
                      src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                      icon={<UserOutlined />}
                      size={"large"}
                    />
                    <p className="sender-name">{`${message.sendBy.lastName} ${message.sendBy.firstName}`}</p>
                  </div>
                }
                title={`${message.message}`}
                description={`${formatTimestamp(message.createdAt)}`}
              />
            </List.Item>
          )}
        />
        <span ref={messageListRef}></span>
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
          onClick={sendMessageHandler}
        >
          Send
        </Button>
      </div>
      <ConversationDetails
        conversation={conversation}
        visible={showConversationDetail}
        onClose={() => {
          setShowConversationDetail(false);
        }}
      />
    </Layout>
  );
};

export default Texting;
