import { UserInformation } from "./user-information.dto";

export type Relationship = {
  id: string;
  userA: UserInformation;
  userB: UserInformation;
  status: string;
  blockedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
