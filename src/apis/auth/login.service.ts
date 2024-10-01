import axios, { AxiosResponse } from "axios";
import { AuthResponseDto } from "./types/AuthResponse.dto";
import { ErrorResponse } from "../../types/interface/error-response.dto";

const env: ImportMetaEnv = import.meta.env;
const API_URL: string = `${env.VITE_BACKEND_URL}/${env.VITE_BACKEND_API_PREFIX}/${env.VITE_BACKEND_API_VERSION}/auth/login`;

export async function login(
  email: string,
  password: string
): Promise<AuthResponseDto | ErrorResponse> {
  try {
    const response: AxiosResponse<AuthResponseDto> = await axios.post(API_URL, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data as ErrorResponse;
    }
    return { message: "An unknown error occurred" } as ErrorResponse;
  }
}
