import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../../types/api-response.dto";
import { AuthResponseDto } from "./types/AuthResponse.dto";
import { Registration } from "../../pages/auth/types/Registration.interface";
import { GetHeaderConfig } from "../service.config";

const env: ImportMetaEnv = import.meta.env;
const BASE_AUTH_API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/auth`;

export async function ValidateToken(
  token: string
): Promise<ApiResponse<AuthResponseDto>> {
  try {
    const response: AxiosResponse<ApiResponse<AuthResponseDto>> =
      await axios.get(
        `${BASE_AUTH_API_URL}/validate-token`,
        GetHeaderConfig(token)
      );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function Login(
  email: string,
  password: string
): Promise<ApiResponse<AuthResponseDto>> {
  try {
    const response: AxiosResponse<ApiResponse<AuthResponseDto>> =
      await axios.post(`${BASE_AUTH_API_URL}/login`, {
        email,
        password,
      });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function Register(
  payload: Registration
): Promise<ApiResponse<AuthResponseDto>> {
  try {
    const response: AxiosResponse<ApiResponse<AuthResponseDto>> =
      await axios.post(`${BASE_AUTH_API_URL}/register`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}
