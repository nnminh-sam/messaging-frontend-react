import { Conversation } from "./conversation.dto";
import { UserInformation } from "./user-information.dto";

export type Message = {
  id: string;
  sendBy: UserInformation;
  conversation: Conversation;
  message: string;
  createdAt: Date;
};
