import {
  GetDefaultUserInformation,
  UserInformation,
} from "../../../services/user/types/user-information.dto";

export interface AuthenticationContextProp {
  accessToken: string;

  userInformation: UserInformation;

  registrationAction: any;

  loginAction: any;

  logoutAction: any;

  getUserInformation: any;
}

export function GetDefaultAuthenticationContext(): AuthenticationContextProp {
  return {
    accessToken: "",
    userInformation: GetDefaultUserInformation(),
    registrationAction: null,
    loginAction: null,
    logoutAction: null,
    getUserInformation: null,
  };
}
