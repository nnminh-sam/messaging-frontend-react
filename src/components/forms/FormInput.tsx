import React, { ChangeEvent } from "react";

import "../../assets/style/components/forms/FormInput.css";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  errorMessage?: string;
}

const FormInput: React.FC<FormInputProps> = (payload: FormInputProps) => {
  return (
    <div className="form-input">
      <label htmlFor={payload.id}>
        {payload.label}{" "}
        {payload.isRequired && (
          <span className="required-field-indicator">*</span>
        )}
      </label>
      <input
        id={payload.id}
        name={payload.id}
        type={payload.type}
        placeholder={payload.placeholder}
        onChange={payload.onChange}
      />
      {payload.errorMessage && (
        <p className="error-message">{payload.errorMessage}</p>
      )}
    </div>
  );
};

export default FormInput;
