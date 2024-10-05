import { Conversation } from "./conversation.dto";

export type Membership = {
  id: string;
  user: string;
  conversation: Conversation;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
