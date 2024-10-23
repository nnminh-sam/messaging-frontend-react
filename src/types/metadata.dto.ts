export interface Pagination {
  page: number;
  size: number;
  sortBy?: string;
  orderBy?: string;
  totalPage?: number;
  totalDocument?: number;
}

export interface ApiMetadata {
  pagination: Pagination;
  count: number;
}
