import React, { useState, useContext, createContext, Context } from "react";
import { useNavigate } from "react-router-dom";
import { Login, Register } from "../../apis/auth/authentication.service";
import {} from "../../apis/auth/authentication.service";
import {} from "../../pages/auth/Authenticate";
import { Authentication } from "../../pages/auth/types/Authenticate.interface";
import {
  AuthenticationContextProp,
  GetDefaultAuthenticationContext,
} from "./types/AuthenticationContextProp.interface";
import { GetDefaultUserInformation } from "../../apis/chat/types/user-information.dto";
import { GetUserInformation } from "../../apis/chat/user.service";
import { Registration } from "../../pages/auth/types/Registration.interface";

const AuthContext: Context<AuthenticationContextProp> = createContext(
  GetDefaultAuthenticationContext()
);

const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [userInformation, setUserInformation] = useState(
    GetDefaultUserInformation()
  );
  const navigate = useNavigate();

  const getUserInformation = async (token: string) => {
    try {
      const { data } = await GetUserInformation(token);
      setUserInformation(data);
    } catch (error: any) {
      navigate("/");
    }
  };

  const loginAction = async (form: Authentication) => {
    const { data } = await Login(form.email, form.password);
    if (data && data.accessToken) {
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      await getUserInformation(data.accessToken);
      navigate("/");
      return;
    }
  };

  const registrationAction = async (form: Registration) => {
    const email: string = form.email;
    const username = email.split("@")[0];
    const { data } = await Register({
      ...form,
      username,
    });
    if (data && data.accessToken) {
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      await getUserInformation(data.accessToken);
      navigate("/");
      return;
    }
  };

  const logoutAction = () => {
    setAccessToken("");
    setUserInformation(GetDefaultUserInformation());
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userInformation,
        registrationAction,
        loginAction,
        logoutAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationProvider;

export const useAuth = (): AuthenticationContextProp => {
  return useContext(AuthContext);
};
