export interface ErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  timestamp: Date;
  path: string;
  details?: any;
}
