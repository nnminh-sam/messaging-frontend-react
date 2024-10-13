import { Conversation } from "../../conversation/types/conversation.dto";
import { UserInformation } from "../../user/types/user-information.dto";

export type Message = {
  id: string;
  sendBy: UserInformation;
  conversation: Conversation;
  message: string;
  createdAt: Date;
};
