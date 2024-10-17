import { UserInformation } from "../../user/types/user-information.dto";

export type Conversation = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  host: UserInformation | string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
};
