import {
  GetDefaultUserInformation,
  UserInformation,
} from "../../../apis/chat/types/user-information.dto";

export interface AuthenticationContextProp {
  accessToken: string;

  userInformation: UserInformation;

  registrationAction: any;

  loginAction: any;

  logoutAction: any;
}

export function GetDefaultAuthenticationContext(): AuthenticationContextProp {
  return {
    accessToken: "",
    userInformation: GetDefaultUserInformation(),
    registrationAction: null,
    loginAction: null,
    logoutAction: null,
  };
}
