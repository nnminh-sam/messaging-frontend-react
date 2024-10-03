import axios, { AxiosResponse } from "axios";
import { AuthResponseDto } from "./types/AuthResponse.dto";
import { Registration } from "../../pages/auth/types/Registration.interface";
import { ApiResponse } from "../../types/api-response.dto";

const env: ImportMetaEnv = import.meta.env;
const API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/auth/register`;

export async function Register(
  payload: Registration
): Promise<ApiResponse<AuthResponseDto>> {
  try {
    const response: AxiosResponse<ApiResponse<AuthResponseDto>> =
      await axios.post(API_URL, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}
