export enum MembershipStatus {
  PARTICIPATING = "PARTICIPATING",
  BANNED = "BANNED",
  REMOVED = "REMOVED",
}

export enum MembershipRole {
  HOST = "HOST",
  MEMBER = "MEMBER",
}

export interface UpdateMembershipDto {
  status: MembershipStatus;
  role: MembershipRole;
}
