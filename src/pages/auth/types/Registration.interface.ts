import { Gender } from "./Gender.enum";

export interface Registration {
  firstName: string;

  lastName: string;

  email: string;

  password: string;

  dateOfBirth: Date;

  gender: Gender;

  phone: string;

  username: string;
}

export function GetRegistrationDefaultValue(): Registration {
  return {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: new Date(),
    gender: Gender.MALE,
    phone: "",
    username: "",
  };
}
