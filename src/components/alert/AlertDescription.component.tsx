import React from "react";
import { AlertDescriptionProp } from "./types/AlertDescription.prop";

const AlertDescription: React.FC<AlertDescriptionProp> = ({
  fieldName,
  message,
}) => {
  return <p className={`alert-description ${fieldName}`}>{message}</p>;
};

export default AlertDescription;
