import { UserInformation } from "../../../services/user/types/user-information.dto";

export interface NewMessageDto {
  message: string;
  room: string;
  sender: UserInformation;
  timestamp: Date;
}
