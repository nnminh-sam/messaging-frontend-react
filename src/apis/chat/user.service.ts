import { ApiResponse } from "./../../types/api-response.dto";
import axios, { AxiosResponse } from "axios";
import { UserInformation } from "./types/user-information.dto";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { Membership } from "./types/membership.dto";

const env: ImportMetaEnv = import.meta.env;
const BASE_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}`;

export async function GetUserInformation(
  token: string
): Promise<ApiResponse<UserInformation>> {
  const API_URL = `${BASE_API_URL}/users/my`;
  try {
    const response: AxiosResponse<ApiResponse<UserInformation>> =
      await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const fullName: string = `${response.data.data.lastName} ${response.data.data.firstName}`;
    response.data.data.fullName = fullName;
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function GetParticipatedConversation(token: string) {
  const API_URL = `${BASE_API_URL}/memberships/participated-conversations`;
  try {
    const response: AxiosResponse<ListApiResponse<Membership>> =
      await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}
