import React from "react";
import "../../assets/style/pages/auth/SharedAuthForm.css";
import {
  Authentication,
  GetAuthenticationDefaultValue,
} from "./types/Authenticate.interface";
import { FormBase } from "../../components/forms/FormBase";
import { useAuth } from "../../components/auth/AuthenticationProvider";
import { AuthenticationContextProp } from "../../components/auth/types/AuthenticationContextProp.interface";

export const AuthenticationForm: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();

  const onFormSubmit = async (form: Authentication) => {
    await authContext.loginAction(form);
    return;
  };

  const formInputData: any[] = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "example@domain.com",
      isRequired: true,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
      isRequired: true,
    },
  ];

  return (
    <div className="authentication-form auth-form">
      {/* TODO: Remove this p tag */}
      <div
        style={{
          padding: "10px",
        }}
      >
        <p>Email 1: Matilda51@yahoo.com</p>
      </div>
      <FormBase<Authentication>
        name="registration"
        title="Login"
        formInputs={formInputData}
        formInitializedObject={GetAuthenticationDefaultValue()}
        onFormSubmit={onFormSubmit}
        submitButtonText="Login"
        footerChildren={[
          <div className="form-redirect direct-to-login">
            Don't have an account? <a href="/register">Sign up here!</a>
          </div>,
        ]}
      />
    </div>
  );
};
