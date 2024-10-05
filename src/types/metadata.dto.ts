export interface Pagination {
  page: number;
  size: number;
  totalPage: number;
  totalDocument: number;
}

export interface ApiMetadata {
  pagination: Pagination;
  count: number;
}
