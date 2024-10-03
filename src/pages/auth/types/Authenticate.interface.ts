export interface Authentication {
  email: string;

  password: string;
}

export function GetAuthenticationDefaultValue(): Authentication {
  return {
    email: "",
    password: "",
  };
}
