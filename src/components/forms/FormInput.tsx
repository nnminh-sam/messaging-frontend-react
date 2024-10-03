import "../../assets/style/components/forms/FormInput.css";
import { FormInputProp } from "./types/FormInputProp.interface";

export const FormInput: React.FC<FormInputProp> = (props: FormInputProp) => {
  return (
    <div className="form-field">
      <label htmlFor={props.id}>
        {props.label}
        {props.isRequired && (
          <span className="required-field-indicator"> *</span>
        )}
      </label>
      <input
        id={props.id}
        name={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      {props.errorMessage && (
        <p className="error-message">{props.errorMessage}</p>
      )}
    </div>
  );
};
