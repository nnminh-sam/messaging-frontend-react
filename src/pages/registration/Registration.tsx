import { ChangeEvent, useMemo, useState } from "react";
import { UserInterface } from "../../types/interface/user";
import FormInput from "../../components/forms/FormInput";
import GenderInput from "../../components/forms/GenderInput";
import { GenderEnum } from "../../types/enum/gender.enum";
import React from "react";

const Registration: React.FC = () => {
  const [authRequestError, setAuthRequestError] = useState("");
  const [fieldError, setFieldError] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<UserInterface>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: new Date(),
    gender: "",
    phone: "",
    address: "",
  });
  const genderOptions: Map<string, string> = useMemo(
    () =>
      new Map<string, string>(
        Object.values(GenderEnum).map((value) => [value, value])
      ),
    []
  );

  const handleFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setFieldError({ ...fieldError, [event.target.name]: "" });
    setAuthRequestError("");
  };

  const sendRegisterRequest = async () => {
    return;
  };

  return (
    <div className="parent-container">
      <div className="form-container">
        <div className="form-header">
          <h2>Register</h2>
        </div>
        <form
          className="form-body register-form"
          onSubmit={sendRegisterRequest}
        >
          <div className="form-fields-container">
            <FormInput
              id="first-name"
              label="First name"
              type="text"
              placeholder="First name"
              onChange={handleFormUpdate}
              isRequired={true}
            />
            <FormInput
              id="last-name"
              label="Last name"
              type="text"
              placeholder="Last name"
              onChange={handleFormUpdate}
              isRequired={true}
            />
            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="Email"
              onChange={handleFormUpdate}
              isRequired={true}
            />
            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="Password"
              onChange={handleFormUpdate}
              isRequired={true}
            />
            <FormInput
              id="dob"
              label="Date of birth"
              type="date"
              placeholder="Date of birth"
              onChange={handleFormUpdate}
              isRequired={true}
            />
            <GenderInput id="gender" label="Gender" options={genderOptions} />
            <FormInput
              id="phone"
              label="Phone"
              type="tel"
              placeholder="Phone number"
              onChange={handleFormUpdate}
              isRequired={true}
            />
            <FormInput
              id="address"
              label="Address"
              type="text"
              placeholder="Address"
              onChange={handleFormUpdate}
            />
          </div>
          <div className="form-submit">
            <button className="submit-button" type="submit">
              Register
            </button>
            {authRequestError && (
              <p className="authenticate-request-error">{authRequestError}</p>
            )}
          </div>
        </form>
        <div className="form-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Registration;
