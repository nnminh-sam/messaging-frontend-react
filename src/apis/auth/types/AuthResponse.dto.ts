export interface AuthResponseDto {
  accessToken: string;
}

export function isAuthResponseDto(obj: any) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  return typeof obj.accessToken === "string" && Object.keys(obj).length === 1;
}
