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
  const authContext: AuthenticationContextProp = useAuth();
  const socket: Socket = io(SOCKET_SERVER_URL, {
    extraHeaders: {
      Authorization: `${authContext.accessToken}`,
    },
  });
  const messageListRef = React.useRef<HTMLDivElement | null>(null);
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<any>({
    id: "",
    name: "",
    description: "",
    createdAt: new Date(),
    createdBy: "",
    host: {},
    updatedAt: new Date(),
  });
  const [messages, setMessages] = useState<Record<string, Message>>({});
  const [newMessage, setNewMessage] = useState<string>("");
  const [showConversationDetail, setShowConversationDetail] =
    useState<boolean>(false);
  const [fetchable, setFetchable] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [isFetchingOldMessages, setIsFetchingOldMessages] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (!conversationId) {
      authContext.logoutAction();
      return;
    }

    const element = event.currentTarget;
    if (element.scrollTop === 0 && !isFetchingOldMessages) {
      setIsFetchingOldMessages(true);
      await fetchMessagesHandler({
        conversationId: conversationId,
        page: page + 1,
        size: 10,
      });
      setIsFetchingOldMessages(false);
      setPage(page + 1);
    }
  };

  // ? This function currently cannot replace for the logic of "newMessage" listener
  const updateMessages: any = (message: Message) => {
    setMessages((prevMessages) => ({
      [message.id]: message,
      ...prevMessages,
    }));
  };

  // TODO: add an message to notify the user that is all the messages is shown
  const fetchMessagesHandler: any = async (payload: FetchMessageDto) => {
    if (!fetchable) {
      return;
    }
    const response: ListApiResponse<Message> | ErrorResponse =
      await FetchMessage(authContext.accessToken, payload);
    if ("data" in response) {
      if (response.metadata.pagination.totalPage === payload.page) {
        setFetchable(false);
      }
      response.data.map(updateMessages);
    } else if ("status" in response && response.status === "error") {
      authContext.logoutAction();
    }
  };

  // * Message list scroll to bottom handler
  useEffect(() => {
    if (hasNewMessage) {
      scrollToBottom(messageListRef);
      setHasNewMessage(false);
    }
  }, [hasNewMessage]);

  // TODO: update the component so that parse the converesation data as the component param instead of making additional data fetching
  useEffect(() => {
    setFetchable(true);
    setMessages({});
    if (!conversationId) {
      authContext.logoutAction();
      return;
    }

    const fetchConversationData = async () => {
      const response = await fetchConversationById(
        authContext.accessToken,
        conversationId
      );
      if ("data" in response) {
        setConversation(response.data);
      } else if ("status" in response && response.status === "error") {
        authContext.logoutAction();
      }
    };

    const joinRoomAndFetchMessages = async () => {
      if (!socket) {
        // TODO: handle no socket (bad socket connection error) if needed?
        console.log("no socket");
        return false;
      }

      socket.emit("joinRoom", { roomId: conversationId });
      await fetchMessagesHandler({
        conversationId,
        page: 1,
        size: 10,
      });
      scrollToBottom(messageListRef);
    };

    fetchConversationData();
    joinRoomAndFetchMessages();
  }, [conversationId]);

  // ? This might need to handle no socket exist or unauthorized socket
  // * New message listener
  if (socket) {
    socket.on("newMessage", (receivedMessage: Message) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [receivedMessage.id]: receivedMessage,
      }));
      setHasNewMessage(true);
    });
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
      } else if ("status" in response && response.status === "error") {
        authContext.logoutAction();
      }
      setNewMessage("");
    } catch (error: any) {
      alert(`An error appeared: ${error.response.data.message}`);
      console.log("error:", error);
    }
  };

  // TODO: handle file upload
  const imageUploadHandler = (file: any) => {
    console.log("Uploaded file:", file);

    return false;
  };

  const conversationDetailModalVisibilityUpdateHandler = () => {
    setShowConversationDetail(true);
  };

  return (
    <Layout className="texting-component">
      <div className="conversation-header">
        <h3>{conversation.type === "DIRECT" ? "true" : "false"}</h3>
        <Button
          className="setting-button"
          icon={<MoreOutlined />}
          type="text"
          onClick={conversationDetailModalVisibilityUpdateHandler}
        />
      </div>
      <Content className="message-container">
        <div
          className="message-list-container"
          style={{ height: "100%", overflowY: "auto" }}
          onScroll={handleScroll}
        >
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
        </div>
      </Content>
      <div className="texting-tools">
        <Upload
          beforeUpload={imageUploadHandler}
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
