import axios, { AxiosResponse } from "axios";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { Membership } from "./types/membership.dto";
import { GetHeaderConfig } from "../service.config";
import { CreateMembershipDto } from "./types/create-membership.dto";
import { ErrorResponse } from "../../types/error-response.dto";

const env: ImportMetaEnv = import.meta.env;
const BASE_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/memberships`;

export async function GetParticipatedConversation(token: string) {
  const API_URL = `${BASE_API_URL}/participated-conversations`;
  try {
    const response: AxiosResponse<ListApiResponse<Membership>> =
      await axios.get(API_URL, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function JoinConversation(
  token: string,
  payload: CreateMembershipDto
) {
  const API_URL = `${BASE_API_URL}`;
  try {
    const response: AxiosResponse<ListApiResponse<Membership>> =
      await axios.post(API_URL, payload, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}
