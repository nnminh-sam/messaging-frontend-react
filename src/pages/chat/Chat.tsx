import "../../assets/style/pages/chat/BaseChat.css";
import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Input, Layout, Menu, theme } from "antd";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";

const { Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
type Conversation = {
  id: string;
  name: string;
  slug: string;
};

const conversations: Conversation[] = [
  {
    id: "1",
    name: "a",
    slug: "a",
  },
  {
    id: "2",
    name: "b",
    slug: "b",
  },
  {
    id: "3",
    name: "c",
    slug: "c",
  },
];

export const ChatPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const authenticationContext: AuthenticationContextProp = useAuth();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const loadItems = () => {
      const menuItems: MenuItem[] = conversations.map((conversation) => ({
        key: conversation.id,
        icon: <UserOutlined />,
        label: conversation.name,
      }));
      setItems(menuItems);
    };

    loadItems();
  }, []);

  return (
    <Layout className="chat-container" hasSider>
      <Sider className="chat-sidebar" width={300}>
        <div className="user-info">
          <Avatar className="avatar" icon={<UserOutlined />} />
          <p className="full-name">
            {authenticationContext.userInformation
              ? authenticationContext.userInformation.fullName
              : "Loading..."}
          </p>
        </div>
        <Menu mode="inline" theme="dark" items={items} />
      </Sider>
      <Layout className="conversation-container">
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
          className="message-input"
          style={{
            background: colorBgContainer,
          }}
        >
          <div className="texting-features">
            <Button icon={<SmileOutlined />} />
            <Button icon={<PaperClipOutlined />} />
          </div>
          <Input className="text-input" placeholder="Message" />
          <Button type="primary" icon={<SendOutlined />} />
        </div>
      </Layout>
    </Layout>
  );
};
