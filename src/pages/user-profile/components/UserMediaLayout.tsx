import "../../../assets/style/pages/user-profile/UserProfileBase.css";
import "../../../assets/style/pages/user-profile/UserMediaLayout.css";
import {
  Avatar,
  Button,
  Card,
  GetProps,
  Input,
  Layout,
  List,
  notification,
  Radio,
  RadioChangeEvent,
  Image,
} from "antd";
import {
  BugOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import React, { ReactNode, useEffect, useState } from "react";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import Meta from "antd/es/card/Meta";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import { Media, MediaStatus } from "../../../services/media/media.type";
import MediaApi from "../../../services/media/media.api";

const envData = (import.meta as any).env;
const hostUrl: string = `${envData.VITE_BACKEND_URL}/${envData.VITE_BACKEND_API_PREFIX}/${envData.VITE_BACKEND_API_VERSION}`;

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

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;
const CONTENT_SIZE: number = 10;
const SORT_BY: string = "createdAt";
const SORT_ORDER: string = "desc";

const UserMediaLayout: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const user: UserInformation = authContext.userInformation;
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [media, setMedia] = useState<any[]>([]);
  const [mediaStatusFilter, setMediaStatusFilter] = useState<MediaStatus>(
    MediaStatus.APPROVED
  );

  const fetchUserSentMedia = async () => {
    const response = await MediaApi.findUserSentMedia(
      {
        page,
        size: CONTENT_SIZE,
        sortBy: SORT_BY,
        orderBy: SORT_ORDER,
      },
      { status: mediaStatusFilter }
    );
    if (!response) {
      notification.error({
        message: "Error",
        description: "Unexpected error occurred",
      });
      return false;
    }
    setMedia(response.data);
    setTotalPage(response.metadata.pagination.totalPage);
    return true;
  };

  useEffect(() => {
    fetchUserSentMedia();
  }, [mediaStatusFilter, page]);

  const renderFriendFromFriendRelationships: any = (
    media: Media,
    index: number
  ) => {
    return (
      <List.Item className="media-list-item">
        <List.Item.Meta
          className="media-list-item-meta"
          key={media.id}
          title={`Name: ${media.filename}`}
          description={
            <p>{`Uploaded at: ${formatTimestamp(media.createdAt)}`}</p>
          }
        />
        <div className="media-list-content">
          {media.mimetype === "video/mp4" ? (
            <video controls width="300px">
              <source
                src={`${hostUrl}/media/stream?id=${media.id}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              height={400}
              src={
                media.status === "APPROVED"
                  ? `${hostUrl}/media/stream?id=${media.id}`
                  : "data:image/png;base64,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"
              }
            />
          )}
          <div className="media-list-item-tool-box">
            {(mediaStatusFilter === "PENDING" ||
              mediaStatusFilter === "REJECTED") && (
              <Button icon={<EyeOutlined />}>Approve</Button>
            )}
            {mediaStatusFilter === "APPROVED" && (
              <Button icon={<BugOutlined />}>Reject</Button>
            )}
          </div>
          <div className="media-list-item-footer">
            <p>{`Original name: ${media.originalname}`}</p>
            <p>{`Sent to: ${media.conversation.name}`}</p>
          </div>
        </div>
      </List.Item>
    );
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    if (!value) {
      fetchUserSentMedia();
      return;
    }

    const filteredMedia = media.filter((m) => {
      return m.filename.includes(value);
    });
    setMedia(filteredMedia);
  };

  const mediaStatusFilterUpdateHandler: any = async (e: RadioChangeEvent) => {
    setMediaStatusFilter(e.target.value);
    setPage(1);
  };

  return (
    <Layout className="user-base-layout user-media-layout">
      <Header className="user-media-header">
        <Card className="user-contact-card" hoverable>
          <Meta
            title={
              <span className="user-contact-title">
                {`${user.firstName} ${user.lastName}`}
                <span className="user-contact-username">{` @${user.username}`}</span>
              </span>
            }
            description={user.email}
          />
        </Card>
      </Header>
      <Content className="user-base-content user-media-content">
        <h2>Media Collection</h2>
        <Radio.Group
          className="media-status-filter"
          onChange={mediaStatusFilterUpdateHandler}
          value={mediaStatusFilter}
        >
          <Radio value={"APPROVED"}>Approved</Radio>
          <Radio value={"PENDING"}>Pending</Radio>
          <Radio value={"REJECTED"}>Rejected</Radio>
        </Radio.Group>
        <div className="tool-box">
          <Search placeholder="Search" onSearch={onSearch} enterButton />
        </div>

        <List
          className="media-list"
          dataSource={media}
          renderItem={renderFriendFromFriendRelationships}
        />
        <div className="media-list-footer">
          {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              onClick={() => {
                setPage(p);
              }}
            >
              {p}
            </Button>
          ))}
        </div>
      </Content>
    </Layout>
  );
};

export default UserMediaLayout;
