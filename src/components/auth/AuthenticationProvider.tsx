import React, {
  useState,
  useContext,
  createContext,
  Context,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { Login, Register } from "../../services/auth/authentication.service";
import {} from "../../services/auth/authentication.service";
import {} from "../../pages/auth/Authenticate";
import { Authentication } from "../../pages/auth/types/Authenticate.interface";
import {
  AuthenticationContextProp,
  GetDefaultAuthenticationContext,
} from "./types/AuthenticationContextProp.interface";
import { GetDefaultUserInformation } from "../../services/user/types/user-information.dto";
import { GetUserInformation } from "../../services/user/user.service";
import { Registration } from "../../pages/auth/types/Registration.interface";

const AuthContext: Context<AuthenticationContextProp> = createContext(
  GetDefaultAuthenticationContext()
);

const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [userInformation, setUserInformation] = useState(
    GetDefaultUserInformation()
  );

  const getUserInformation = async (token: string) => {
    try {
      const { data } = await GetUserInformation(token);
      setUserInformation(data);
    } catch (error: any) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (accessToken && !userInformation.fullName) {
      getUserInformation(accessToken);
    }
  }, [accessToken]);

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
        getUserInformation,
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
