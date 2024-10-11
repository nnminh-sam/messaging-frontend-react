import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import {
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Button, Input, Layout, theme } from "antd";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";
import { CreateNewMessage } from "../../services/message/message.service";
import { CreateMessagePayload } from "../../services/message/types/create-message-payload.dto";
import { SidebarMenu } from "./components/SidebarMenu";

const { Content } = Layout;

export const ChatPage: React.FC = () => {
  const authenticationContext: AuthenticationContextProp = useAuth();
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMessageInputUpdate: any = (event: any) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  useEffect(() => {
    const activeConversationFromLocalStorage: string | null =
      localStorage.getItem("activeConversation");
    if (activeConversationFromLocalStorage) {
      setActiveConversation(activeConversationFromLocalStorage);
    }
  }, []);

  const handleSendMessageButtonClicked: any = async (event: any) => {
    event.preventDefault();
    try {
      const payload: CreateMessagePayload = {
        sendBy: authenticationContext.userInformation.id,
        conversation: activeConversation,
        message,
      };
      console.log("sending new message:", payload);
      const response = await CreateNewMessage(
        authenticationContext.accessToken,
        payload
      );
      console.log("response:", response);
      setMessage("");
    } catch (error: any) {
      console.log("error:", error);
    }
  };

  return (
    <Layout className="chat-container" hasSider>
      <SidebarMenu />
      <Layout className="conversation-container">
        <div
          className="messaging-section"
          hidden={activeConversation ? false : true}
        >
          <Content
            className="message-container"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div>
              <p>long content</p>
              {Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? "more" : "..."}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </Content>
          <div
            className="message-input-section"
            style={{
              background: colorBgContainer,
            }}
          >
            <div className="texting-features">
              <Button icon={<SmileOutlined />} />
              <Button icon={<PaperClipOutlined />} />
            </div>
            <Input
              className="text-input"
              placeholder="Message"
              onChange={handleMessageInputUpdate}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessageButtonClicked}
            />
          </div>
        </div>
      </Layout>
    </Layout>
  );
};
