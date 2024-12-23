import { ApiResponse } from "../../types/api-response.dto";
import axios, { AxiosResponse } from "axios";
import { UserInformation } from "./types/user-information.dto";
import { GetHeaderConfig } from "../service.config";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { UserInformationWithRelationship } from "./types/user-information-with-relationship.dto";
import { ErrorResponse } from "../../types/error-response.dto";
import { UpdateUserDto } from "./types/update-user.dto";

const env: ImportMetaEnv = import.meta.env;
const BASE_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/users`;

export async function GetUserInformation(
  token: string
): Promise<ApiResponse<UserInformation>> {
  const API_URL = `${BASE_API_URL}/my`;
  try {
    const response: AxiosResponse<ApiResponse<UserInformation>> =
      await axios.get(API_URL, GetHeaderConfig(token));
    const fullName: string = `${response.data.data.lastName} ${response.data.data.firstName}`;
    response.data.data.fullName = fullName;
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function FindUsers(
  token: string,
  searchValue: string,
  page: number,
  size: number,
  sortBy: string,
  orderBy: string
) {
  const API_URL = `${BASE_API_URL}?searchValue=${searchValue}&page=${page}&size=${size}&sortBy=${sortBy}&orderBy=${orderBy}`;
  try {
    const response: AxiosResponse<
      ListApiResponse<UserInformationWithRelationship>
    > = await axios.get(API_URL, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function findUserConversationMembershipByConversationId(
  token: string,
  conversationId: string,
  page: number,
  size: number,
  sortBy: string,
  orderBy: string
) {
  const API_URL = `${BASE_API_URL}/memberships/${conversationId}?page=${page}&size=${size}&sortBy=${sortBy}&orderBy=${orderBy}`;
  try {
    const response: AxiosResponse<
      ListApiResponse<UserInformationWithRelationship>
    > = await axios.get(API_URL, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}

export async function updateUserInformation(
  token: string,
  payload: UpdateUserDto
) {
  const API_URL = `${BASE_API_URL}`;
  try {
    const response: AxiosResponse<
      ListApiResponse<UserInformationWithRelationship>
    > = await axios.patch(API_URL, payload, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}
