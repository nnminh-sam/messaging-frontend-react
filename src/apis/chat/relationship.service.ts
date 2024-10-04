import axios, { AxiosResponse } from "axios";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { GetHeaderConfig } from "../service.config";
import { Relationship } from "./types/relationship.dto";

const env: ImportMetaEnv = import.meta.env;
const BASE_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/relationships`;

export async function GetUserFriends(token: string) {
  const API_URL = `${BASE_API_URL}/my`;
  try {
    const response: AxiosResponse<ListApiResponse<Relationship>> =
      await axios.get(API_URL, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}
