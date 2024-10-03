export type UserInformation = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  gender: string;
  dateOfBirth: Date;
  phone: string;
};

export function GetDefaultUserInformation(): UserInformation {
  return {
    id: "",
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    username: "",
    gender: "",
    dateOfBirth: new Date(),
    phone: "",
  };
}
