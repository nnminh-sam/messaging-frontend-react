import { UserInformation } from "../user/types/user-information.dto";

export enum MediaStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Media {
  id: string;
  user: UserInformation;
  filename: string;
  filePath: string;
  mimetype: string;
  originalname: string;
  size: number;
  status: MediaStatus;
  createdAt: Date;
  updatedAt: Date;
}
