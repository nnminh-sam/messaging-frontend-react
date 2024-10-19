export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface PaginationDto {
  page: number;
  size: number;
  sortBy?: string;
  orderBy?: string;
}
