import { notification } from "antd";
import { HTTPMethod } from "../api/api.type";
import Api from "../api";

const MODULE_NAME: string = "media";

async function sendFile(file: any) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/single`,
      method: HTTPMethod.POST,
      data: file,
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
};

export default MediaApi;
