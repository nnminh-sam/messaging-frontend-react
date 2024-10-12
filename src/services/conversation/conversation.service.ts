import axios, { AxiosResponse } from "axios";
import { GetHeaderConfig } from "../service.config";
import { CreateConversationDto } from "./types/create-conversation.dto";
import { ApiResponse } from "../../types/api-response.dto";
import { Conversation } from "./types/conversation.dto";
import { ErrorResponse } from "../../types/error-response.dto";

const env: ImportMetaEnv = import.meta.env;
const BASE_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/conversations`;

export async function CreateConversation(
  token: string,
  payload: CreateConversationDto
) {
  const API_URL = `${BASE_API_URL}`;
  try {
    const response: AxiosResponse<ApiResponse<Conversation>> = await axios.post(
      API_URL,
      payload,
      GetHeaderConfig(token)
    );
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}
