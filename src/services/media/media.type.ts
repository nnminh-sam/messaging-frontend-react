import { Conversation } from "../conversation/types/conversation.dto";
import { UserInformation } from "../user/types/user-information.dto";

export enum MediaStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Media {
  id: string;
  user: UserInformation;
  conversation: Conversation;
  filename: string;
  filePath: string;
  mimetype: string;
  originalname: string;
  size: number;
  status: MediaStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaQuery {
  status?: MediaStatus;
  room?: string;
}
