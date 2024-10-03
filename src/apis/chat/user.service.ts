import { ApiResponse } from "./../../types/api-response.dto";
import axios, { AxiosResponse } from "axios";
import { UserInformation } from "./types/user-information.dto";

const env: ImportMetaEnv = import.meta.env;

export async function GetUserInformation(
  token: string
): Promise<ApiResponse<UserInformation>> {
  const API_URL = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/users/my`;
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
