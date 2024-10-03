import { ChangeEvent } from "react";

export interface FormInputProp {
  key?: string;
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  errorMessage?: string;
}
