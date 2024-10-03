import React from "react";
import "../../assets/style/pages/auth/SharedAuthForm.css";
import {
  Authentication,
  GetAuthenticationDefaultValue,
} from "./types/Authenticate.interface";
import { FormBase } from "../../components/forms/FormBase";
import { Login } from "../../apis/auth/login.service";
import { useNavigate } from "react-router-dom";

export const AuthenticationForm: React.FC = () => {
  const navigate = useNavigate();

  const onFormSubmit = async (form: Authentication) => {
    const data = await Login(form.email, form.password);
    localStorage.setItem("accessToken", data.accessToken);
    navigate("/");
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
