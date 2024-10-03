import { ChangeEvent, useState } from "react";
import { FormInput } from "./FormInput";
import { FormEnumInput } from "./FormEnumInput";
import { FormBaseProp } from "./types/FormBaseProp.interface";
import "../../assets/style/components/forms/FormBase.css";
import React from "react";

export const FormBase = <FORM_PROP,>({
  name,
  title,
  formInputs,
  formInitializedObject,
  onFormSubmit,
  submitButtonText,
  footerChildren,
}: FormBaseProp<FORM_PROP>) => {
  const [form, setForm] = useState<FORM_PROP>(formInitializedObject);
  const [fieldError, setFieldError] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState("");

  const formUpdateHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setFieldError({ ...fieldError, [event.target.name]: "" });
    setFormError("");
  };

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onFormSubmit(form);
    } catch (error: any) {
      const errorMessage: string =
        error.message || "An unknown error occurred.";
      setFormError(errorMessage);
    }
  };

  return (
    <div className={`form-component ${name}-form`}>
      <form className="form-container" onSubmit={formSubmitHandler}>
        <div className="form-header">
          <h2>{title}</h2>
        </div>
        <div className="form-body">
          {formInputs?.map((input: any) => {
            return "enumType" in input ? (
              <FormEnumInput
                key={input.id}
                id={input.id}
                enumType={input.enumType}
                label={input.label}
                onChange={(value) => {
                  setForm({ ...form, [input.id]: value });
                }}
                isRequired={input.isRequired}
              />
            ) : (
              <FormInput
                key={input.id}
                id={input.id}
                label={input.label}
                type={input.type}
                placeholder={input.placeholder}
                onChange={formUpdateHandler}
                isRequired={input.isRequired}
                errorMessage={fieldError[input.id]}
              />
            );
          })}
        </div>
        <div className="form-footer">
          <button type="submit">
            {submitButtonText ? submitButtonText : "Submit"}
          </button>
          {formError && <p className="form-error">{formError}</p>}
          {footerChildren && (
            <div className="footer-children">
              {footerChildren.map((children, index) => (
                <div key={index}>{children}</div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
