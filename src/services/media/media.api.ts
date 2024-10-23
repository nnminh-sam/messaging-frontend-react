import { notification } from "antd";
import { HTTPMethod } from "../api/api.type";
import Api from "../api";
import { Pagination } from "../../types/metadata.dto";
import { MediaQuery } from "./media.type";

const MODULE_NAME: string = "media";

async function sendFile(roomId: string, formData: any) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/single/${roomId}`,
      method: HTTPMethod.POST,
      data: formData,
    });
    if (response.data) {
      return response.data;
    }
    notification.error({
      message: "Error",
      description: "Unexpected error occurred",
    });
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error?.message,
    });
  }
}

async function approveMedia(mediaId: string) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/approve/${mediaId}`,
      method: HTTPMethod.PATCH,
    });
    if (response.data) {
      return response.data;
    }
    notification.error({
      message: "Error",
      description: "Unexpected error occurred",
    });
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error?.message,
    });
  }
}

async function rejectMedia(mediaId: string) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/reject/${mediaId}`,
      method: HTTPMethod.PATCH,
    });
    if (response.data) {
      return response.data;
    }
    notification.error({
      message: "Error",
      description: "Unexpected error occurred",
    });
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error?.message,
    });
  }
}

async function findUserSentMedia(
  paginationDto: Pagination,
  mediaQuery: MediaQuery
) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/sent`,
      method: HTTPMethod.GET,
      params: { ...paginationDto, ...mediaQuery },
    });
    if (response.data) {
      return response.data;
    }
    notification.error({
      message: "Error",
      description: "Unexpected error occurred",
    });
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error?.message,
    });
  }
}

const MediaApi = {
  sendFile,
  approveMedia,
  rejectMedia,
  findUserSentMedia,
};

export default MediaApi;
