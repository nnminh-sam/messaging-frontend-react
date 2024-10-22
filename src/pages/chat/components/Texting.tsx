import "../../../assets/style/pages/chat/Texting.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { List, Input, Upload, Layout, Avatar, notification } from "antd";
import {
  BugOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  CreateNewMessage,
  FetchMessage,
} from "../../../services/message/message.service";
import { FetchMessageDto } from "../../../services/message/types/fetch-message.dto";
import { CreateMessagePayload } from "../../../services/message/types/create-message-payload.dto";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import { Socket } from "socket.io-client";
import { ListApiResponse } from "../../../types/list-api-response.dto";
import { Message } from "../../../services/message/types/message.dto";
import { ErrorResponse } from "../../../types/error-response.dto";
import { Conversation } from "../../../services/conversation/types/conversation.dto";
import ConversationDetails from "../modal/ConversationDetail.modal";
import { Membership } from "../../../services/membership/membership.type";
import MediaApi from "../../../services/media/media.api";
import { Image, Button } from "antd";

export interface TextingProps {
  membership: Membership;
}

const { Content } = Layout;

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

const Texting: React.FC<TextingProps> = ({ membership }) => {
  const conversation: Conversation = membership.conversation;
  const { conversationId } = useParams<{ conversationId: string }>();
  const authContext: AuthenticationContextProp = useAuth();
  const socket: Socket | undefined = authContext.socket;
  const messageListRef = React.useRef<HTMLDivElement | null>(null);
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

  const updateMessages: any = (message: Message) => {
    setMessages((prevMessages) => ({
      [message.id]: message,
      ...prevMessages,
    }));
  };

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

  useEffect(() => {
    setFetchable(true);
    setMessages({});
    if (!conversationId) {
      authContext.logoutAction();
      return;
    }

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

    joinRoomAndFetchMessages();
  }, [conversationId]);

  if (socket) {
    socket.on("newMessage", (receivedMessage: Message) => {
      console.log(
        "🚀 ~ file: Texting.tsx ~ line 169 ~ socket.on ~ receivedMessage",
        receivedMessage
      );

      setMessages((prevMessages) => ({
        ...prevMessages,
        [receivedMessage.id]: receivedMessage,
      }));
      setHasNewMessage(true);
    });
  }

  const sendMessageHandler = async (event: any) => {
    event.preventDefault();
    if (!newMessage.trim() || !conversationId) return;
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
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  const imageUploadHandler = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await MediaApi.sendFile(conversation.id, formData);
    if (!response) {
      notification.error({
        message: "Cannot upload file",
        description: response?.message,
      });
      return false;
    }
    return true;
  };

  const conversationDetailModalVisibilityUpdateHandler = () => {
    setShowConversationDetail(true);
  };

  return (
    <Layout className="texting-component">
      <div className="conversation-header">
        {membership &&
          (conversation.type !== "DIRECT" ? (
            <h3>{conversation.name}</h3>
          ) : (
            <h3>
              {membership.partner
                ? `${membership.partner.lastName} ${membership.partner.firstName}`
                : "Unknown"}
            </h3>
          ))}
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
                  title={
                    message?.media ? (
                      <div className="image-container">
                        <Image
                          height={200}
                          src={
                            message.media.status === "APPROVED"
                              ? `http://localhost:3000/api/v1/media/stream?id=${message.media.id}`
                              : "data:image/png;base64,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"
                          }
                        />
                        <div className="option-buttons">
                          {(message.media.status === "PENDING" ||
                            message.media.status === "REJECTED") && (
                            <Button
                              icon={<EyeOutlined />}
                              onClick={async () => {
                                if (!message?.media?.id) return;

                                const response = await MediaApi.approveMedia(
                                  message?.media.id
                                );
                                if (!response) {
                                  notification.error({
                                    message: "Cannot approve media",
                                    description: response?.message,
                                  });
                                  return;
                                }
                                setMessages((prevMessages) => ({
                                  ...prevMessages,
                                  [message.id]: {
                                    ...prevMessages[message.id],
                                    media: response.data,
                                  },
                                }));
                              }}
                            >
                              View
                            </Button>
                          )}
                          {message.media.status === "APPROVED" && (
                            <Button
                              icon={<BugOutlined />}
                              onClick={async () => {
                                if (!message?.media?.id) return;

                                const response = await MediaApi.rejectMedia(
                                  message?.media.id
                                );
                                if (!response) {
                                  notification.error({
                                    message: "Cannot approve media",
                                    description: response?.message,
                                  });
                                  return;
                                }
                                setMessages((prevMessages) => ({
                                  ...prevMessages,
                                  [message.id]: {
                                    ...prevMessages[message.id],
                                    media: response.data,
                                  },
                                }));
                              }}
                            >
                              Report
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      message.message
                    )
                  }
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
      {conversation && (
        <ConversationDetails
          conversation={conversation}
          visible={showConversationDetail}
          onClose={() => {
            setShowConversationDetail(false);
          }}
          directConversationName={`${membership.partner?.lastName} ${membership.partner?.firstName}`}
        />
      )}
    </Layout>
  );
};

export default Texting;
