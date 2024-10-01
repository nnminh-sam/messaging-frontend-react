import React, { ChangeEvent, useState } from "react";
import FormInput from "../../components/forms/FormInput";
import { LoginPayload } from "../../types/dto/login.dto";
import "../../assets/style/components/forms/BasicForm.css";
import { login } from "../../apis/auth/login.service";
import { AuthResponseDto } from "../../apis/auth/types/AuthResponse.dto";
import { ErrorResponse } from "../../types/interface/error-response.dto";

const Authentication: React.FC = () => {
  const [authRequestError, setAuthRequestError] = useState("");
  const [fieldError, setFieldError] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const handleFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setFieldError({ ...fieldError, [event.target.name]: "" });
    setAuthRequestError("");
  };

  const sendAuthenticateRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const { email, password } = form;
    const response: AuthResponseDto | ErrorResponse = await login(
      email,
      password
    );
    if ("data" in response) {
      const data: AuthResponseDto = response.data as AuthResponseDto;
      localStorage.setItem("accessToken", data.accessToken);
      window.location.href = "/";
    } else {
      const error: ErrorResponse = response as ErrorResponse;
      setAuthRequestError(error.message);
      localStorage.removeItem("accessToken");
    }
  };

  return (
    <div className="parent-container">
      <div className="form-container authenticate-form">
        <div className="form-header">
          <h2>Login</h2>
        </div>
        <form
          className="form-body authenticate-form"
          onSubmit={sendAuthenticateRequest}
        >
          <div className="form-fields-container">
            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter email"
              onChange={handleFormUpdate}
              isRequired={true}
              errorMessage={fieldError.email}
            />
            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              onChange={handleFormUpdate}
              isRequired={true}
              errorMessage={fieldError.password}
            />
          </div>
          <div className="form-submit">
            <button className="submit-button" type="submit">
              Login
            </button>
            {authRequestError && (
              <p className="authenticate-request-error">{authRequestError}</p>
            )}
          </div>
        </form>
        <div className="form-footer">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
