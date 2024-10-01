export interface ErrorResponse {
  message: string;
  path: string;
  status: string;
  statusCode: number;
  timestamp: string;
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.message === "string" &&
    typeof obj.path === "string" &&
    typeof obj.status === "string" &&
    typeof obj.statusCode === "number" &&
    typeof obj.timestamp === "string" &&
    Object.keys(obj).length === 5
  );
}
