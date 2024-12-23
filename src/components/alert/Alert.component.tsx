import React from "react";
import { AlertComponentProp } from "./types/AlertComponent.prop";
import { Alert } from "antd";

const AlertComponent: React.FC<AlertComponentProp> = ({
  name,
  type,
  message,
  descriptions,
  closeable,
  showIcon,
  onClose,
}) => {
  return (
    <Alert
      className={name}
      type={type}
      showIcon={showIcon || true}
      closable={closeable || true}
      message={message}
      description={descriptions}
      onClose={onClose}
    ></Alert>
  );
};

export default AlertComponent;
