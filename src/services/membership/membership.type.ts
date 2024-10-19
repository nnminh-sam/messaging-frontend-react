import { Conversation } from "../conversation/types/conversation.dto";
import { UserInformation } from "../user/types/user-information.dto";

export enum MembershipStatus {
  PARTICIPATING = "PARTICIPATING",
  BANNED = "BANNED",
  AWAY = "AWAY",
}

export enum MembershipRole {
  HOST = "HOST",
  MEMBER = "MEMBER",
}

export interface Membership {
  id: string;
  user: UserInformation;
  partner?: UserInformation;
  conversation: Conversation;
  status: MembershipStatus;
  role: MembershipRole;
  createdAt: Date;
  updatedAt: Date;
  bannedAt?: Date;
}

export interface CreateMembershipDto {
  user: string;
  conversation: string;
  role: MembershipRole;
}

export interface ChangeHostDto {
  newHost: string;
  conversation: string;
}

export interface BanUserDto {
  targetUser: string;
  conversation: string;
}
