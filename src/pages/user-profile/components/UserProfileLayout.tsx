import { Button, DatePicker, Form, Input, Layout, Select, Avatar } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect } from "react";
import { UserInformation } from "../../../services/user/types/user-information.dto";
import { AuthenticationContextProp } from "../../../components/auth/types/AuthenticationContextProp.interface";
import { useAuth } from "../../../components/auth/AuthenticationProvider";
import dayjs from "dayjs";

const UserProfileLayout: React.FC = () => {
  const authContext: AuthenticationContextProp = useAuth();
  const initialUserData: UserInformation = authContext.userInformation;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...initialUserData,
      dateOfBirth: dayjs(initialUserData.dateOfBirth),
    });
  }, [form, initialUserData]);

  const handleFinish = (values: any) => {
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth.toDate(),
    };
    console.log(formattedValues);
  };

  return (
    <Layout className="user-profile-layout">
      <Content className="user-profile-content">
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
          onFinish={handleFinish}
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
      </Content>
    </Layout>
  );
};

export default UserProfileLayout;
