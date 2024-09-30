import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Badge, Button, Card, Input, Layout, Menu, theme } from "antd";

const { Content, Footer, Sider } = Layout;

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

const Chat: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadItems = () => {
      const menuItems: MenuItem[] = conversations.map((conversation) => {
        return {
          key: conversation.id,
          icon: <UserOutlined />,
          label: conversation.name,
        };
      });
      setItems(menuItems);
    };

    loadItems();
  }, []);

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider>
        <div
          className="user-info"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "10px",
            width: "100%",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <Avatar icon={<UserOutlined />} />
          <p style={{ marginLeft: "10px" }}>Full name</p>
        </div>
        <Menu mode="inline" theme="dark" items={items} />
      </Sider>
      <Layout style={{ display: "flex", flexDirection: "column" }}>
        <Content
          style={{
            flex: 1,
            overflow: "auto",
            padding: 24,
            textAlign: "center",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div
            className="message-container"
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            background: colorBgContainer,
            borderTop: "1px solid #e8e8e8",
            position: "sticky",
            bottom: 0,
            width: "100%",
            height: "100px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button icon={<SmileOutlined />} />
            <Button icon={<PaperClipOutlined />} />
          </div>
          <Input
            placeholder="Type a message"
            style={{ flex: 1, marginRight: "10px" }}
          />
          <Button type="primary" icon={<SendOutlined />} />
        </div>
      </Layout>
    </Layout>
  );
};

export default Chat;
