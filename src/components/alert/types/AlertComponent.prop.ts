import { ReactNode } from "react";

export enum AlertType {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export interface AlertComponentProp {
  name: string;
  message: string;
  type: AlertType;
  showIcon?: boolean;
  closeable?: boolean;
  descriptions?: ReactNode[];
}
