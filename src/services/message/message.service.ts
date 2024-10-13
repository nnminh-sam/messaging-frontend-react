import axios, { AxiosResponse } from "axios";
import { GetHeaderConfig } from "../service.config";
import { CreateMessagePayload } from "./types/create-message-payload.dto";
import { ApiResponse } from "../../types/api-response.dto";
import { Message } from "./types/message.dto";
import { ErrorResponse } from "../../types/error-response.dto";
import { FetchMessageDto } from "./types/fetch-message.dto";
import { ListApiResponse } from "../../types/list-api-response.dto";

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
    return error.response.data as ErrorResponse;
  }
}

export async function FetchMessage(token: string, payload: FetchMessageDto) {
  const API_URL = `${BASE_API_URL}/conversation/${payload.conversationId}?page=${payload.page}&size=${payload.size}`;
  try {
    const response: AxiosResponse<ListApiResponse<Message>> = await axios.get(
      API_URL,
      GetHeaderConfig(token)
    );
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}
