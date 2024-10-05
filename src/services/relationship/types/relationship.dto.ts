import { UserInformation } from "../../user/types/user-information.dto";

export type Relationship = {
  id: string;
  userA: UserInformation;
  userB: UserInformation;
  status: string;
  blockedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
