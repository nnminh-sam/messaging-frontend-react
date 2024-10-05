import axios, { AxiosResponse } from "axios";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { Membership } from "./types/membership.dto";
import { GetHeaderConfig } from "../service.config";

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
