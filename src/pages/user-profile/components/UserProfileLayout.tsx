import "../../../assets/style/pages/user-profile/UserProfileLayout.css";
import { Button, DatePicker, Form, Input, Layout, Select, Avatar } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { ReactNode, useEffect, useState } from "react";
import { changePassword } from "../../../services/auth/authentication.service";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import { updateUserInformation } from "../../../services/user/user.service";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import dayjs from "dayjs";
import AlertComponent from "../../../components/alert/Alert.component";
import AlertDescription from "../../../components/alert/AlertDescription.component";
import { AlertType } from "../../../components/alert/types/AlertComponent.prop";

const UserProfileLayout: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const initialUserData: UserInformation = authContext.userInformation;
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertDescriptions, setAlertDescriptions] = useState<ReactNode[]>([]);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.ERROR);

  useEffect(() => {
    form.setFieldsValue({
      ...initialUserData,
      dateOfBirth: dayjs(initialUserData.dateOfBirth),
    });
  }, [form, initialUserData]);

  const userInformationUpdateHandler = async (values: any) => {
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth.toDate(),
    };
    const response = await updateUserInformation(
      authContext.accessToken,
      formattedValues
    );
    if ("data" in response) {
      setAlertMessage("Update user information success!");
      setAlertType(AlertType.SUCCESS);
    } else if ("status" in response) {
      setAlertMessage(`${response.message}`);
      setAlertType(AlertType.ERROR);
      setAlertDescriptions(
        response?.details.map((detail: any, index: number) => {
          return (
            <AlertDescription
              message={detail.message}
              fieldName={detail.property}
            />
          );
        })
      );
    } else {
      setAlertMessage("Unexpected error");
      setAlertType(AlertType.ERROR);
    }
    setAlertVisible(true);
  };

  const changePasswordHandler = async (values: any) => {
    const response = await changePassword(authContext.accessToken, {
      ...values,
    });

    if ("data" in response) {
      setAlertMessage("Password updated successfully");
      setAlertType(AlertType.SUCCESS);
    } else if ("status" in response) {
      setAlertMessage(response.message);
      setAlertType(AlertType.ERROR);
      setAlertDescriptions(
        response?.details.map((detail: any, index: number) => {
          return (
            <AlertDescription
              message={detail.message}
              fieldName={detail.property}
            />
          );
        })
      );
    } else {
      setAlertMessage("Unexpected error");
      setAlertType(AlertType.ERROR);
    }

    setAlertVisible(true);
  };

  return (
    <Layout className="user-profile-layout">
      <Content className="user-profile-content">
        {alertVisible && (
          <AlertComponent
            type={alertType}
            message={alertMessage}
            descriptions={alertDescriptions}
            name="form-alert"
            onClose={() => {
              setAlertVisible(false);
            }}
          />
        )}
        <div className="avatar-container">
          <Avatar
            size={100}
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          />
        </div>
        <Form
          form={form}
          className="user-information-form"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            ...authContext.userInformation,
            dateOfBirth: dayjs(initialUserData.dateOfBirth),
          }}
          onFinish={userInformationUpdateHandler}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select your gender" }]}
          >
            <Select
              defaultValue={authContext.userInformation.gender}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select date of birth"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Button className="update-button" type="primary" htmlType="submit">
            Update
          </Button>
        </Form>

        <Form
          form={passwordForm}
          className="password-update-form"
          name="password-update"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={changePasswordHandler}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password placeholder="Enter your current password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
            ]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label="Confirm New Password"
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your new password" />
          </Form.Item>

          <Button className="update-button" type="primary" htmlType="submit">
            Change Password
          </Button>
        </Form>
      </Content>
    </Layout>
  );
};

export default UserProfileLayout;
