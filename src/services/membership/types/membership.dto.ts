import { Conversation } from "../../conversation/types/conversation.dto";
import { UserInformation } from "../../user/types/user-information.dto";

export type Membership = {
  id: string;
  user: string;
  conversation: Conversation;
  role: string;
  status: string;
  partner?: UserInformation;
  createdAt: Date;
  updatedAt: Date;
};
