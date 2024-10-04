import { ApiMetadata } from "./metadata.dto";

export type ListApiResponse<T> = {
  data: T[];
  metadata: ApiMetadata;
};
