import axios, { AxiosResponse } from "axios";
import { GetHeaderConfig } from "../service.config";
import { CreateMessagePayload } from "./types/dto/create-message-payload.dto";
import { ApiResponse } from "../../types/api-response.dto";
import { Message } from "./types/message.dto";

const env: ImportMetaEnv = import.meta.env;
const BASE_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/messages`;

export async function CreateNewMessage(
  token: string,
  payload: CreateMessagePayload
) {
  const API_URL = `${BASE_API_URL}`;
  try {
    const response: AxiosResponse<ApiResponse<Message>> = await axios.post(
      API_URL,
      payload,
      GetHeaderConfig(token)
    );
    return response.data;
  } catch (error: any) {
    return {
      error: error.response.data,
    };
  }
}
