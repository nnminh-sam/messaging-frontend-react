import { CreateRelationshipPayload } from "./types/create-relationship-payload.dto";
import axios, { AxiosResponse } from "axios";
import { ListApiResponse } from "../../types/list-api-response.dto";
import { GetHeaderConfig } from "../service.config";
import { Relationship } from "./types/relationship.dto";
import { ApiResponse } from "../../types/api-response.dto";
import { ErrorResponse } from "../../types/error-response.dto";
import { BlockUserDto } from "./types/block-user.dto";

const env: ImportMetaEnv = import.meta.env;
const BASE_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/relationships`;

export async function GetUserFriends(token: string) {
  const API_URL = `${BASE_API_URL}/my`;
  try {
    const response: AxiosResponse<ListApiResponse<Relationship>> =
      await axios.get(API_URL, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}

export async function CreateNewRelationship(
  token: string,
  payload: CreateRelationshipPayload
) {
  const API_URL = `${BASE_API_URL}`;
  try {
    const response: AxiosResponse<ApiResponse<Relationship>> = await axios.post(
      API_URL,
      payload,
      GetHeaderConfig(token)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function AcceptFriendship(token: string, relationshipId: string) {
  const API_URL = `${BASE_API_URL}/accept/${relationshipId}`;
  try {
    const response: AxiosResponse<ApiResponse<Relationship>> = await axios.get(
      API_URL,
      GetHeaderConfig(token)
    );
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}

export async function DeclineRelationship(
  token: string,
  relationshipId: string
) {
  const API_URL = `${BASE_API_URL}/${relationshipId}`;
  try {
    const response: AxiosResponse<ApiResponse<Relationship>> =
      await axios.delete(API_URL, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function deleteRelationship(
  token: string,
  relationshipId: string
) {
  const API_URL = `${BASE_API_URL}/${relationshipId}`;
  try {
    const response: AxiosResponse<ApiResponse<Relationship>> =
      await axios.delete(API_URL, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}

export async function blockUser(token: string, payload: BlockUserDto) {
  const API_URL = `${BASE_API_URL}/block`;
  try {
    const response: AxiosResponse<ApiResponse<Relationship>> =
      await axios.patch(API_URL, payload, GetHeaderConfig(token));
    return response.data;
  } catch (error: any) {
    return error.response.data as ErrorResponse;
  }
}
