export type Pagination = {
  page: number;
  size: number;
};

export type ApiMetadata = {
  pagination: Pagination;

  count: number;
};
