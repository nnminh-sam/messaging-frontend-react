import { ChangeEvent, useState } from "react";
import "../../assets/style/components/forms/FormInput.css";
import React from "react";

type EnumType = Record<string, string>;

export interface FormEnumInputProp<T extends EnumType> {
  id: string;
  enumType: T;
  label: string;
  onChange?: (value: T[keyof T]) => void;
  isRequired?: boolean;
}

export const FormEnumInput = <T extends EnumType>({
  id,
  enumType,
  label,
  onChange,
  isRequired,
}: FormEnumInputProp<T>) => {
  const [selectedValue, setSelectedValue] = useState<T[keyof T] | string>("");

  const handleValueChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const value = event.target.value as T[keyof T];
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {isRequired && <span className="required-field-indicator"> *</span>}
      </label>
      <select
        id={id}
        name={id}
        value={selectedValue}
        onChange={handleValueChange}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {Object.values(enumType).map((value) => (
          <option key={value} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}{" "}
          </option>
        ))}
      </select>
    </div>
  );
};
